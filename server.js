'use strict';

const express = require('express');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('redis');

const PORT = Number(process.env.PORT || 8098);
const BASE_PATH = normalizeBasePath(process.env.BASE_PATH || '/maffia');
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const SESSION_TTL_SECONDS = Number(process.env.SESSION_TTL_SECONDS || 21600); // 6 hours

const PHASES = new Set([
  'lobby',
  'round_ready',
  'intro_night',
  'day',
  'night',
  'endgame_warning',
  'round_ended',
  'session_closed'
]);

const PRIMARY_EXTRAS = [
  'collaborator',
  'bodyguard',
  'protectedCitizen',
  'grocer',
  'sarika',
  'vogon'
];

const SECONDARY_EXTRAS = ['kamikaze', 'lovers'];
const VALID_ELIMINATION_REASONS = new Set(['day', 'night', 'extra', 'manual']);

const app = express();
const api = express.Router();
const redis = createClient({ url: REDIS_URL });

redis.on('error', (err) => {
  console.error('[redis] error:', err);
});

app.disable('x-powered-by');
app.use(express.json({ limit: '200kb' }));

function normalizeBasePath(value) {
  if (!value || value === '/') return '';
  let result = String(value).trim();
  if (!result.startsWith('/')) result = `/${result}`;
  if (result.endsWith('/')) result = result.slice(0, -1);
  return result;
}

function sessionKey(code) {
  return `maffia:session:${code}`;
}

function now() {
  return Date.now();
}

function id(prefix = 'p') {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
}

function randomFiveDigitCode() {
  return String(crypto.randomInt(10000, 100000));
}

function sanitizeName(name) {
  const cleaned = String(name || '').trim().replace(/\s+/g, ' ').slice(0, 32);
  if (!cleaned) throw httpError(400, 'name_required');
  return cleaned;
}

function sanitizeLanguage(language) {
  const lang = String(language || 'hu').toLowerCase();
  return ['hu', 'en', 'de'].includes(lang) ? lang : 'hu';
}

function normalizeSelectedExtras(input) {
  const selected = input && typeof input === 'object' ? input : {};
  const result = {};
  [...PRIMARY_EXTRAS, ...SECONDARY_EXTRAS].forEach((key) => {
    result[key] = Boolean(selected[key]);
  });
  return result;
}

