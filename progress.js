// Local progress service. The storage adapter is the only layer that needs to
// change when progress moves from this browser to a UID-backed store.
(function () {
  const STORAGE_KEY = 'learnsphere.progress';
  const GUEST_STORAGE_KEY = 'learnsphere.progress.guest';
  const USER_STORAGE_PREFIX = 'learnsphere.progress.user.';
  const SCHEMA_VERSION = 2;
  const LEVEL_NAMES = ['Adventurer', 'Explorer', 'Scholar', 'Champion'];
  const DAY_MS = 86400000;

  const storage = {
    read(key = STORAGE_KEY) {
      try { return localStorage.getItem(key); } catch (error) { return null; }
    },
    write(value, key = STORAGE_KEY) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (error) { return false; }
    },
    clear(key = STORAGE_KEY) {
      try { localStorage.removeItem(key); } catch (error) { /* Storage may be unavailable. */ }
    }
  };

  function freshProgress() {
    return {
      schemaVersion: SCHEMA_VERSION, uid: null, totalXP: 0, xpTransactions: [],
      lessonsCompleted: [], lessonCompletions: {}, quizzes: {}, matching: {},
      gamesPlayed: 0, streak: 0, longestStreak: 0, lastActivityDate: null,
      activityDates: [], achievementsUnlocked: [], learnerName: 'Learner',
      rewardLedger: { firstRewards: {}, processedAttemptIds: [] }
    };
  }

  const finite = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
  const plainObject = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const uniqueStrings = value => [...new Set((Array.isArray(value) ? value : []).filter(item => typeof item === 'string' && item.length > 0))];

  function normalize(saved) {
    const progress = { ...freshProgress(), ...plainObject(saved) };
    progress.schemaVersion = SCHEMA_VERSION;
    progress.uid = typeof progress.uid === 'string' ? progress.uid : null;
    progress.lessonsCompleted = uniqueStrings(progress.lessonsCompleted);
    progress.lessonCompletions = plainObject(progress.lessonCompletions);
    progress.quizzes = plainObject(progress.quizzes);
    progress.matching = plainObject(progress.matching);
    progress.activityDates = uniqueStrings(progress.activityDates).filter(isDateKey).sort();
    progress.achievementsUnlocked = uniqueStrings(progress.achievementsUnlocked);
    progress.rewardLedger = { firstRewards: {}, processedAttemptIds: [], ...plainObject(progress.rewardLedger) };
    progress.rewardLedger.firstRewards = plainObject(progress.rewardLedger.firstRewards);
    progress.rewardLedger.processedAttemptIds = uniqueStrings(progress.rewardLedger.processedAttemptIds);
    progress.xpTransactions = Array.isArray(progress.xpTransactions) ? progress.xpTransactions.filter(item => item && typeof item.id === 'string' && finite(item.amount) > 0) : [];
    progress.streak = finite(progress.streak);
    progress.longestStreak = Math.max(finite(progress.longestStreak), progress.streak);
    progress.gamesPlayed = finite(progress.gamesPlayed);
    progress.lastActivityDate = isDateKey(progress.lastActivityDate) ? progress.lastActivityDate : null;

    // Migrate the existing v1 records once. Lessons were marked complete without
    // lesson XP, while existing game rewards are already included in totalXP.
    if (!Array.isArray(saved?.xpTransactions)) {
      const legacyXP = finite(saved?.totalXP);
      if (legacyXP) progress.xpTransactions.push({ id: 'migration:legacy-xp', amount: legacyXP, reason: 'migration', at: null });
      progress.lessonsCompleted.forEach(id => {
        const key = `lesson:${id}`;
        if (!progress.rewardLedger.firstRewards[key]) {
          progress.rewardLedger.firstRewards[key] = true;
          progress.xpTransactions.push({ id: `migration:lesson:${id}`, amount: 10, reason: 'lesson', at: null });
        }
      });
      for (const type of ['quiz', 'matching']) {
        const collection = type === 'quiz' ? progress.quizzes : progress.matching;
        Object.keys(collection).forEach(id => { progress.rewardLedger.firstRewards[`${type}:${id}`] = true; });
      }
    }
    progress.totalXP = progress.xpTransactions.reduce((sum, item) => sum + finite(item.amount), 0);
    progress.gamesPlayed = Math.max(progress.gamesPlayed, Object.values(progress.quizzes).reduce((sum, item) => sum + finite(item?.attempts), 0) + Object.values(progress.matching).reduce((sum, item) => sum + finite(item?.attempts), 0));
    return progress;
  }

  function readProgress() {
    const raw = storage.read();
    if (!raw) return freshProgress();
    try {
      const saved = JSON.parse(raw);
      const progress = normalize(saved);
      if (!saved || saved.schemaVersion !== SCHEMA_VERSION) storage.write(progress);
      return progress;
    } catch (error) { return freshProgress(); }
  }

  function readStoredProgress(key) {
    const raw = storage.read(key);
    if (!raw) return null;
    try { return normalize(JSON.parse(raw)); } catch (error) { return null; }
  }

  function accountKey(uid) { return `${USER_STORAGE_PREFIX}${encodeURIComponent(uid)}`; }

  function combineGameRecords(left = {}, right = {}, type) {
    const history = [...(Array.isArray(left.history) ? left.history : []), ...(Array.isArray(right.history) ? right.history : [])];
    const unique = new Map();
    history.forEach(item => {
      const identity = item.attemptId || `${item.completedAt || ''}:${item.score ?? ''}:${item.total ?? ''}:${item.moves ?? ''}:${item.pairs ?? ''}`;
      if (!unique.has(identity)) unique.set(identity, item);
    });
    const mergedHistory = [...unique.values()].sort((a, b) => String(a.completedAt || '').localeCompare(String(b.completedAt || ''))).slice(-50);
    const leftAttempts = finite(left.attempts);
    const rightAttempts = finite(right.attempts);
    const historyCount = Math.max(leftAttempts, rightAttempts, mergedHistory.length);
    const latest = String(left.completedAt || '') >= String(right.completedAt || '') ? left : right;
    const merged = { ...left, ...right, ...latest, attempts: Math.max(historyCount, mergedHistory.length), history: mergedHistory };
    if (type === 'quiz') {
      const best = Number(left.bestPercent ?? (left.bestTotal ? left.bestScore / left.bestTotal * 100 : 0)) >= Number(right.bestPercent ?? (right.bestTotal ? right.bestScore / right.bestTotal * 100 : 0)) ? left : right;
      merged.bestScore = finite(best.bestScore);
      merged.bestTotal = finite(best.bestTotal);
      merged.bestPercent = finite(best.bestPercent ?? (best.bestTotal ? best.bestScore / best.bestTotal * 100 : 0));
    } else {
      const moves = [left.bestMoves, right.bestMoves].filter(value => value !== null && value !== undefined && Number.isFinite(Number(value))).map(Number);
      if (moves.length) merged.bestMoves = Math.min(...moves);
    }
    return merged;
  }

  function mergeProgressRecords(base, incoming, uid) {
    const merged = normalize(base || freshProgress());
    const extra = normalize(incoming || freshProgress());
    const tx = new Map(merged.xpTransactions.map(item => [item.id, item]));
    extra.xpTransactions.forEach(item => {
      const existing = tx.get(item.id);
      tx.set(item.id, existing && item.id === 'migration:legacy-xp' && item.amount > existing.amount ? item : (existing || item));
    });
    merged.xpTransactions = [...tx.values()];
    merged.lessonsCompleted = uniqueStrings([...merged.lessonsCompleted, ...extra.lessonsCompleted]);
    merged.lessonCompletions = { ...merged.lessonCompletions, ...extra.lessonCompletions };
    merged.achievementsUnlocked = uniqueStrings([...merged.achievementsUnlocked, ...extra.achievementsUnlocked]);
    merged.rewardLedger.firstRewards = { ...merged.rewardLedger.firstRewards, ...extra.rewardLedger.firstRewards };
    merged.rewardLedger.processedAttemptIds = uniqueStrings([...merged.rewardLedger.processedAttemptIds, ...extra.rewardLedger.processedAttemptIds]);
    merged.activityDates = uniqueStrings([...merged.activityDates, ...extra.activityDates]).filter(isDateKey).sort();
    merged.lastActivityDate = [merged.lastActivityDate, extra.lastActivityDate].filter(isDateKey).sort().at(-1) || null;
    merged.longestStreak = Math.max(merged.longestStreak, extra.longestStreak);
    const latestSource = String(extra.lastActivityDate || '') > String(base?.lastActivityDate || '') ? extra : merged;
    merged.streak = latestSource.streak;
    merged.learnerName = base?.learnerName && base.learnerName !== 'Learner' ? base.learnerName : (extra.learnerName || merged.learnerName);
    for (const type of ['quizzes', 'matching']) {
      const ids = new Set([...Object.keys(merged[type]), ...Object.keys(extra[type])]);
      ids.forEach(id => {
        if (!merged[type][id]) merged[type][id] = extra[type][id];
        else if (extra[type][id]) merged[type][id] = combineGameRecords(merged[type][id], extra[type][id], type === 'quizzes' ? 'quiz' : 'matching');
      });
    }
    merged.gamesPlayed = Object.values(merged.quizzes).reduce((sum, item) => sum + finite(item.attempts), 0) + Object.values(merged.matching).reduce((sum, item) => sum + finite(item.attempts), 0);
    merged.totalXP = merged.xpTransactions.reduce((sum, item) => sum + finite(item.amount), 0);
    merged.uid = uid || null;
    return merged;
  }

  function activateUser(uid, displayName = '') {
    if (typeof uid !== 'string' || !uid) return readProgress();
    const current = readProgress();
    const key = accountKey(uid);
    const accountProgress = readStoredProgress(key);
    if (current.uid === uid) {
      current.uid = uid;
      if ((!current.learnerName || current.learnerName === 'Learner') && displayName) current.learnerName = displayName;
      storage.write(current, key);
      storage.write(current);
      return current;
    }

    let guestProgress = null;
    if (!current.uid) {
      guestProgress = current;
      storage.write(guestProgress, GUEST_STORAGE_KEY);
    } else {
      guestProgress = readStoredProgress(GUEST_STORAGE_KEY);
    }
    let combined = accountProgress || freshProgress();
    // Re-merge guest changes on each sign-in. Stable XP transaction IDs,
    // completion IDs and game attempt IDs make this safe to repeat.
    if (guestProgress) {
      combined = mergeProgressRecords(combined, guestProgress, uid);
    } else {
      combined.uid = uid;
    }
    if ((!combined.learnerName || combined.learnerName === 'Learner') && displayName) combined.learnerName = displayName.slice(0, 24);
    save(combined);
    storage.write(combined, key);
    return combined;
  }

  function activateGuest() {
    const current = readProgress();
    if (!current.uid) return current;
    storage.write(current, accountKey(current.uid));
    const guest = readStoredProgress(GUEST_STORAGE_KEY) || freshProgress();
    guest.uid = null;
    storage.write(guest);
    emit(guest);
    return guest;
  }

  function emit(progress) {
    try { window.dispatchEvent(new CustomEvent('learnsphere:progress', { detail: progress })); } catch (error) { /* Non-browser test environments may omit events. */ }
  }

  function levelFor(xp) {
    const safeXP = finite(xp);
    const number = Math.floor(safeXP / 100) + 1;
    return { number, name: LEVEL_NAMES[Math.min(number - 1, LEVEL_NAMES.length - 1)], xpIntoLevel: safeXP % 100, nextLevelXP: 100 };
  }

  function isDateKey(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)); }
  function dateKey(date = new Date()) {
    const year = date.getFullYear();
    return `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function dayNumber(key) { return Date.parse(`${key}T00:00:00Z`) / DAY_MS; }

  function updateStreak(progress, date = new Date()) {
    const today = typeof date === 'string' ? date : dateKey(date);
    if (!isDateKey(today)) return;
    progress.activityDates = uniqueStrings([...progress.activityDates, today]).sort();
    if (!progress.lastActivityDate || !isDateKey(progress.lastActivityDate)) {
      progress.streak = 1;
      progress.lastActivityDate = today;
    } else {
      const gap = dayNumber(today) - dayNumber(progress.lastActivityDate);
      if (gap === 1) { progress.streak += 1; progress.lastActivityDate = today; }
      else if (gap > 1) { progress.streak = 1; progress.lastActivityDate = today; }
      else if (gap === 0) { /* Multiple activities on one local day count once. */ }
      // Older/offline dates are recorded without rewinding the active streak.
    }
    progress.longestStreak = Math.max(progress.longestStreak, progress.streak);
  }

  function achievementStatus(progress) {
    const definitions = window.LEARNSPHERE_ACHIEVEMENTS || [];
    const nowUnlocked = [];
    const result = definitions.map(item => {
      const measured = finite(item.measure(progress));
      const value = Math.min(measured, item.target);
      const unlocked = measured >= item.target || progress.achievementsUnlocked.includes(item.id);
      if (measured >= item.target && !progress.achievementsUnlocked.includes(item.id)) nowUnlocked.push(item.id);
      return { ...item, value, unlocked, progressPercent: Math.round(value / item.target * 100) };
    });
    if (nowUnlocked.length) progress.achievementsUnlocked = uniqueStrings([...progress.achievementsUnlocked, ...nowUnlocked]);
    return result;
  }

  function save(progress) {
    progress.totalXP = progress.xpTransactions.reduce((sum, item) => sum + finite(item.amount), 0);
    progress.schemaVersion = SCHEMA_VERSION;
    achievementStatus(progress);
    storage.write(progress);
    if (progress.uid) storage.write(progress, accountKey(progress.uid));
    emit(progress);
    return progress;
  }

  function award(progress, transactionId, amount, reason) {
    if (progress.xpTransactions.some(item => item.id === transactionId)) return 0;
    const value = finite(amount);
    if (!value) return 0;
    progress.xpTransactions.push({ id: transactionId, amount: value, reason, at: new Date().toISOString() });
    progress.totalXP += value;
    return value;
  }

  function markLessonComplete(lessonId, date) {
    const progress = readProgress();
    const firstTime = !progress.lessonsCompleted.includes(lessonId);
    let xpAwarded = 0;
    if (firstTime) {
      progress.lessonsCompleted.push(lessonId);
      progress.lessonCompletions[lessonId] = dateKey(typeof date === 'string' ? new Date(`${date}T12:00:00`) : date || new Date());
      progress.rewardLedger.firstRewards[`lesson:${lessonId}`] = true;
      xpAwarded = award(progress, `first:lesson:${lessonId}`, 10, 'lesson');
      updateStreak(progress, date || new Date());
      save(progress);
    }
    return { firstTime, xpAwarded, progress };
  }

  function createAttemptId(type, lessonId) {
    return `${type}:${lessonId}:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 10)}`;
  }

  function recordGame(type, lessonId, result, attemptId, date) {
    if (!['quiz', 'matching'].includes(type) || typeof lessonId !== 'string' || !lessonId) return { firstTime: false, duplicate: true, xpAwarded: 0, progress: readProgress() };
    const progress = readProgress();
    const id = typeof attemptId === 'string' && attemptId ? attemptId : createAttemptId(type, lessonId);
    const processedId = `${type}:${lessonId}:${id}`;
    if (progress.rewardLedger.processedAttemptIds.includes(processedId)) return { firstTime: false, duplicate: true, xpAwarded: 0, progress };
    const collection = type === 'quiz' ? progress.quizzes : progress.matching;
    const previous = collection[lessonId];
    const firstTime = !progress.rewardLedger.firstRewards[`${type}:${lessonId}`];
    const safeResult = plainObject(result);
    const completedAt = new Date().toISOString();
    const historyEntry = { ...safeResult, attemptId: id, completedAt };
    const history = Array.isArray(previous?.history) ? previous.history : [];
    const next = { ...(previous || {}), ...safeResult, attempts: finite(previous?.attempts) + 1, completedAt, lastAttemptId: id, history: [...history, historyEntry].slice(-50) };
    if (type === 'quiz' && Number.isFinite(Number(safeResult.score))) {
      const score = finite(safeResult.score);
      next.bestScore = Math.max(finite(previous?.bestScore), score);
      next.bestTotal = Math.max(finite(previous?.bestTotal), finite(safeResult.total));
      next.bestPercent = Math.max(finite(previous?.bestPercent), finite(safeResult.total) ? Math.round(score / finite(safeResult.total) * 100) : 0);
    }
    if (type === 'matching' && Number.isFinite(Number(safeResult.moves))) {
      const moves = finite(safeResult.moves);
      next.bestMoves = previous?.bestMoves == null ? moves : Math.min(finite(previous.bestMoves), moves);
    }
    collection[lessonId] = next;
    progress.rewardLedger.processedAttemptIds.push(processedId);
    progress.gamesPlayed += 1;
    progress.rewardLedger.firstRewards[`${type}:${lessonId}`] = true;
    const xpAwarded = award(progress, firstTime ? `first:${type}:${lessonId}` : `replay:${processedId}`, firstTime ? 5 : 2, firstTime ? type : 'replay');
    updateStreak(progress, date || new Date());
    save(progress);
    return { firstTime, duplicate: false, xpAwarded, progress };
  }

  function getSubjectProgress(subjectId) {
    const progress = readProgress();
    const subjects = (window.LEARNSPHERE_SUBJECTS || []).filter(item => !subjectId || item.id === subjectId);
    return subjects.map(subject => {
      const completed = subject.lessons.filter(lesson => progress.lessonsCompleted.includes(lesson.id)).length;
      return { id: subject.id, name: subject.name, completed, total: subject.lessons.length, percent: subject.lessons.length ? Math.round(completed / subject.lessons.length * 100) : 0 };
    });
  }

  function getOverallProgress() {
    const subjects = getSubjectProgress();
    const total = subjects.reduce((sum, item) => sum + item.total, 0);
    const completed = subjects.reduce((sum, item) => sum + item.completed, 0);
    return { completed, total, percent: total ? Math.round(completed / total * 100) : 0 };
  }

  function setLearnerName(value) {
    const progress = readProgress();
    const name = String(value || '').trim().replace(/\s+/g, ' ').slice(0, 24);
    if (!name) return { saved: false, progress };
    progress.learnerName = name;
    save(progress);
    return { saved: true, progress };
  }

  function resetProgress() { storage.clear(); const progress = freshProgress(); save(progress); return progress; }

  window.LearnSphereProgress = {
    STORAGE_KEY, SCHEMA_VERSION, freshProgress, readProgress, saveProgress: save,
    levelFor, getLevel: levelFor, markLessonComplete, completeLesson: markLessonComplete,
    createAttemptId, recordQuizResult: (lessonId, result, attemptId, date) => recordGame('quiz', lessonId, result, attemptId, date),
    recordMatchingResult: (lessonId, result, attemptId, date) => recordGame('matching', lessonId, result, attemptId, date),
    completeGame: recordGame, awardXP: (amount, id, reason = 'bonus') => { const progress = readProgress(); const xpAwarded = award(progress, id, amount, reason); save(progress); return { xpAwarded, progress }; },
    updateStreak: date => { const progress = readProgress(); updateStreak(progress, date || new Date()); save(progress); return progress; },
    getAchievements: () => { const progress = readProgress(); const before = progress.achievementsUnlocked.length; const list = achievementStatus(progress); if (progress.achievementsUnlocked.length !== before) save(progress); return list; },
    getSubjectProgress, getOverallProgress, setLearnerName, activateUser, activateGuest, mergeProgressRecords, resetProgress
  };
})();
