window.I18N = {
  hu: {
    appTitle: 'Maffia-játék asszisztens',
    createGame: 'Új játék létrehozása',
    joinGame: 'Csatlakozás',
    hostName: 'Játékmester neve',
    playerName: 'Játékos neve',
    sessionCode: 'Session kód',
    language: 'Nyelv',
    extras: 'Extra szerepek',
    create: 'Létrehozás',
    join: 'Belépés',
    revealRole: 'Szerepem megmutatása',
    hideRole: 'Szerepem elrejtése',
    waitingForHost: 'Várakozás a játékvezetőre…',
    players: 'Játékosok',
    gameMaster: 'Játékvezető',
    currentGameMaster: 'Aktuális játékvezető',
    round: 'Kör',
    phase: 'Fázis',
    alive: 'Él',
    dead: 'Kiesett',
    kicked: 'Kidobva',
    hidden: 'Rejtve',
    role: 'Szerep',
    status: 'Állapot',
    rules: 'Szabálysegéd',
    roleRules: 'Szerepleírás',
    generalRulesTitle: 'Alapszabály röviden',
    startRound: 'Kör indítása / szereposztás',
    minPlayersHint: 'Minimum: 6 aktív játékos + 1 játékvezető.',
    moveUp: 'Fel',
    moveDown: 'Le',
    kick: 'Kidobás',
    restore: 'Visszaállítás élőre',
    eliminate: 'Játékos kiesett',
    noDeath: 'Senki nem halt meg',
    reason: 'Ok',
    reason_day: 'Nappali kivégzés',
    reason_night: 'Éjszakai halál',
    reason_extra: 'Extra szerep miatt',
    reason_manual: 'Kézi/admin',
    setPhase: 'Fázis váltása',
    prevInstruction: 'Előző instrukció',
    nextInstruction: 'Következő instrukció',
    sayThis: 'Most ezt mondd',
    extendSession: 'Session idő reset 6 órára',
    sessionExtended: 'Session meghosszabbítva 6 órára.',
    ttl: 'Lejárat',
    protectedCheckUnused: 'Felügyelői válasz: első kérdésnél polgárnak mondd.',
    protectedCheckUsed: 'Felügyelői válasz: mostantól maffiózónak mondható.',
    protectedCheckButton: 'Felügyelő már kérdezett rá',
    bodyguardMark: 'Testőr védte',
    sarikaMark: 'Sárika szavazott rá',
    unmark: 'Jelölés törlése',
    endRound: 'Kör lezárása',
    citizensWin: 'Polgárok nyertek',
    mafiaWin: 'Maffia nyert',
    nextRound: 'Következő kör',
    closeSession: 'Session lezárása',
    roundSummary: 'Kör végi összesítő',
    history: 'Session történet',
    survived: 'Életben maradt',
    won: 'Nyert',
    lost: 'Vesztett',
    nobody: 'Senki',
    confirmClose: 'Biztosan lezárod a sessiont? Ez törli az aktuális játékot.',
    copied: 'Másolva',
    copyCode: 'Kód másolása',
    yes: 'Igen',
    no: 'Nem',
    pendingActions: 'Játékvezetői teendők',
    resolve: 'Elintézve',
    action_grocer_announcement: 'Mondd be: meghalt a sarki fűszeres.',
    action_kamikaze: 'Kamikáze halt meg. Nevezzen meg valakit, aki vele hal.',
    action_lover_death: 'Szerelmespár egyik tagja halt meg. A párja is vele hal.',
    action_skipped_extras: 'Néhány extra szerep nem került kiosztásra, mert kevés volt az alkalmas játékos.',
    appNotice: 'A szavazás és az éjszakai jelzés továbbra is személyesen történik. Az app csak segít vezetni az állapotot.',
    roles: {
      citizen: 'Polgár',
      mafia: 'Maffiózó',
      detective: 'Felügyelő',
      hidden: 'Rejtett szerep'
    },
    teams: {
      citizens: 'Polgárok',
      mafia: 'Maffia',
      hidden: 'Rejtett'
    },
    extrasMap: {
      collaborator: 'Kollaboráns',
      bodyguard: 'Testőr',
      protectedCitizen: 'Védett polgár',
      grocer: 'Sarki fűszeres',
      kamikaze: 'Kamikáze',
      lovers: 'Szerelmespár',
      sarika: 'Sárika néni',
      vogon: 'Vogon'
    },
    phases: {
      lobby: 'Várószoba',
      round_ready: 'Szerepek kiosztva',
      intro_night: 'Nulladik éjszaka',
      day: 'Nappal',
      night: 'Éjszaka',
      endgame_warning: 'Végjáték / győzelmi jelzés',
      round_ended: 'Kör vége',
      session_closed: 'Session lezárva'
    },
    instructions: {
      inst_lobby: 'Várd meg, amíg mindenki becsatlakozik. A sorrendet állítsd be úgy, ahogy körben ülnek.',
      inst_roles_ready: 'A szerepek kiosztva. Indíthatod a nulladik éjszakát.',
      inst_all_close_eyes: 'Mindenki csukja be a szemét.',
      inst_detective_intro_open: 'Felügyelő, nyisd ki a szemed, és fedd fel magad a játékvezetőnek.',
      inst_detective_night_open: 'Felügyelő, nyisd ki a szemed, és kérdezz rá valakire.',
      inst_detective_close: 'Felügyelő, csukd be a szemed.',
      inst_mafia_intro_open: 'Maffiózók, nyissátok ki a szemeteket, és nézzétek meg egymást.',
      inst_protected_mafia_signal: 'Védett maffiózó, jelezd magad a játékvezetőnek.',
      inst_mafia_close: 'Maffiózók, csukjátok be a szemeteket.',
      inst_lovers_intro_open: 'Szerelmespár, nyissátok ki a szemeteket, és ismerjétek meg egymást.',
      inst_lovers_close: 'Szerelmespár, csukjátok be a szemeteket.',
      inst_bodyguard_open: 'Testőr, nyisd ki a szemed, és mutass rá arra, akit ma éjjel védesz.',
      inst_bodyguard_close: 'Testőr, csukd be a szemed.',
      inst_sarika_open: 'Sárika néni, nyisd ki a szemed, és szavazz egy névre.',
      inst_sarika_close: 'Sárika néni, csukd be a szemed.',
      inst_vogon_watch: 'Vogon, egyetlen névnél kinyithatod a szemed, és megnézheted, szavaz-e valaki.',
      inst_mafia_vote_names: 'Most sorold az élő játékosok neveit. A maffia a kiválasztott névnél csendben jelezzen.',
      inst_morning_open: 'Reggel van, mindenki nyissa ki a szemét.',
      inst_day_discussion: 'Nappal van. Jöhetnek a vádak, beszélgetés és érvelés.',
      inst_day_vote: 'Ha van vádlott, háromra szavaztass. Többség esetén rögzítsd a kiesést.',
      inst_endgame_warning: 'Ellenőrizd a helyzetet. Lehet, hogy a játék véget ért vagy végjátékba lépett.',
      inst_round_ended: 'A kör lezárult. Minden szerep felfedve, nézzétek meg az összesítőt.'
    },
    notices: {
      notice_citizens_can_win: 'A rendszer szerint minden maffiózó kiesett. A polgárok nyerhetnek.',
      notice_mafia_can_win: 'A rendszer szerint a maffia elérte a győzelmi feltételt.',
      notice_endgame_three: 'Végjáték: 3 élő játékos maradt, 1 maffiózó és 2 nem maffiózó.',
      notice_mafia_won: 'A kör lezárult: a maffia nyert.',
      notice_citizens_won: 'A kör lezárult: a polgárok nyertek.'
    },
    generalRules: [
      'A játék nappalok és éjszakák váltakozásából áll.',
      'Nappal mindenki beszélhet, vádolhat és szavazhat.',
      'Éjszaka mindenki csukott szemmel ül, a játékvezető szólítja a szerepeket.',
      'A kiesett játékos már nem adhat információt az élőknek.',
      'A polgárok célja az összes maffiózó kiejtése.',
      'A maffia akkor nyer, ha az élő maffiózók száma eléri az élő nem maffiózók számát.'
    ],
    roleDescriptions: {
      citizen: 'Polgárként figyeld a beszélgetéseket, ellentmondásokat és gyanús jeleket. A célod a maffiózók leleplezése.',
      mafia: 'Maffiózóként nappal polgárnak tetteted magad, éjszaka pedig a többi maffiózóval együtt próbáltok áldozatot választani.',
      detective: 'Felügyelőként minden éjszaka rákérdezhetsz egy játékosra. A játékvezető jelzi, hogy maffiózó-e vagy sem.',
      collaborator: 'Kollaboránsként polgárnak számítasz, de akkor nyersz, ha a maffia nyer.',
      bodyguard: 'Testőrként éjszaka megvédhetsz egy játékost. A játékvezető kezeli, hogy emiatt halt-e meg valaki.',
      protectedCitizen: 'Védett polgárként nappali kivégzés esetén kegyelmet kaphatsz.',
      grocer: 'Sarki fűszeresként a halálod után a játékvezető bemondja, hogy meghalt a sarki fűszeres.',
      kamikaze: 'Kamikázéként a halálod után megnevezhetsz valakit, aki veled hal.',
      lovers: 'Szerelmespár tagjaként ha a párod meghal, te is vele halsz.',
      sarika: 'Sárika néniként éjszaka szavazhatsz egy névre. A hatást a játékvezető értelmezi.',
      vogon: 'Vogonként egyetlen névnél kinyithatod a szemed, és megnézheted, szavaz-e valaki.'
    },
    errors: {
      name_required: 'Adj meg egy nevet.',
      session_not_found: 'Nincs ilyen session.',
      session_already_started: 'Ez a kör már elindult, most nem lehet új játékossal csatlakozni.',
      player_not_found: 'Játékos nem található.',
      not_game_master: 'Ezt csak az aktuális játékvezető használhatja.',
      minimum_players_required: 'Legalább 6 aktív játékos + 1 játékvezető szükséges.',
      round_cannot_start_from_current_phase: 'Innen most nem indítható kör.',
      winner_required: 'Válassz győztes oldalt.',
      default: 'Hiba történt.'
    }
  },
  en: {},
  de: {}
};