function httpError(status, code, details) {
  const err = new Error(code);
  err.status = status;
  err.code = code;
  if (details) err.details = details;
  return err;
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = crypto.randomInt(0, i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getMafiaCount(activeCount) {
  if (activeCount <= 8) return 2;
  if (activeCount <= 13) return 3;
  if (activeCount <= 16) return 4;
  return 5;
}

async function loadSession(code) {
  const raw = await redis.get(sessionKey(code));
  if (!raw) return null;
  const session = JSON.parse(raw);
  normalizeSessionShape(session);
  return session;
}

function normalizeSessionShape(session) {
  session.players ||= [];
  session.history ||= [];
  session.events ||= [];
  session.pendingActions ||= [];
  session.nightMarks ||= { bodyguardTargetId: null, sarikaTargetId: null };
  session.selectedExtras = normalizeSelectedExtras(session.selectedExtras);
  session.instructionIndex ||= 0;
  session.round ||= 1;
  session.phase ||= 'lobby';
}

async function saveSession(session) {
  session.updatedAt = now();
  await redis.setEx(sessionKey(session.code), SESSION_TTL_SECONDS, JSON.stringify(session));
}

async function touchSession(code) {
  await redis.expire(sessionKey(code), SESSION_TTL_SECONDS);
}

async function sessionTtl(code) {
  const ttl = await redis.ttl(sessionKey(code));
  return ttl > 0 ? ttl : null;
}

async function generateUniqueCode() {
  for (let i = 0; i < 50; i += 1) {
    const code = randomFiveDigitCode();
    const exists = await redis.exists(sessionKey(code));
    if (!exists) return code;
  }
  throw httpError(503, 'code_generation_failed');
}

function getPlayer(session, playerId) {
  return session.players.find((p) => p.id === playerId);
}

function requirePlayer(session, playerId) {
  const player = getPlayer(session, playerId);
  if (!player) throw httpError(404, 'player_not_found');
  return player;
}

function requireGameMaster(session, actorPlayerId) {
  const actor = requirePlayer(session, actorPlayerId);
  if (actor.id !== session.gameMasterId || actor.kicked) {
    throw httpError(403, 'not_game_master');
  }
  return actor;
}

function activeRolePlayers(session) {
  return session.players
    .filter((p) => !p.kicked && p.id !== session.gameMasterId)
    .sort((a, b) => a.seatIndex - b.seatIndex);
}

function liveRolePlayers(session) {
  return activeRolePlayers(session).filter((p) => p.alive && p.role);
}

function resetNightMarks(session) {
  session.nightMarks = { bodyguardTargetId: null, sarikaTargetId: null };
}

function resetRoundState(session) {
  for (const p of session.players) {
    p.isGameMaster = p.id === session.gameMasterId;
    p.alive = !p.kicked;
    p.role = null;
    p.team = null;
    p.extras = [];
    p.protectedMafia = false;
    p.protectedMafiaCheckUsed = false;
    p.roleRevealed = false;
    delete p.loverPartnerId;
  }
  session.events = [];
  session.pendingActions = [];
  session.winNotice = null;
  session.suggestedWinner = null;
  session.instructionIndex = 0;
  resetNightMarks(session);
}

function assignRoles(session) {
  const activePlayers = activeRolePlayers(session);
  if (activePlayers.length < 6) {
    throw httpError(400, 'minimum_players_required', { activePlayers: activePlayers.length });
  }

  resetRoundState(session);

  const shuffled = shuffle(activePlayers);
  const mafiaCount = getMafiaCount(shuffled.length);
  const mafiaPlayers = shuffled.slice(0, mafiaCount);
  const detectivePlayer = shuffled[mafiaCount];
  const citizenPlayers = shuffled.slice(mafiaCount + 1);

  for (const p of mafiaPlayers) {
    p.role = 'mafia';
    p.team = 'mafia';
  }

  detectivePlayer.role = 'detective';
  detectivePlayer.team = 'citizens';

  for (const p of citizenPlayers) {
    p.role = 'citizen';
    p.team = 'citizens';
  }

  const protectedMafia = shuffle(mafiaPlayers)[0];
  protectedMafia.protectedMafia = true;

  const selectedPrimaryExtras = PRIMARY_EXTRAS.filter((key) => session.selectedExtras[key]);
  const eligibleCitizenPlayers = shuffle(citizenPlayers);
  const skippedExtras = [];

  selectedPrimaryExtras.forEach((extra, index) => {
    const target = eligibleCitizenPlayers[index];
    if (!target) {
      skippedExtras.push(extra);
      return;
    }
    target.extras.push(extra);
    if (extra === 'collaborator') {
      // Team remains citizens for detective/win-condition counting, but scoring uses the extra.
      target.team = 'citizens';
    }
  });

  if (session.selectedExtras.kamikaze) {
    const target = shuffle(activePlayers)[0];
    if (target) target.extras.push('kamikaze');
  }

  if (session.selectedExtras.lovers) {
    const lovers = shuffle(activePlayers).slice(0, 2);
    if (lovers.length === 2) {
      lovers[0].extras.push('lovers');
      lovers[1].extras.push('lovers');
      lovers[0].loverPartnerId = lovers[1].id;
      lovers[1].loverPartnerId = lovers[0].id;
      session.lovers = [lovers[0].id, lovers[1].id];
    } else {
      skippedExtras.push('lovers');
    }
  } else {
    session.lovers = [];
  }

  if (skippedExtras.length) {
    session.pendingActions.push({
      id: id('a'),
      type: 'skipped_extras',
      extras: skippedExtras,
      createdAt: now()
    });
  }

  session.phase = 'round_ready';
  session.instructionIndex = 0;
}

function buildInstructionKeys(session) {
  const phase = session.phase;
  const extras = session.selectedExtras || {};

  if (phase === 'intro_night') {
    const keys = [
      'inst_all_close_eyes',
      'inst_detective_intro_open',
      'inst_detective_close',
      'inst_mafia_intro_open',
      'inst_protected_mafia_signal',
      'inst_mafia_close'
    ];
    if (extras.lovers) {
      keys.push('inst_lovers_intro_open', 'inst_lovers_close');
    }
    keys.push('inst_morning_open');
    return keys;
  }

  if (phase === 'night') {
    const keys = ['inst_all_close_eyes'];
    if (extras.bodyguard) {
      keys.push('inst_bodyguard_open', 'inst_bodyguard_close');
    }
    if (extras.sarika) {
      keys.push('inst_sarika_open', 'inst_sarika_close');
    }
    keys.push('inst_detective_night_open', 'inst_detective_close');
    if (extras.vogon) {
      keys.push('inst_vogon_watch');
    }
    keys.push('inst_mafia_vote_names', 'inst_morning_open');
    return keys;
  }

  if (phase === 'day') {
    return ['inst_day_discussion', 'inst_day_vote'];
  }

  if (phase === 'endgame_warning') {
    return ['inst_endgame_warning'];
  }

  if (phase === 'round_ready') {
    return ['inst_roles_ready'];
  }

  if (phase === 'round_ended') {
    return ['inst_round_ended'];
  }

  return ['inst_lobby'];
}

function currentInstructionKey(session) {
  const keys = buildInstructionKeys(session);
  const maxIndex = Math.max(0, keys.length - 1);
  session.instructionIndex = Math.min(Math.max(0, session.instructionIndex || 0), maxIndex);
  return {
    key: keys[session.instructionIndex],
    index: session.instructionIndex,
    total: keys.length,
    keys
  };
}

function checkWinCondition(session) {
  const livePlayers = liveRolePlayers(session);
  const liveMafia = livePlayers.filter((p) => p.role === 'mafia').length;
  const liveNonMafia = livePlayers.filter((p) => p.role !== 'mafia').length;

  let notice = null;
  if (livePlayers.length && liveMafia === 0) {
    notice = { type: 'win', winner: 'citizens', key: 'notice_citizens_can_win' };
  } else if (livePlayers.length && liveMafia >= liveNonMafia) {
    notice = { type: 'win', winner: 'mafia', key: 'notice_mafia_can_win' };
  } else if (livePlayers.length === 3 && liveMafia === 1 && liveNonMafia === 2) {
    notice = { type: 'endgame', winner: null, key: 'notice_endgame_three' };
  }

  if (notice) {
    session.winNotice = notice;
    session.suggestedWinner = notice.winner;
    session.phase = 'endgame_warning';
    session.instructionIndex = 0;
  } else {
    session.winNotice = null;
    session.suggestedWinner = null;
  }
}

function playerPublicView(player, options) {
  const { revealRoles, isSelf, isGameMaster } = options;
  const canSeeRole = revealRoles || isGameMaster || (isSelf && player.roleRevealed);
  return {
    id: player.id,
    name: player.name,
    language: player.language,
    isGameMaster: player.isGameMaster,
    seatIndex: player.seatIndex,
    alive: player.alive,
    kicked: player.kicked,
    connected: player.connected,
    role: canSeeRole ? player.role : 'hidden',
    team: canSeeRole ? player.team : 'hidden',
    extras: canSeeRole ? player.extras : [],
    protectedMafia: canSeeRole ? player.protectedMafia : false,
    protectedMafiaCheckUsed: canSeeRole ? player.protectedMafiaCheckUsed : false,
    loverPartnerId: canSeeRole ? player.loverPartnerId || null : null,
    roleRevealed: Boolean(player.roleRevealed)
  };
}

function buildRoundSummary(session, winner) {
  const roundPlayers = session.players
    .filter((p) => p.role && !p.kicked)
    .sort((a, b) => a.seatIndex - b.seatIndex)
    .map((p) => {
      const isCollaborator = p.extras.includes('collaborator');
      const won = winner === 'mafia'
        ? p.role === 'mafia' || isCollaborator
        : p.role !== 'mafia' && !isCollaborator;
      return {
        id: p.id,
        name: p.name,
        role: p.role,
        team: p.team,
        extras: p.extras,
        protectedMafia: p.protectedMafia,
        aliveAtEnd: p.alive,
        won
      };
    });

  return {
    round: session.round,
    gameMasterId: session.gameMasterId,
    gameMasterName: getPlayer(session, session.gameMasterId)?.name || null,
    winner,
    endedAt: now(),
    players: roundPlayers,
    events: [...session.events]
  };
}


function buildSessionStats(session) {
  const stats = new Map();

  function ensurePlayer(idValue, nameValue) {
    if (!idValue) return null;
    if (!stats.has(idValue)) {
      stats.set(idValue, {
        id: idValue,
        name: nameValue || '—',
        rounds: 0,
        wins: 0,
        losses: 0,
        survived: 0,
        gameMasterRounds: 0,
        roles: {}
      });
    } else if (nameValue) {
      stats.get(idValue).name = nameValue;
    }
    return stats.get(idValue);
  }

  session.players.forEach((p) => ensurePlayer(p.id, p.name));

  (session.history || []).forEach((round) => {
    const gm = ensurePlayer(round.gameMasterId, round.gameMasterName);
    if (gm) gm.gameMasterRounds += 1;

    (round.players || []).forEach((p) => {
      const entry = ensurePlayer(p.id, p.name);
      if (!entry) return;
      entry.rounds += 1;
      if (p.won) entry.wins += 1;
      else entry.losses += 1;
      if (p.aliveAtEnd) entry.survived += 1;
      const roleParts = [p.role || 'unknown'];
      if (p.protectedMafia) roleParts.push('protectedMafia');
      if (Array.isArray(p.extras)) roleParts.push(...p.extras);
      const roleKey = roleParts.join('+');
      entry.roles[roleKey] = (entry.roles[roleKey] || 0) + 1;
    });
  });

  return Array.from(stats.values()).sort((a, b) => a.name.localeCompare(b.name, 'hu'));
}

function publicSessionView(session, playerId, ttlSeconds) {
  const me = getPlayer(session, playerId);
  if (!me) throw httpError(404, 'player_not_found');
  const isGameMaster = me.id === session.gameMasterId && !me.kicked;
  const revealRoles = session.phase === 'round_ended' || session.phase === 'session_closed';
  const instruction = isGameMaster ? currentInstructionKey(session) : null;

  return {
    code: session.code,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    ttlSeconds,
    phase: session.phase,
    round: session.round,
    defaultLanguage: session.defaultLanguage,
    selectedExtras: session.selectedExtras,
    gameMasterId: session.gameMasterId,
    hostPlayerId: session.hostPlayerId,
    suggestedWinner: session.suggestedWinner || null,
    winNotice: session.winNotice || null,
    nightMarks: isGameMaster ? session.nightMarks : undefined,
    pendingActions: isGameMaster ? session.pendingActions : [],
    sessionStats: buildSessionStats(session),
    instruction,
    me: playerPublicView(me, { revealRoles, isSelf: true, isGameMaster }),
    isGameMaster,
    players: session.players
      .slice()
      .sort((a, b) => a.seatIndex - b.seatIndex)
      .map((p) => playerPublicView(p, { revealRoles, isSelf: p.id === playerId, isGameMaster })),
    history: revealRoles || isGameMaster ? session.history : []
  };
}

function addEvent(session, event) {
  session.events.push({
    id: id('e'),
    timestamp: now(),
    phase: session.phase,
    ...event
  });
}

function addPendingAction(session, action) {
  session.pendingActions.push({
    id: id('a'),
    createdAt: now(),
    resolved: false,
    ...action
  });
}

function sortPlayers(session) {
  session.players.sort((a, b) => a.seatIndex - b.seatIndex);
  session.players.forEach((p, index) => {
    p.seatIndex = index;
  });
}

api.post('/session', async (req, res, next) => {
  try {
    const code = await generateUniqueCode();
    const hostName = sanitizeName(req.body.hostName);
    const language = sanitizeLanguage(req.body.language);
    const hostPlayerId = id('p');
    const createdAt = now();

    const host = {
      id: hostPlayerId,
      name: hostName,
      language,
      connected: true,
      isHost: true,
      isGameMaster: true,
      seatIndex: 0,
      alive: true,
      kicked: false,
      role: null,
      team: null,
      extras: [],
      protectedMafia: false,
      protectedMafiaCheckUsed: false,
      roleRevealed: false
    };

    const session = {
      code,
      createdAt,
      updatedAt: createdAt,
      phase: 'lobby',
      round: 1,
      hostPlayerId,
      gameMasterId: hostPlayerId,
      defaultLanguage: language,
      selectedExtras: normalizeSelectedExtras(req.body.selectedExtras),
      players: [host],
      history: [],
      events: [],
      pendingActions: [],
      nightMarks: { bodyguardTargetId: null, sarikaTargetId: null },
      instructionIndex: 0,
      suggestedWinner: null,
      winNotice: null
    };

    await saveSession(session);
    res.json({ code, playerId: hostPlayerId, ttlSeconds: SESSION_TTL_SECONDS, basePath: BASE_PATH });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/join', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    if (session.phase === 'session_closed') throw httpError(410, 'session_closed');
    if (!['lobby', 'round_ended'].includes(session.phase)) throw httpError(409, 'session_already_started');

    const name = sanitizeName(req.body.name);
    const language = sanitizeLanguage(req.body.language || session.defaultLanguage);
    const playerId = id('p');
    const player = {
      id: playerId,
      name,
      language,
      connected: true,
      isHost: false,
      isGameMaster: false,
      seatIndex: session.players.length,
      alive: true,
      kicked: false,
      role: null,
      team: null,
      extras: [],
      protectedMafia: false,
      protectedMafiaCheckUsed: false,
      roleRevealed: false
    };
    session.players.push(player);
    sortPlayers(session);
    await saveSession(session);
    res.json({ code: session.code, playerId, ttlSeconds: await sessionTtl(session.code) });
  } catch (err) {
    next(err);
  }
});

api.get('/session/:code/state', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    const playerId = String(req.query.playerId || '');
    const ttlSeconds = await sessionTtl(session.code);
    res.json(publicSessionView(session, playerId, ttlSeconds));
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/player/:playerId/language', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    const player = requirePlayer(session, req.params.playerId);
    player.language = sanitizeLanguage(req.body.language);
    await saveSession(session);
    res.json({ ok: true, language: player.language });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/player/:playerId/reveal-role', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    const player = requirePlayer(session, req.params.playerId);
    player.roleRevealed = Boolean(req.body.revealed);
    await saveSession(session);
    res.json({ ok: true, revealed: player.roleRevealed });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/reorder', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    const target = requirePlayer(session, req.body.playerId);
    const direction = req.body.direction === 'up' ? -1 : req.body.direction === 'down' ? 1 : 0;
    if (!direction) throw httpError(400, 'invalid_direction');
    sortPlayers(session);
    const index = session.players.findIndex((p) => p.id === target.id);
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= session.players.length) {
      return res.json({ ok: true });
    }
    [session.players[index], session.players[newIndex]] = [session.players[newIndex], session.players[index]];
    session.players.forEach((player, seatIndex) => {
      player.seatIndex = seatIndex;
    });
    await saveSession(session);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/start-round', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId || req.body.gameMasterId);
    if (!['lobby', 'round_ended'].includes(session.phase)) {
      throw httpError(400, 'round_cannot_start_from_current_phase');
    }
    assignRoles(session);
    await saveSession(session);
    res.json({ ok: true, phase: session.phase });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/phase', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    const nextPhase = String(req.body.phase || '');
    if (!PHASES.has(nextPhase)) throw httpError(400, 'invalid_phase');
    if (session.phase === 'night' && nextPhase !== 'night') {
      resetNightMarks(session);
    }
    session.phase = nextPhase;
    session.instructionIndex = 0;
    await saveSession(session);
    res.json({ ok: true, phase: session.phase });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/instruction', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    const current = currentInstructionKey(session);
    const direction = req.body.direction === 'prev' ? -1 : 1;
    session.instructionIndex = Math.min(Math.max(0, current.index + direction), current.total - 1);
    await saveSession(session);
    res.json({ ok: true, instruction: currentInstructionKey(session) });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/protected-mafia-check', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    const target = requirePlayer(session, req.body.targetPlayerId);
    if (!target.protectedMafia) throw httpError(400, 'target_is_not_protected_mafia');
    target.protectedMafiaCheckUsed = typeof req.body.used === 'boolean'
      ? req.body.used
      : !target.protectedMafiaCheckUsed;
    await saveSession(session);
    res.json({ ok: true, protectedMafiaCheckUsed: target.protectedMafiaCheckUsed });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/night-mark', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    const type = String(req.body.type || '');
    if (!['bodyguard', 'sarika'].includes(type)) throw httpError(400, 'invalid_night_mark_type');
    const field = type === 'bodyguard' ? 'bodyguardTargetId' : 'sarikaTargetId';
    const targetPlayerId = req.body.targetPlayerId || null;
    if (targetPlayerId) {
      const target = requirePlayer(session, targetPlayerId);
      if (target.kicked || !target.alive) throw httpError(400, 'invalid_target');
      session.nightMarks[field] = target.id;
    } else {
      session.nightMarks[field] = null;
    }
    await saveSession(session);
    res.json({ ok: true, nightMarks: session.nightMarks });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/eliminate', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    const target = requirePlayer(session, req.body.targetPlayerId);
    const reason = VALID_ELIMINATION_REASONS.has(req.body.reason) ? req.body.reason : 'manual';
    if (target.kicked) throw httpError(400, 'player_is_kicked');
    if (!target.alive) return res.json({ ok: true, alreadyDead: true });

    target.alive = false;
    addEvent(session, { type: 'eliminated', playerId: target.id, playerName: target.name, reason });

    if (target.extras.includes('grocer')) {
      addPendingAction(session, { type: 'grocer_announcement', sourcePlayerId: target.id });
    }
    if (target.extras.includes('kamikaze')) {
      addPendingAction(session, { type: 'kamikaze', sourcePlayerId: target.id });
    }
    if (target.extras.includes('lovers') && target.loverPartnerId) {
      const partner = getPlayer(session, target.loverPartnerId);
      if (partner && partner.alive && !partner.kicked) {
        addPendingAction(session, {
          type: 'lover_death',
          sourcePlayerId: target.id,
          targetPlayerId: partner.id
        });
      }
    }

    checkWinCondition(session);
    await saveSession(session);
    res.json({ ok: true, winNotice: session.winNotice || null, pendingActions: session.pendingActions });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/no-death', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    addEvent(session, { type: 'no_death', reason: req.body.reason || null });
    await saveSession(session);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/kick', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    const target = requirePlayer(session, req.body.targetPlayerId);
    if (target.id === session.gameMasterId) throw httpError(400, 'cannot_kick_current_game_master');
    target.kicked = true;
    target.alive = false;
    target.connected = false;
    addEvent(session, { type: 'kicked', playerId: target.id, playerName: target.name });
    checkWinCondition(session);
    await saveSession(session);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/restore', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    const target = requirePlayer(session, req.body.targetPlayerId);
    if (target.kicked) throw httpError(400, 'cannot_restore_kicked_player');
    target.alive = true;
    addEvent(session, { type: 'restored', playerId: target.id, playerName: target.name });
    checkWinCondition(session);
    await saveSession(session);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/resolve-action', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    const action = session.pendingActions.find((a) => a.id === req.body.actionId);
    if (!action) throw httpError(404, 'pending_action_not_found');
    action.resolved = true;
    action.resolvedAt = now();
    await saveSession(session);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/end-round', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    const winner = ['citizens', 'mafia'].includes(req.body.winner)
      ? req.body.winner
      : session.suggestedWinner;
    if (!winner) throw httpError(400, 'winner_required');
    const summary = buildRoundSummary(session, winner);
    session.history.push(summary);
    session.phase = 'round_ended';
    session.winner = winner;
    session.winNotice = { type: 'win', winner, key: winner === 'mafia' ? 'notice_mafia_won' : 'notice_citizens_won' };
    session.suggestedWinner = winner;
    session.pendingActions = [];
    session.instructionIndex = 0;
    resetNightMarks(session);
    await saveSession(session);
    res.json({ ok: true, summary });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/next-round', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    sortPlayers(session);
    const candidates = session.players.filter((p) => !p.kicked);
    if (candidates.length < 2) throw httpError(400, 'not_enough_players');
    const currentIndex = candidates.findIndex((p) => p.id === session.gameMasterId);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % candidates.length : 0;
    const nextGM = candidates[nextIndex];
    session.gameMasterId = nextGM.id;
    session.round += 1;
    session.phase = 'lobby';
    session.winner = null;
    session.suggestedWinner = null;
    session.winNotice = null;
    resetRoundState(session);
    await saveSession(session);
    res.json({ ok: true, gameMasterId: session.gameMasterId, round: session.round });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/extend', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    await touchSession(session.code);
    res.json({ ok: true, ttlSeconds: SESSION_TTL_SECONDS });
  } catch (err) {
    next(err);
  }
});

