(function () {
  const state = {
    code: localStorage.getItem('maffia.code') || '',
    playerId: localStorage.getItem('maffia.playerId') || '',
    lang: localStorage.getItem('maffia.lang') || 'hu',
    last: null,
    pollTimer: null,
    toast: '',
    eliminationReasons: {}
  };

  const BASE_PATH = (() => {
    const marker = '/maffia';
    const p = window.location.pathname;
    const idx = p.indexOf(marker);
    return idx >= 0 ? p.slice(0, idx + marker.length) : '';
  })();

  const $ = (id) => document.getElementById(id);

  function dict() {
    return window.I18N[state.lang] || window.I18N.hu;
  }

  function t(key, fallback) {
    const d = dict();
    return key.split('.').reduce((acc, part) => acc && acc[part], d) || fallback || key;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[ch]));
  }

  function apiUrl(path) {
    return `${BASE_PATH}/api${path}`;
  }

  async function request(method, path, body) {
    const res = await fetch(apiUrl(path), {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || 'error');
      err.payload = data;
      throw err;
    }
    return data;
  }

  function showToast(message) {
    state.toast = message;
    setTimeout(() => {
      if (state.toast === message) {
        state.toast = '';
        render();
      }
    }, 2500);
    render();
  }

  function errorText(error) {
    const code = error?.payload?.error || error?.message || 'default';
    return t(`errors.${code}`, t('errors.default'));
  }

  async function safeRun(fn) {
    try {
      await fn();
      await refresh();
    } catch (err) {
      console.error(err);
      showToast(errorText(err));
    }
  }

  function saveIdentity(code, playerId) {
    state.code = code;
    state.playerId = playerId;
    localStorage.setItem('maffia.code', code);
    localStorage.setItem('maffia.playerId', playerId);
  }

  function clearIdentity() {
    state.code = '';
    state.playerId = '';
    state.last = null;
    localStorage.removeItem('maffia.code');
    localStorage.removeItem('maffia.playerId');
  }

  function setLang(lang) {
    state.lang = ['hu', 'en', 'de'].includes(lang) ? lang : 'hu';
    localStorage.setItem('maffia.lang', state.lang);
    if (state.code && state.playerId) {
      request('POST', `/session/${state.code}/player/${state.playerId}/language`, { language: state.lang })
        .catch((err) => console.warn('language save failed', err));
    }
    render();
  }

  async function refresh() {
    if (!state.code || !state.playerId) return;
    try {
      const data = await request('GET', `/session/${state.code}/state?playerId=${encodeURIComponent(state.playerId)}`);
      state.last = data;
      if (data.me?.language && data.me.language !== state.lang) {
        state.lang = data.me.language;
        localStorage.setItem('maffia.lang', state.lang);
      }
      render();
    } catch (err) {
      console.warn('refresh failed', err);
      if (err?.payload?.error === 'session_not_found' || err?.payload?.error === 'player_not_found') {
        clearIdentity();
        renderHome();
      } else {
        showToast(errorText(err));
      }
    }
  }

  function startPolling() {
    if (state.pollTimer) clearInterval(state.pollTimer);
    state.pollTimer = setInterval(refresh, 2000);
  }

  function langSelectHtml() {
    return `
      <label class="field compact">
        <span>${t('language')}</span>
        <select onchange="MaffiaUI.setLang(this.value)">
          <option value="hu" ${state.lang === 'hu' ? 'selected' : ''}>Magyar</option>
          <option value="en" ${state.lang === 'en' ? 'selected' : ''}>English</option>
          <option value="de" ${state.lang === 'de' ? 'selected' : ''}>Deutsch</option>
        </select>
      </label>
    `;
  }

  function ttlText(seconds) {
    if (!seconds) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }

  function roleName(role) {
    return t(`roles.${role}`, role || '—');
  }

  function extraName(extra) {
    return t(`extrasMap.${extra}`, extra);
  }

  function roleLabel(player) {
    if (!player || player.role === 'hidden') return t('hidden');
    const parts = [roleName(player.role)];
    if (player.protectedMafia) parts.push(state.lang === 'hu' ? 'Védett maffiózó' : state.lang === 'de' ? 'Geschützter Mafioso' : 'Protected mafioso');
    if (player.extras?.length) parts.push(...player.extras.map(extraName));
    return parts.join(' + ');
  }

  function statusBadge(player) {
    if (player.kicked) return `<span class="badge danger">${t('kicked')}</span>`;
    return player.alive ? `<span class="badge ok">${t('alive')}</span>` : `<span class="badge danger">${t('dead')}</span>`;
  }

  function phaseBadge(phase) {
    return `<span class="badge phase">${t(`phases.${phase}`, phase)}</span>`;
  }

  function activeRoleCount(s) {
    return s.players.filter((p) => !p.kicked && p.id !== s.gameMasterId).length;
  }

  function renderHome() {
    const extras = ['collaborator', 'bodyguard', 'protectedCitizen', 'grocer', 'kamikaze', 'lovers', 'sarika', 'vogon'];
    $('app').innerHTML = `
      <div class="shell narrow">
        <header class="hero">
          <div>
            <h1>${t('appTitle')}</h1>
            <p>${t('appNotice')}</p>
          </div>
          ${langSelectHtml()}
        </header>

        <section class="card">
          <h2>${t('createGame')}</h2>
          <label class="field"><span>${t('hostName')}</span><input id="hostName" autocomplete="name" maxlength="32" /></label>
          <h3>${t('extras')}</h3>
          <div class="check-grid">
            ${extras.map((x) => `<label><input type="checkbox" id="extra_${x}" /> ${extraName(x)}</label>`).join('')}
          </div>
          <button class="primary full" onclick="MaffiaUI.createGame()">${t('create')}</button>
        </section>

        <section class="card">
          <h2>${t('joinGame')}</h2>
          <label class="field"><span>${t('sessionCode')}</span><input id="joinCode" inputmode="numeric" pattern="[0-9]*" maxlength="5" /></label>
          <label class="field"><span>${t('playerName')}</span><input id="joinName" autocomplete="name" maxlength="32" /></label>
          <button class="secondary full" onclick="MaffiaUI.joinGame()">${t('join')}</button>
        </section>

        <section class="card">
          <h2>${t('fullRulesTitle')}</h2>
          ${fullRulesHtml()}
        </section>
      </div>
      ${toastHtml()}
    `;
  }

  function toastHtml() {
    return state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : '';
  }

  function renderTopBar(s) {
    const gm = s.players.find((p) => p.id === s.gameMasterId);
    return `
      <header class="topbar">
        <div>
          <h1>${t('appTitle')}</h1>
          <div class="meta">
            <span>${t('sessionCode')}: <strong>${escapeHtml(s.code)}</strong></span>
            <button class="tiny" onclick="MaffiaUI.copyCode()">${t('copyCode')}</button>
            <span>${t('round')}: <strong>${s.round}</strong></span>
            ${phaseBadge(s.phase)}
            <span>${t('ttl')}: <strong>${ttlText(s.ttlSeconds)}</strong></span>
          </div>
          <div class="meta"><span>${t('currentGameMaster')}: <strong>${escapeHtml(gm?.name || '—')}</strong></span></div>
        </div>
        <div class="right-tools">
          ${langSelectHtml()}
          <button class="ghost" onclick="MaffiaUI.leaveLocal()">Kilépés ezen az eszközön</button>
        </div>
      </header>
    `;
  }

  function render() {
    const s = state.last;
    if (!s) return renderHome();
    const html = s.isGameMaster ? renderGameMaster(s) : renderPlayer(s);
    $('app').innerHTML = html + toastHtml();
  }

  function renderPlayer(s) {
    const me = s.me;
    const showSummary = s.phase === 'round_ended';
    return `
      <div class="shell">
        ${renderTopBar(s)}
        ${noticeHtml(s)}
        <main class="grid two">
          <section class="card role-card">
            <h2>${escapeHtml(me.name)}</h2>
            <p>${statusBadge(me)}</p>
            <div class="secret ${me.role === 'hidden' ? 'hidden-role' : ''}">
              <div class="label">${t('role')}</div>
              <div class="role-name">${escapeHtml(roleLabel(me))}</div>
            </div>
            ${s.phase !== 'round_ended' ? `
              <button class="primary full" onclick="MaffiaUI.revealRole(${me.role === 'hidden' ? 'true' : 'false'})">
                ${me.role === 'hidden' ? t('revealRole') : t('hideRole')}
              </button>
            ` : ''}
          </section>

          <section class="card">
            <h2>${t('players')}</h2>
            <div class="player-list compact-list">
              ${s.players.map((p) => `
                <div class="row">
                  <span>${escapeHtml(p.name)} ${p.isGameMaster ? `<span class="badge">${t('gameMaster')}</span>` : ''}</span>
                  <span>${statusBadge(p)}</span>
                  ${showSummary ? `<span class="muted">${escapeHtml(roleLabel(p))}</span>` : ''}
                </div>
              `).join('')}
            </div>
          </section>

          <section class="card wide">
            <h2>${t('statsTitle')}</h2>
            ${sessionStatsHtml(s)}
          </section>

          <section class="card wide">
            <h2>${t('rules')}</h2>
            ${rulesHtml(me)}
          </section>

          ${showSummary ? `<section class="card wide">${summaryHtml(s)}</section>` : ''}
        </main>
      </div>
    `;
  }

  function noticeHtml(s) {
    if (!s.winNotice) return '';
    return `<section class="notice">${escapeHtml(t(`notices.${s.winNotice.key}`, s.winNotice.key))}</section>`;
  }

  function rulesHtml(me) {
    const d = dict();
    const general = d.generalRules || [];
    const descriptions = [];
    if (me.role && me.role !== 'hidden') descriptions.push(d.roleDescriptions?.[me.role]);
    if (me.extras?.length) me.extras.forEach((x) => descriptions.push(d.roleDescriptions?.[x]));
    if (me.protectedMafia) descriptions.push('Védett maffiózóként a felügyelő első lekérdezésekor polgárnak számítasz, a másodiknál már maffiózónak mondható.');
    return `
      ${descriptions.filter(Boolean).length ? `
        <h3>${t('roleRules')}</h3>
        <ul>${descriptions.filter(Boolean).map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>
      ` : ''}
      <h3>${t('generalRulesTitle')}</h3>
      <ul>${general.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>
      <h3>${t('fullRulesTitle')}</h3>
      ${fullRulesHtml()}
    `;
  }

  function fullRulesHtml() {
    const sections = dict().fullRules || [];
    if (!sections.length) return '';
    return `<div class="rules-box">${sections.map((section) => `
      <article class="rule-section">
        <h4>${escapeHtml(section.title)}</h4>
        ${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      </article>
    `).join('')}</div>`;
  }

  function sessionStatsHtml(s) {
    const stats = s.sessionStats || [];
    if (!stats.length) return `<p>${t('noStatsYet')}</p>`;
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>${t('players')}</th>
              <th>${t('games')}</th>
              <th>${t('wins')}</th>
              <th>${t('losses')}</th>
              <th>${t('survived')}</th>
              <th>${t('gmRounds')}</th>
              <th>${t('previousRoles')}</th>
            </tr>
          </thead>
          <tbody>
            ${stats.map((entry) => {
              const roles = Object.entries(entry.roles || {})
                .map(([key, count]) => `${escapeHtml(formatStatsRoleKey(key))} ×${count}`)
                .join('<br>') || '—';
              return `<tr>
                <td>${escapeHtml(entry.name)}</td>
                <td>${entry.rounds}</td>
                <td>${entry.wins}</td>
                <td>${entry.losses}</td>
                <td>${entry.survived}</td>
                <td>${entry.gameMasterRounds}</td>
                <td>${roles}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function formatStatsRoleKey(key) {
    if (!key || key === 'unknown') return '—';
    return key.split('+').map((part) => {
      if (part === 'protectedMafia') return state.lang === 'hu' ? 'Védett maffiózó' : state.lang === 'de' ? 'Geschützter Mafioso' : 'Protected mafioso';
      return t(`roles.${part}`, t(`extrasMap.${part}`, part));
    }).join(' + ');
  }

  function renderGameMaster(s) {
    return `
      <div class="shell">
        ${renderTopBar(s)}
        ${noticeHtml(s)}
        <main class="grid two">
          <section class="card">
            <h2>${t('gameMaster')}</h2>
            <p>${t('minPlayersHint')} ${t('players')}: <strong>${activeRoleCount(s)}</strong></p>
            <div class="button-row">
              <button class="primary" onclick="MaffiaUI.startRound()" ${activeRoleCount(s) < 6 || !['lobby','round_ended'].includes(s.phase) ? 'disabled' : ''}>${t('startRound')}</button>
              <button class="secondary" onclick="MaffiaUI.extendSession()">${t('extendSession')}</button>
            </div>
          </section>

          <section class="card">
            <h2>${t('sayThis')}</h2>
            ${instructionHtml(s)}
          </section>

          <section class="card wide">
            <h2>${t('setPhase')}</h2>
            <div class="button-row wrap">
              ${['intro_night','day','night','endgame_warning'].map((phase) => `
                <button class="secondary" onclick="MaffiaUI.setPhase('${phase}')">${t(`phases.${phase}`, phase)}</button>
              `).join('')}
            </div>
          </section>

          ${pendingActionsHtml(s)}

          <section class="card wide">
            <h2>${t('players')}</h2>
            ${gmPlayersHtml(s)}
          </section>

          <section class="card wide">
            <h2>${t('statsTitle')}</h2>
            ${sessionStatsHtml(s)}
          </section>

          <section class="card wide">
            <h2>${t('rules')}</h2>
            ${rulesHtml(s.me)}
          </section>

          <section class="card wide">
            <h2>${t('endRound')}</h2>
            <div class="button-row wrap">
              <button class="primary" onclick="MaffiaUI.endRound('citizens')">${t('citizensWin')}</button>
              <button class="danger" onclick="MaffiaUI.endRound('mafia')">${t('mafiaWin')}</button>
              ${s.phase === 'round_ended' ? `<button class="secondary" onclick="MaffiaUI.nextRound()">${t('nextRound')}</button>` : ''}
              <button class="ghost" onclick="MaffiaUI.closeSession()">${t('closeSession')}</button>
            </div>
          </section>

          ${s.phase === 'round_ended' ? `<section class="card wide">${summaryHtml(s)}</section>` : ''}
        </main>
      </div>
    `;
  }

  function instructionHtml(s) {
    const inst = s.instruction;
    if (!inst) return `<p>${t('waitingForHost')}</p>`;
    const text = t(`instructions.${inst.key}`, inst.key);
    return `
      <div class="instruction">${escapeHtml(text)}</div>
      <div class="meta">${inst.index + 1} / ${inst.total}</div>
      <div class="button-row">
        <button class="secondary" onclick="MaffiaUI.stepInstruction('prev')">${t('prevInstruction')}</button>
        <button class="secondary" onclick="MaffiaUI.stepInstruction('next')">${t('nextInstruction')}</button>
      </div>
    `;
  }

  function pendingActionsHtml(s) {
    const pending = (s.pendingActions || []).filter((a) => !a.resolved);
    if (!pending.length) return '';
    return `
      <section class="card wide alert-card">
        <h2>${t('pendingActions')}</h2>
        ${pending.map((a) => {
          const source = s.players.find((p) => p.id === a.sourcePlayerId);
          const target = s.players.find((p) => p.id === a.targetPlayerId);
          const names = [source?.name, target?.name].filter(Boolean).map(escapeHtml).join(' → ');
          return `<div class="pending">
            <div><strong>${escapeHtml(names)}</strong><br>${escapeHtml(t(`action_${a.type}`, a.type))}</div>
            ${a.type === 'lover_death' && target ? `<button class="danger" onclick="MaffiaUI.eliminate('${target.id}', 'extra')">${t('eliminate')}</button>` : ''}
            <button class="secondary" onclick="MaffiaUI.resolveAction('${a.id}')">${t('resolve')}</button>
          </div>`;
        }).join('')}
      </section>
    `;
  }

  function gmPlayersHtml(s) {
    return `<div class="gm-list">
      ${s.players.map((p) => {
        const reasonId = `reason_${p.id}`;
        const currentReason = state.eliminationReasons[p.id] || (s.phase === 'night' ? 'night' : 'day');
        const bodyguardOn = s.nightMarks?.bodyguardTargetId === p.id;
        const sarikaOn = s.nightMarks?.sarikaTargetId === p.id;
        return `
          <article class="player-card ${p.id === s.gameMasterId ? 'gm' : ''}">
            <div class="player-main">
              <div>
                <h3>${escapeHtml(p.name)} ${p.id === s.gameMasterId ? `<span class="badge">${t('gameMaster')}</span>` : ''}</h3>
                <p>${statusBadge(p)} <span class="muted">${escapeHtml(roleLabel(p))}</span></p>
                ${p.protectedMafia ? protectedMafiaHtml(p) : ''}
              </div>
              <div class="seat-tools">
                <button class="tiny" onclick="MaffiaUI.reorder('${p.id}', 'up')">${t('moveUp')}</button>
                <button class="tiny" onclick="MaffiaUI.reorder('${p.id}', 'down')">${t('moveDown')}</button>
              </div>
            </div>

            ${s.phase === 'night' ? nightMarksHtml(s, p, bodyguardOn, sarikaOn) : ''}

            <div class="button-row wrap">
              <select id="${reasonId}" onchange="MaffiaUI.setEliminationReason('${p.id}', this.value)">
                <option value="day" ${currentReason === 'day' ? 'selected' : ''}>${t('reason_day')}</option>
                <option value="night" ${currentReason === 'night' ? 'selected' : ''}>${t('reason_night')}</option>
                <option value="extra" ${currentReason === 'extra' ? 'selected' : ''}>${t('reason_extra')}</option>
                <option value="manual" ${currentReason === 'manual' ? 'selected' : ''}>${t('reason_manual')}</option>
              </select>
              <button class="danger" onclick="MaffiaUI.eliminateWithSelect('${p.id}', '${reasonId}')" ${p.kicked || !p.alive || p.id === s.gameMasterId ? 'disabled' : ''}>${t('eliminate')}</button>
              <button class="secondary" onclick="MaffiaUI.restore('${p.id}')" ${p.alive || p.kicked || p.id === s.gameMasterId ? 'disabled' : ''}>${t('restore')}</button>
              <button class="ghost" onclick="MaffiaUI.kick('${p.id}')" ${p.id === s.gameMasterId || p.kicked ? 'disabled' : ''}>${t('kick')}</button>
            </div>
          </article>
        `;
      }).join('')}
    </div>`;
  }

  function protectedMafiaHtml(p) {
    return `
      <div class="mini-alert ${p.protectedMafiaCheckUsed ? 'used' : ''}">
        ${escapeHtml(p.protectedMafiaCheckUsed ? t('protectedCheckUsed') : t('protectedCheckUnused'))}
        <button class="tiny" onclick="MaffiaUI.protectedMafiaCheck('${p.id}')">${t('protectedCheckButton')}</button>
      </div>
    `;
  }

  function nightMarksHtml(s, p, bodyguardOn, sarikaOn) {
    const pieces = [];
    if (s.selectedExtras?.bodyguard && p.id !== s.gameMasterId && p.alive && !p.kicked) {
      pieces.push(`<button class="${bodyguardOn ? 'mark-on' : 'secondary'}" onclick="MaffiaUI.nightMark('bodyguard','${bodyguardOn ? '' : p.id}')">${bodyguardOn ? t('unmark') : t('bodyguardMark')}</button>`);
    }
    if (s.selectedExtras?.sarika && p.id !== s.gameMasterId && p.alive && !p.kicked) {
      pieces.push(`<button class="${sarikaOn ? 'mark-on' : 'secondary'}" onclick="MaffiaUI.nightMark('sarika','${sarikaOn ? '' : p.id}')">${sarikaOn ? t('unmark') : t('sarikaMark')}</button>`);
    }
    return pieces.length ? `<div class="button-row wrap night-marks">${pieces.join('')}</div>` : '';
  }

  function summaryHtml(s) {
    const last = s.history?.[s.history.length - 1];
    if (!last) return `<h2>${t('roundSummary')}</h2><p>—</p>`;
    return `
      <h2>${t('roundSummary')}</h2>
      <p><strong>${last.winner === 'mafia' ? t('mafiaWin') : t('citizensWin')}</strong></p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>${t('players')}</th><th>${t('role')}</th><th>${t('survived')}</th><th>${t('status')}</th></tr></thead>
          <tbody>
            ${last.players.map((p) => `
              <tr>
                <td>${escapeHtml(p.name)}</td>
                <td>${escapeHtml(summaryRoleLabel(p))}</td>
                <td>${p.aliveAtEnd ? t('yes') : t('no')}</td>
                <td>${p.won ? t('won') : t('lost')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${historyHtml(s)}
    `;
  }

  function summaryRoleLabel(p) {
    const parts = [roleName(p.role)];
    if (p.protectedMafia) parts.push(state.lang === 'hu' ? 'Védett maffiózó' : state.lang === 'de' ? 'Geschützter Mafioso' : 'Protected mafioso');
    if (p.extras?.length) parts.push(...p.extras.map(extraName));
    return parts.join(' + ');
  }

  function historyHtml(s) {
    if (!s.history || s.history.length < 2) return '';
    return `
      <h3>${t('history')}</h3>
      <div class="table-wrap">
        <table>
          <thead><tr><th>${t('round')}</th><th>${t('gameMaster')}</th><th>${t('status')}</th></tr></thead>
          <tbody>${s.history.map((h) => `<tr><td>${h.round}</td><td>${escapeHtml(h.gameMasterName || '—')}</td><td>${h.winner === 'mafia' ? t('mafiaWin') : t('citizensWin')}</td></tr>`).join('')}</tbody>
        </table>
      </div>
    `;
  }

  async function createGame() {
    const selectedExtras = {};
    ['collaborator', 'bodyguard', 'protectedCitizen', 'grocer', 'kamikaze', 'lovers', 'sarika', 'vogon'].forEach((x) => {
      selectedExtras[x] = Boolean($(`extra_${x}`)?.checked);
    });
    const data = await request('POST', '/session', {
      hostName: $('hostName').value,
      language: state.lang,
      selectedExtras
    });
    saveIdentity(data.code, data.playerId);
    startPolling();
    await refresh();
  }

  async function joinGame() {
    const code = $('joinCode').value.trim();
    const data = await request('POST', `/session/${code}/join`, {
      name: $('joinName').value,
      language: state.lang
    });
    saveIdentity(data.code, data.playerId);
    startPolling();
    await refresh();
  }

  function actorBody(extra) {
    return { actorPlayerId: state.playerId, ...(extra || {}) };
  }

  window.MaffiaUI = {
    setLang,
    createGame: () => safeRun(createGame),
    joinGame: () => safeRun(joinGame),
    copyCode: () => safeRun(async () => {
      await navigator.clipboard.writeText(state.code);
      showToast(t('copied'));
    }),
    leaveLocal: () => {
      clearIdentity();
      renderHome();
    },
    startRound: () => safeRun(() => request('POST', `/session/${state.code}/start-round`, actorBody())),
    extendSession: () => safeRun(async () => {
      await request('POST', `/session/${state.code}/extend`, actorBody());
      showToast(t('sessionExtended'));
    }),
    setPhase: (phase) => safeRun(() => request('POST', `/session/${state.code}/phase`, actorBody({ phase }))),
    stepInstruction: (direction) => safeRun(() => request('POST', `/session/${state.code}/instruction`, actorBody({ direction }))),
    revealRole: (revealed) => safeRun(() => request('POST', `/session/${state.code}/player/${state.playerId}/reveal-role`, { revealed })),
    reorder: (playerId, direction) => safeRun(() => request('POST', `/session/${state.code}/reorder`, actorBody({ playerId, direction }))),
    protectedMafiaCheck: (targetPlayerId) => safeRun(() => request('POST', `/session/${state.code}/protected-mafia-check`, actorBody({ targetPlayerId }))),
    nightMark: (type, targetPlayerId) => safeRun(() => request('POST', `/session/${state.code}/night-mark`, actorBody({ type, targetPlayerId: targetPlayerId || null }))),
    setEliminationReason: (targetPlayerId, reason) => {
      state.eliminationReasons[targetPlayerId] = reason;
    },
    eliminateWithSelect: (targetPlayerId, selectId) => {
      const reason = state.eliminationReasons[targetPlayerId] || $(selectId)?.value || 'manual';
      return window.MaffiaUI.eliminate(targetPlayerId, reason);
    },
    eliminate: (targetPlayerId, reason) => safeRun(() => request('POST', `/session/${state.code}/eliminate`, actorBody({ targetPlayerId, reason }))),
    noDeath: () => safeRun(() => request('POST', `/session/${state.code}/no-death`, actorBody({ reason: state.last?.phase || null }))),
    kick: (targetPlayerId) => safeRun(() => request('POST', `/session/${state.code}/kick`, actorBody({ targetPlayerId }))),
    restore: (targetPlayerId) => safeRun(() => request('POST', `/session/${state.code}/restore`, actorBody({ targetPlayerId }))),
    resolveAction: (actionId) => safeRun(() => request('POST', `/session/${state.code}/resolve-action`, actorBody({ actionId }))),
    endRound: (winner) => safeRun(() => request('POST', `/session/${state.code}/end-round`, actorBody({ winner }))),
    nextRound: () => safeRun(() => request('POST', `/session/${state.code}/next-round`, actorBody())),
    closeSession: () => safeRun(async () => {
      if (!confirm(t('confirmClose'))) return;
      await request('POST', `/session/${state.code}/close`, actorBody());
      clearIdentity();
      renderHome();
    })
  };

  document.addEventListener('DOMContentLoaded', async () => {
    renderHome();
    if (state.code && state.playerId) {
      startPolling();
      await refresh();
    }
  });
})();