window.I18N.en = {
  ...window.I18N.hu,
  appTitle: 'Mafia game assistant', createGame: 'Create new game', joinGame: 'Join game', hostName: 'Game master name', playerName: 'Player name', sessionCode: 'Session code', language: 'Language', extras: 'Extra roles', create: 'Create', join: 'Join', revealRole: 'Reveal my role', hideRole: 'Hide my role', waitingForHost: 'Waiting for the game master…', players: 'Players', gameMaster: 'Game master', currentGameMaster: 'Current game master', round: 'Round', phase: 'Phase', alive: 'Alive', dead: 'Out', kicked: 'Kicked', hidden: 'Hidden', role: 'Role', status: 'Status', rules: 'Rules helper', roleRules: 'Role description', generalRulesTitle: 'Short basic rules', startRound: 'Start round / deal roles', minPlayersHint: 'Minimum: 6 active players + 1 game master.', moveUp: 'Up', moveDown: 'Down', kick: 'Kick', restore: 'Restore alive', eliminate: 'Player is out', noDeath: 'Nobody died', reason: 'Reason', reason_day: 'Day execution', reason_night: 'Night death', reason_extra: 'Extra role effect', reason_manual: 'Manual/admin', setPhase: 'Change phase', prevInstruction: 'Previous instruction', nextInstruction: 'Next instruction', sayThis: 'Say this now', extendSession: 'Reset session time to 6 hours', sessionExtended: 'Session extended to 6 hours.', ttl: 'Expires in', protectedCheckUnused: 'Detective answer: first check should be “citizen”.', protectedCheckUsed: 'Detective answer: from now on can be “mafia”.', protectedCheckButton: 'Detective has already checked', bodyguardMark: 'Protected by bodyguard', sarikaMark: 'Voted by Sarika', unmark: 'Clear mark', endRound: 'End round', citizensWin: 'Citizens won', mafiaWin: 'Mafia won', nextRound: 'Next round', closeSession: 'Close session', roundSummary: 'Round summary', history: 'Session history', survived: 'Survived', won: 'Won', lost: 'Lost', nobody: 'Nobody', confirmClose: 'Are you sure you want to close this session? This deletes the current game.', copied: 'Copied', copyCode: 'Copy code', yes: 'Yes', no: 'No', pendingActions: 'Game master tasks', resolve: 'Done', appNotice: 'Voting and night signals still happen in person. The app only tracks state.',
  roles: { citizen: 'Citizen', mafia: 'Mafioso', detective: 'Detective', hidden: 'Hidden role' },
  teams: { citizens: 'Citizens', mafia: 'Mafia', hidden: 'Hidden' },
  extrasMap: { collaborator: 'Collaborator', bodyguard: 'Bodyguard', protectedCitizen: 'Protected citizen', grocer: 'Corner grocer', kamikaze: 'Kamikaze', lovers: 'Lovers', sarika: 'Aunt Sarika', vogon: 'Vogon' },
  phases: { lobby: 'Lobby', round_ready: 'Roles dealt', intro_night: 'Intro night', day: 'Day', night: 'Night', endgame_warning: 'Endgame / win notice', round_ended: 'Round ended', session_closed: 'Session closed' },
  instructions: {
    inst_lobby: 'Wait for everyone to join. Arrange the player order according to the seating order.', inst_roles_ready: 'Roles are dealt. You can start the intro night.', inst_all_close_eyes: 'Everyone, close your eyes.', inst_detective_intro_open: 'Detective, open your eyes and reveal yourself to the game master.', inst_detective_night_open: 'Detective, open your eyes and ask about one player.', inst_detective_close: 'Detective, close your eyes.', inst_mafia_intro_open: 'Mafiosi, open your eyes and recognize each other.', inst_protected_mafia_signal: 'Protected mafioso, signal yourself to the game master.', inst_mafia_close: 'Mafiosi, close your eyes.', inst_lovers_intro_open: 'Lovers, open your eyes and recognize each other.', inst_lovers_close: 'Lovers, close your eyes.', inst_bodyguard_open: 'Bodyguard, open your eyes and point to the player you protect tonight.', inst_bodyguard_close: 'Bodyguard, close your eyes.', inst_sarika_open: 'Aunt Sarika, open your eyes and vote for one name.', inst_sarika_close: 'Aunt Sarika, close your eyes.', inst_vogon_watch: 'Vogon, you may open your eyes at exactly one name and check whether someone votes.', inst_mafia_vote_names: 'Now read the living players’ names. The mafia silently signals at the chosen name.', inst_morning_open: 'Morning comes. Everyone, open your eyes.', inst_day_discussion: 'It is daytime. Accusations, discussion and arguments may begin.', inst_day_vote: 'If there is an accused player, count to three and vote. If there is majority, record the elimination.', inst_endgame_warning: 'Check the situation. The game may be over or in endgame.', inst_round_ended: 'The round is over. All roles are revealed; check the summary.'
  },
  notices: { notice_citizens_can_win: 'The system says all mafiosi are out. Citizens may win.', notice_mafia_can_win: 'The system says the mafia has reached its win condition.', notice_endgame_three: 'Endgame: 3 living players remain, 1 mafioso and 2 non-mafia.', notice_mafia_won: 'Round ended: mafia won.', notice_citizens_won: 'Round ended: citizens won.' },
  generalRules: ['The game alternates between days and nights.', 'During the day, everyone may talk, accuse and vote.', 'At night, everyone keeps their eyes closed while the game master calls roles.', 'Eliminated players may not give information to the living.', 'Citizens aim to eliminate all mafiosi.', 'Mafia wins when living mafiosi are at least as many as living non-mafia players.'],
  roleDescriptions: { citizen: 'As a citizen, watch discussions, contradictions and suspicious behavior. Your goal is to expose the mafia.', mafia: 'As mafia, pretend to be a citizen during the day, and at night coordinate with the other mafiosi.', detective: 'As detective, each night you may ask about one player. The game master indicates whether they are mafia.', collaborator: 'As collaborator, you count as a citizen, but you win if the mafia wins.', bodyguard: 'As bodyguard, you can protect one player at night. The game master handles the result.', protectedCitizen: 'As protected citizen, you may receive game master mercy after a daytime execution.', grocer: 'As corner grocer, when you die, the game master announces that the corner grocer died.', kamikaze: 'As kamikaze, after your death you may name someone who dies with you.', lovers: 'As one of the lovers, if your partner dies, you die too.', sarika: 'As Aunt Sarika, you vote for a name at night. The game master interprets the effect.', vogon: 'As Vogon, you may open your eyes at one name and check whether someone votes.' },
  errors: { ...window.I18N.hu.errors, default: 'Something went wrong.' }
};