api.post('/session/:code/close', async (req, res, next) => {
  try {
    const session = await loadSession(req.params.code);
    if (!session) throw httpError(404, 'session_not_found');
    requireGameMaster(session, req.body.actorPlayerId);
    session.phase = 'session_closed';
    await redis.del(sessionKey(session.code));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

api.get('/healthz', async (_req, res) => {
  res.json({ ok: true, redis: redis.isOpen, basePath: BASE_PATH });
});

function sendIndex(_req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}

function mountStatic(prefix) {
  app.use(`${prefix}/api`, api);
  app.use(prefix || '/', express.static(path.join(__dirname, 'public')));
  app.get(prefix || '/', sendIndex);
  if (prefix) app.get(`${prefix}/`, sendIndex);
}

if (BASE_PATH) {
  // Serve the app directly at BASE_PATH instead of redirecting.
  // This avoids redirect loops if an ingress/middleware strips the prefix.
  mountStatic(BASE_PATH);
}

// Convenience local routes without prefix. Also keeps the app working if an ingress strips /maffia.
app.use('/api', api);
app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/', sendIndex);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const code = err.code || err.message || 'internal_error';
  if (status >= 500) {
    console.error('[server] error:', err);
  }
  res.status(status).json({ error: code, details: err.details || null });
});

(async () => {
  await redis.connect();
  app.listen(PORT, () => {
    console.log(`Maffia assistant listening on :${PORT}${BASE_PATH || ''}`);
  });
})();