window.I18N.de = {
  ...window.I18N.en,
  appTitle: 'Mafia-Spielassistent', createGame: 'Neues Spiel erstellen', joinGame: 'Spiel beitreten', hostName: 'Name des Spielleiters', playerName: 'Spielername', sessionCode: 'Session-Code', language: 'Sprache', extras: 'Zusatzrollen', create: 'Erstellen', join: 'Beitreten', revealRole: 'Meine Rolle anzeigen', hideRole: 'Meine Rolle verbergen', waitingForHost: 'Warten auf den Spielleiter…', players: 'Spieler', gameMaster: 'Spielleiter', currentGameMaster: 'Aktueller Spielleiter', round: 'Runde', phase: 'Phase', alive: 'Lebt', dead: 'Ausgeschieden', kicked: 'Entfernt', hidden: 'Verborgen', role: 'Rolle', status: 'Status', rules: 'Regelhilfe', roleRules: 'Rollenbeschreibung', generalRulesTitle: 'Kurzregeln', startRound: 'Runde starten / Rollen verteilen', minPlayersHint: 'Minimum: 6 aktive Spieler + 1 Spielleiter.', moveUp: 'Hoch', moveDown: 'Runter', kick: 'Entfernen', restore: 'Wiederbeleben', eliminate: 'Spieler scheidet aus', noDeath: 'Niemand ist gestorben', reason: 'Grund', reason_day: 'Hinrichtung am Tag', reason_night: 'Tod in der Nacht', reason_extra: 'Zusatzrolle', reason_manual: 'Manuell/Admin', setPhase: 'Phase wechseln', prevInstruction: 'Vorige Anweisung', nextInstruction: 'Nächste Anweisung', sayThis: 'Jetzt sagen', extendSession: 'Session-Zeit auf 6 Stunden setzen', sessionExtended: 'Session auf 6 Stunden verlängert.', ttl: 'Läuft ab in', protectedCheckUnused: 'Detektiv-Antwort: beim ersten Prüfen als Bürger melden.', protectedCheckUsed: 'Detektiv-Antwort: ab jetzt darf Mafia gesagt werden.', protectedCheckButton: 'Detektiv hat bereits geprüft', bodyguardMark: 'Vom Leibwächter geschützt', sarikaMark: 'Von Sarika gewählt', unmark: 'Markierung löschen', endRound: 'Runde beenden', citizensWin: 'Bürger haben gewonnen', mafiaWin: 'Mafia hat gewonnen', nextRound: 'Nächste Runde', closeSession: 'Session schließen', roundSummary: 'Rundenzusammenfassung', history: 'Session-Verlauf', survived: 'Überlebt', won: 'Gewonnen', lost: 'Verloren', nobody: 'Niemand', confirmClose: 'Session wirklich schließen? Das aktuelle Spiel wird gelöscht.', copied: 'Kopiert', copyCode: 'Code kopieren', yes: 'Ja', no: 'Nein', pendingActions: 'Aufgaben des Spielleiters', resolve: 'Erledigt', appNotice: 'Abstimmungen und nächtliche Zeichen passieren weiterhin persönlich. Die App führt nur den Zustand.',
  roles: { citizen: 'Bürger', mafia: 'Mafioso', detective: 'Detektiv', hidden: 'Verborgene Rolle' },
  teams: { citizens: 'Bürger', mafia: 'Mafia', hidden: 'Verborgen' },
  extrasMap: { collaborator: 'Kollaborateur', bodyguard: 'Leibwächter', protectedCitizen: 'Geschützter Bürger', grocer: 'Eckladenbesitzer', kamikaze: 'Kamikaze', lovers: 'Liebespaar', sarika: 'Tante Sarika', vogon: 'Vogon' },
  phases: { lobby: 'Warteraum', round_ready: 'Rollen verteilt', intro_night: 'Einführungsnacht', day: 'Tag', night: 'Nacht', endgame_warning: 'Endspiel / Sieg-Hinweis', round_ended: 'Runde beendet', session_closed: 'Session geschlossen' },
  generalRules: ['Das Spiel wechselt zwischen Tag und Nacht.', 'Am Tag dürfen alle reden, anklagen und abstimmen.', 'In der Nacht halten alle die Augen geschlossen, während der Spielleiter Rollen aufruft.', 'Ausgeschiedene Spieler dürfen den Lebenden keine Informationen geben.', 'Die Bürger wollen alle Mafiosi ausschalten.', 'Die Mafia gewinnt, wenn lebende Mafiosi mindestens so viele sind wie Nicht-Mafia-Spieler.']
};

Object.assign(window.I18N.hu, {
  fullRulesTitle: 'Teljes szabályleírás',
  statsTitle: 'Session statisztika',
  noStatsYet: 'Még nincs lezárt kör ebben a sessionben.',
  games: 'Játékok',
  wins: 'Győzelem',
  losses: 'Vereség',
  gmRounds: 'Játékvezetés',
  previousRoles: 'Korábbi szerepek',
  fullRules: [
    {
      title: 'Alaphelyzet és cél',
      paragraphs: [
        'A játékban egy kisváros polgárai közé maffiózók keveredtek. Nappal mindenki ártatlannak próbál látszani, éjszaka viszont a maffia titokban áldozatot választ.',
        'A polgárok célja, hogy beszélgetéssel, gyanús jelek megfigyelésével és szavazással kiejtsék az összes maffiózót. A maffia célja, hogy addig ritkítsa a várost, amíg az élő maffiózók száma legalább annyi lesz, mint az élő nem maffiózóké.'
      ]
    },
    {
      title: 'Szereposztás és titoktartás',
      paragraphs: [
        'A játék elején minden aktív játékos titkos szerepet kap. A játékvezető nem kap szerepet az adott körben, ő vezeti a játékot és látja az összes kiosztott szerepet.',
        'Minden játékos csak a saját szerepét nézheti meg. A telefonon a szerep alapból rejtett, és csak a felfedés gombbal látható. A szerepet úgy kell kezelni, mintha papírkártya lenne: más ne lássa meg.'
      ]
    },
    {
      title: 'Nulladik éjszaka',
      paragraphs: [
        'A kör elején mindenki becsukja a szemét. A játékvezető először a felügyelőt szólítja, hogy nyissa ki a szemét és fedje fel magát neki, majd csukja be újra.',
        'Ezután a maffiózók nyitják ki a szemüket, megismerik egymást, és a védett maffiózó is jelzi magát a játékvezetőnek. Ha van szerelmespár, a játékvezető külön szólíthatja őket, hogy megismerjék egymást.'
      ]
    },
    {
      title: 'Nappal',
      paragraphs: [
        'Nappal minden élő játékos beszélhet, gyanúsíthat, vádolhat és érvelhet. A vádakról és kivégzésekről a társaság személyesen, kézfeltartással vagy más megbeszélt módon szavaz.',
        'Ha a szavazás sikeres, a játékvezető az appban kiejti az adott játékost. Ha nincs meg a többség, egyszerűen lehet tovább beszélgetni vagy fázist váltani; külön “senki nem halt meg” eseményre nincs szükség.'
      ]
    },
    {
      title: 'Éjszaka',
      paragraphs: [
        'Éjszaka mindenki becsukja a szemét. A játékvezető sorban szólítja a szerepeket. A felügyelő egy játékosra kérdezhet rá, a játékvezető pedig csendben jelzi, hogy maffiózó-e.',
        'A maffia a játékvezető által sorolt élő neveknél csendben jelez. Ha a szabályok szerint sikerült közös áldozatot választaniuk, a játékvezető az appban kiejti az áldozatot. Ha nem sikerült, egyszerűen nappalra lehet váltani.'
      ]
    },
    {
      title: 'Alapszerepek',
      paragraphs: [
        'Polgár: nincs külön éjszakai képessége, nappal figyel, érvel és szavaz. Felügyelő: minden éjszaka rákérdezhet egy játékosra. Maffiózó: nappal polgárnak tetteti magát, éjszaka a többi maffiózóval próbál áldozatot választani.',
        'Védett maffiózó mindig van. A felügyelő első lekérdezésére polgárnak számít, második lekérdezésnél már maffiózónak mondható. A játékvezetőnél külön gomb jelzi, hogy az első lekérdezés már megtörtént.'
      ]
    },
    {
      title: 'Extra szerepek',
      paragraphs: [
        'Kollaboráns: polgárnak számít, de akkor nyer, ha a maffia nyer. Testőr: éjszaka megvédhet egy játékost; a játékvezető a jelölőt használhatja, hogy ne kelljen fejben tartania. Védett polgár: nappali kivégzésnél játékvezetői kegyelmet kaphat.',
        'Sarki fűszeres: halálakor a játékvezető bemondja, hogy meghalt a sarki fűszeres. Kamikáze: halálakor megnevezhet valakit, aki vele hal. Szerelmespár: ha az egyik meghal, a másik is vele hal.',
        'Sárika néni: éjszaka egy névre szavaz; a játékvezető jelölővel követheti. Vogon: egyetlen névnél kinyithatja a szemét, és megnézheti, szavaz-e valaki.'
      ]
    },
    {
      title: 'Kiesés, információ és sportszerűség',
      paragraphs: [
        'A kiesett játékos már nem szólhat bele a játékba, nem adhat jelzést, grimaszt vagy információt az élőknek. Nyitva tarthatja a szemét, de a játék menetét nem befolyásolhatja.',
        'A játékban lehet erős vádaskodás és szerepjáték, de minden sértés és gyanúsítás csak a játék idejére szól. A cél a közös játékélmény.'
      ]
    },
    {
      title: 'Játék vége',
      paragraphs: [
        'A polgárok nyernek, ha minden maffiózó kiesik. A maffia nyer, ha az élő maffiózók száma legalább akkora, mint az élő nem maffiózók száma.',
        'Háromfős végjátékban, ha egy maffiózó és két nem maffiózó marad, a játékvezető dönthet úgy, hogy nincs több éjszaka, hanem a játékosok nappali vitával és végső szavazással döntenek.'
      ]
    }
  ]
});

Object.assign(window.I18N.en, {
  fullRulesTitle: 'Full rules',
  statsTitle: 'Session statistics',
  noStatsYet: 'No completed round in this session yet.',
  games: 'Games',
  wins: 'Wins',
  losses: 'Losses',
  gmRounds: 'GM rounds',
  previousRoles: 'Previous roles',
  fullRules: [
    { title: 'Setup and objective', paragraphs: ['Mafiosi have infiltrated a town. During the day everyone tries to look innocent; at night the mafia secretly chooses victims.', 'Citizens win by eliminating every mafioso. The mafia wins when the number of living mafiosi is at least the number of living non-mafia players.'] },
    { title: 'Roles and secrecy', paragraphs: ['At the start of each round every active player receives a secret role. The game master does not receive a role in that round and can see all roles.', 'Each player should reveal their role only privately on their own phone. Treat the phone like a physical role card.'] },
    { title: 'Intro night', paragraphs: ['Everyone closes their eyes. The game master calls the detective first so the detective can reveal themselves to the game master.', 'Then the mafiosi open their eyes and recognize each other. The protected mafioso also signals to the game master. If lovers are enabled, they are called separately to recognize each other.'] },
    { title: 'Day', paragraphs: ['Living players may talk, accuse, defend and vote. Voting happens in person, not in the app.', 'If a vote succeeds, the game master marks the player as out. If no one dies, simply continue discussion or switch phase.'] },
    { title: 'Night', paragraphs: ['Everyone closes their eyes. The game master calls roles. The detective may ask about one player, and the game master silently answers whether that player is mafia.', 'The game master reads the living names. Mafiosi silently signal at the chosen name. If the kill succeeds, the game master marks the victim as out.'] },
    { title: 'Basic roles', paragraphs: ['Citizen: observes, argues and votes. Detective: checks one player each night. Mafioso: pretends to be a citizen by day and coordinates kills by night.', 'A protected mafioso is always present. The first detective check should return citizen; after the game master marks that the check happened, later checks may return mafia.'] },
    { title: 'Extra roles', paragraphs: ['Collaborator wins with the mafia but counts as non-mafia. Bodyguard protects one player at night. Protected citizen may receive mercy after a day execution.', 'Corner grocer is announced when they die. Kamikaze names someone to die with them. Lovers die together. Aunt Sarika votes for one name at night. Vogon may open their eyes at exactly one name to watch whether someone votes.'] },
    { title: 'Eliminated players and fair play', paragraphs: ['Eliminated players may no longer give information to the living, either verbally or through gestures.', 'Accusations and harsh statements are part of the roleplay only. Keep the game friendly outside the fiction.'] },
    { title: 'End of the game', paragraphs: ['Citizens win when no living mafioso remains. Mafia wins when living mafiosi are at least as many as living non-mafia players.', 'With three players left, one mafioso and two non-mafia, the game master may switch to final daytime debate instead of starting another night.'] }
  ]
});

Object.assign(window.I18N.de, {
  fullRulesTitle: 'Vollständige Regeln',
  statsTitle: 'Session-Statistik',
  noStatsYet: 'In dieser Session wurde noch keine Runde beendet.',
  games: 'Spiele',
  wins: 'Siege',
  losses: 'Niederlagen',
  gmRounds: 'Spielleitung',
  previousRoles: 'Frühere Rollen',
  fullRules: [
    { title: 'Ausgangslage und Ziel', paragraphs: ['Mafiosi haben sich unter die Bürger gemischt. Am Tag wirken alle unschuldig, in der Nacht sucht die Mafia heimlich Opfer aus.', 'Die Bürger gewinnen, wenn alle Mafiosi ausgeschieden sind. Die Mafia gewinnt, wenn lebende Mafiosi mindestens so viele sind wie lebende Nicht-Mafia-Spieler.'] },
    { title: 'Rollen und Geheimhaltung', paragraphs: ['Zu Beginn jeder Runde erhält jeder aktive Spieler eine geheime Rolle. Der Spielleiter erhält in dieser Runde keine Rolle und sieht alle Rollen.', 'Jeder Spieler zeigt seine Rolle nur privat auf dem eigenen Telefon an. Das Telefon ist wie eine Rollenkarte zu behandeln.'] },
    { title: 'Einführungsnacht', paragraphs: ['Alle schließen die Augen. Der Spielleiter ruft zuerst den Detektiv, damit er sich dem Spielleiter zeigt.', 'Danach öffnen die Mafiosi die Augen und erkennen einander. Der geschützte Mafioso gibt sich ebenfalls dem Spielleiter zu erkennen. Wenn das Liebespaar aktiv ist, wird es separat aufgerufen.'] },
    { title: 'Tag', paragraphs: ['Lebende Spieler dürfen sprechen, anklagen, verteidigen und abstimmen. Die Abstimmung geschieht persönlich, nicht in der App.', 'Wenn eine Abstimmung erfolgreich ist, markiert der Spielleiter den Spieler als ausgeschieden. Wenn niemand stirbt, wird einfach weitergespielt oder die Phase gewechselt.'] },
    { title: 'Nacht', paragraphs: ['Alle schließen die Augen. Der Spielleiter ruft die Rollen. Der Detektiv darf nach einem Spieler fragen; der Spielleiter antwortet still, ob dieser Mafia ist.', 'Der Spielleiter liest die Namen der Lebenden. Die Mafiosi geben beim Zielnamen ein stilles Zeichen. Bei erfolgreichem Mord markiert der Spielleiter das Opfer als ausgeschieden.'] },
    { title: 'Grundrollen', paragraphs: ['Bürger: beobachtet, argumentiert und stimmt ab. Detektiv: prüft jede Nacht einen Spieler. Mafioso: gibt sich tagsüber als Bürger aus und koordiniert nachts Morde.', 'Ein geschützter Mafioso ist immer vorhanden. Bei der ersten Detektivprüfung gilt er als Bürger; nach Markierung durch den Spielleiter kann er später als Mafia gemeldet werden.'] },
    { title: 'Zusatzrollen', paragraphs: ['Kollaborateur gewinnt mit der Mafia, zählt aber nicht als Mafioso. Leibwächter schützt nachts einen Spieler. Geschützter Bürger kann nach einer Hinrichtung am Tag Gnade erhalten.', 'Eckladenbesitzer wird bei seinem Tod angesagt. Kamikaze nennt jemanden, der mit ihm stirbt. Liebespaar stirbt gemeinsam. Tante Sarika stimmt nachts für einen Namen. Vogon darf bei genau einem Namen die Augen öffnen und beobachten, ob jemand stimmt.'] },
    { title: 'Ausgeschiedene und Fairness', paragraphs: ['Ausgeschiedene Spieler dürfen den Lebenden keine Informationen mehr geben, weder verbal noch durch Gesten.', 'Anklagen und harte Aussagen gehören nur zum Rollenspiel. Außerhalb der Fiktion bleibt das Spiel freundlich.'] },
    { title: 'Spielende', paragraphs: ['Die Bürger gewinnen, wenn kein Mafioso mehr lebt. Die Mafia gewinnt, wenn lebende Mafiosi mindestens so viele sind wie lebende Nicht-Mafia-Spieler.', 'Bei drei übrigen Spielern, einem Mafioso und zwei Nicht-Mafiosi, kann der Spielleiter statt einer weiteren Nacht eine finale Tagesdebatte ansetzen.'] }
  ]
});
