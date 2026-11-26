// Quiz and matching gameplay share one route; query parameters make each screen refresh-safe.
(function () {
  const screens = ['pregame-screen', 'quiz-screen', 'matching-screen', 'results-screen', 'invalid-game-screen'];
  let gameType = '';
  let lessonId = '';
  let lesson = null;
  let subject = null;
  let typeLabel = '';
  let quizState = null;
  let matchingState = null;

  function showScreen(id) {
    screens.forEach(screenId => { document.getElementById(screenId).hidden = screenId !== id; });
  }

  function baseUrl(play = false) {
    return `game.html?type=${gameType}&lesson=${lessonId}${play ? '&play=1&again=' + Date.now() : ''}`;
  }

  function gamesUrl() { return `games.html?lesson=${lessonId}`; }
  function lessonListUrl() { return `lessons.html?subject=${subject.id}`; }

  function renderBreadcrumbs(lastLabel) {
    document.getElementById('game-breadcrumbs').innerHTML = `<a href="index.html">Dashboard</a><span aria-hidden="true">›</span><a href="games.html">Games</a><span aria-hidden="true">›</span><a href="${lessonListUrl()}">${subject.name}</a><span aria-hidden="true">›</span><a href="lesson.html?id=${lessonId}">${lesson.title}</a>${lastLabel ? `<span aria-hidden="true">›</span><span aria-current="page">${lastLabel}</span>` : ''}`;
  }

  function themeBanner(kicker, title, description, action = '') {
    return `<header class="game-banner ${subject.theme}"><div class="game-banner-icon" aria-hidden="true">${lesson.icon}</div><div><p class="eyebrow">${subject.name} · ${kicker}</p><h1>${title}</h1><p>${description}</p></div>${action}</header>`;
  }

  function renderPregame() {
    renderBreadcrumbs('Get ready');
    const isQuiz = gameType === 'quiz';
    const title = isQuiz ? 'Quiz' : 'Matching';
    const steps = isQuiz
      ? ['Read the question and choose one answer.', 'Press Check answer to see how you did.', 'Read the explanation and continue to the next question.']
      : ['Tap any card to reveal what is underneath.', 'Choose a second card and see if the ideas match.', 'Matched cards stay open. Find all four pairs to finish.'];
    document.getElementById('pregame-screen').innerHTML = `${themeBanner(`${title} challenge`, `Ready for ${title === 'Quiz' ? 'a quiz' : 'a matching challenge'}?`, `Practise ${lesson.title.toLowerCase()} with a quick ${title.toLowerCase()}.`, `<span class="game-lesson-chip">${subject.name} · ${lesson.title}</span>`)}<div class="pregame-layout"><section class="pregame-card"><div class="pregame-art ${gameType}-art-large" aria-hidden="true">${isQuiz ? '<span>?</span><i>A</i><i>B</i><i>C</i>' : '<i>?</i><i>?</i><i>?</i><i>?</i>'}</div><div class="pregame-copy"><p class="eyebrow">How to play</p><h2>${title === 'Quiz' ? 'Think it through, one question at a time.' : 'Turn, remember, and match.'}</h2><ul>${steps.map(step => `<li>${step}</li>`).join('')}</ul><div class="game-fact-row"><span>${isQuiz ? '4 questions' : '4 pairs · 8 cards'}</span><span>About ${isQuiz ? '3' : '4'} minutes</span></div><button class="button button-primary start-game-button" id="start-game" type="button">Start game <span aria-hidden="true">→</span></button></div></section><div class="game-back-row"><a class="button button-secondary" href="${gamesUrl()}">← Back to game choices</a><a class="game-text-link" href="lesson.html?id=${lessonId}">Back to lesson</a></div></div>`;
    showScreen('pregame-screen');
    document.getElementById('start-game').addEventListener('click', () => { window.location.href = baseUrl(true); });
  }

  function setResultsAddress() {
    const url = `game.html?type=${gameType}&lesson=${lessonId}&screen=results`;
    if (window.history?.replaceState) window.history.replaceState(null, '', url);
  }

  function renderResults(result) {
    const isQuiz = gameType === 'quiz';
    const score = isQuiz ? Number(result.score || 0) : null;
    const total = isQuiz ? Number(result.total || 4) : null;
    const percentage = isQuiz ? Math.round(score / total * 100) : 0;
    const message = isQuiz
      ? percentage === 100 ? 'Perfect score! You know this lesson really well.' : percentage >= 50 ? 'Nice effort! You’re building a strong understanding.' : 'Good start! Review the lesson and give it another go.'
      : Number(result.moves) <= 8 ? 'Brilliant spotting! You found the pairs in very few moves.' : Number(result.moves) <= 12 ? 'Great work! You matched every pair.' : 'You did it! A replay can help you spot the pairs even faster.';
    const bigResult = isQuiz ? `<strong>${score}<span> / ${total}</span></strong><small>correct answers</small>` : `<strong>${Number(result.pairs || 4)}<span> pairs</span></strong><small>matched in ${Number(result.moves || 0)} moves</small>`;
    renderBreadcrumbs('Results');
    document.getElementById('results-screen').innerHTML = `${themeBanner(`${isQuiz ? 'Quiz' : 'Matching'} complete`, isQuiz ? 'Quiz complete!' : 'All pairs matched!', lesson.title, `<span class="game-lesson-chip">${subject.name}</span>`)}<section class="game-result-card"><div class="result-spark" aria-hidden="true">✦</div><p class="eyebrow">Your result</p>${bigResult}<p class="result-message">${message}</p><div class="result-actions"><button class="button button-next" id="play-again" type="button">Play again <span aria-hidden="true">↻</span></button><a class="button button-secondary" href="${gamesUrl()}">Back to game choices</a></div><a class="result-lesson-link" href="${lessonListUrl()}">Back to ${subject.name} lessons</a><a class="result-lesson-link" href="lesson.html?id=${lessonId}">Return to this lesson</a></section>`;
    showScreen('results-screen');
    document.getElementById('play-again').addEventListener('click', () => { window.location.href = baseUrl(true); });
  }

  function finishQuiz() {
    if (quizState.saved) return;
    quizState.saved = true;
    const result = { score: quizState.score, total: quizState.questions.length };
    window.LearnSphereProgress.recordQuizResult(lessonId, result, quizState.attemptId);
    setResultsAddress();
    renderResults(result);
  }

  function renderQuizQuestion() {
    const question = quizState.questions[quizState.index];
    const number = quizState.index + 1;
    const percent = Math.round(quizState.index / quizState.questions.length * 100);
    renderBreadcrumbs('Quiz');
    document.getElementById('quiz-screen').innerHTML = `${themeBanner('Quiz', `Question ${number}`, lesson.title)}<section class="quiz-panel"><div class="quiz-progress-meta"><span>Question ${number} of ${quizState.questions.length}</span><span id="quiz-score-label">${quizState.score} correct so far</span></div><div class="progress-track game-progress-track" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuemax="${quizState.questions.length}" aria-valuenow="${quizState.index}"><span style="width:${percent}%"></span></div><h2 class="quiz-question">${question.question}</h2><div class="quiz-options">${question.options.map((option, index) => `<button class="quiz-option" type="button" data-option-index="${index}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join('')}</div><div class="quiz-feedback" id="quiz-feedback" role="status" aria-live="polite"></div><div class="quiz-controls"><a class="button button-secondary" href="${gamesUrl()}">← Game choices</a><button class="button button-primary" id="quiz-action" type="button" disabled>Check answer</button></div></section>`;
    showScreen('quiz-screen');
    const panel = document.querySelector('.quiz-panel');
    panel.addEventListener('click', event => {
      const option = event.target.closest('[data-option-index]');
      if (option && !quizState.answered) {
        quizState.selected = Number(option.dataset.optionIndex);
        panel.querySelectorAll('.quiz-option').forEach(button => button.classList.toggle('is-selected', Number(button.dataset.optionIndex) === quizState.selected));
        document.getElementById('quiz-action').disabled = false;
        return;
      }
      const action = event.target.closest('#quiz-action');
      if (!action || action.disabled) return;
      if (!quizState.answered) {
        quizState.answered = true;
        const correctIndex = question.options.indexOf(question.answer);
        const correct = quizState.selected === correctIndex;
        if (correct) quizState.score += 1;
        panel.querySelectorAll('.quiz-option').forEach(button => {
          const index = Number(button.dataset.optionIndex);
          button.disabled = true;
          if (index === correctIndex) button.classList.add('is-correct');
          if (index === quizState.selected && !correct) button.classList.add('is-incorrect');
        });
        document.getElementById('quiz-score-label').textContent = `${quizState.score} correct so far`;
        const feedback = document.getElementById('quiz-feedback');
        feedback.className = `quiz-feedback ${correct ? 'success' : 'try-again'}`;
        feedback.innerHTML = `<strong>${correct ? 'That’s right!' : 'Not quite.'}</strong> ${question.explanation}`;
        const progress = panel.querySelector('.game-progress-track');
        progress.setAttribute('aria-valuenow', String(number));
        progress.querySelector('span').style.width = `${Math.round(number / quizState.questions.length * 100)}%`;
        action.textContent = number === quizState.questions.length ? 'See results →' : 'Next question →';
      } else if (quizState.index + 1 === quizState.questions.length) {
        finishQuiz();
      } else {
        quizState.index += 1;
        quizState.selected = null;
        quizState.answered = false;
        renderQuizQuestion();
      }
    });
  }

  function startQuiz() {
    quizState = { questions: window.LEARNSPHERE_QUIZZES[lessonId], index: 0, score: 0, selected: null, answered: false, saved: false, attemptId: window.LearnSphereProgress.createAttemptId('quiz', lessonId) };
    renderQuizQuestion();
  }

  function shuffledCards() {
    const cards = window.LEARNSPHERE_MATCHING[lessonId].flatMap((pair, pairIndex) => [
      { pairIndex, text: pair.left }, { pairIndex, text: pair.right }
    ]);
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
    }
    return cards;
  }

  function renderMatching() {
    renderBreadcrumbs('Matching');
    const pairs = window.LEARNSPHERE_MATCHING[lessonId].length;
    const percent = Math.round(matchingState.pairsFound / pairs * 100);
    document.getElementById('matching-screen').innerHTML = `${themeBanner('Matching', 'Find the matching pairs', lesson.title)}<section class="matching-panel"><div class="matching-stats"><span>${matchingState.pairsFound} of ${pairs} pairs found</span><span>Moves: ${matchingState.moves}</span></div><div class="progress-track game-progress-track" role="progressbar" aria-label="Matched pairs" aria-valuemin="0" aria-valuemax="${pairs}" aria-valuenow="${matchingState.pairsFound}"><span style="width:${percent}%"></span></div><p class="matching-instruction">Choose two cards to see if they belong together.</p><div class="matching-grid">${matchingState.cards.map((card, index) => {
      const selected = matchingState.selected.includes(index);
      const matched = matchingState.matched.has(index);
      const mismatch = matchingState.mismatch && selected;
      const faceUp = selected || matched;
      return `<button class="matching-card ${faceUp ? 'is-revealed' : 'is-hidden'} ${matched ? 'is-matched' : ''} ${mismatch ? 'is-mismatch' : ''}" type="button" data-card-index="${index}" aria-label="${faceUp ? card.text : `Hidden card ${index + 1}`}" ${matched || matchingState.busy ? 'disabled' : ''}><span>${faceUp ? card.text : '?'}</span></button>`;
    }).join('')}</div><div class="matching-feedback" id="matching-feedback" role="status" aria-live="polite">${matchingState.feedback}</div><div class="matching-controls"><a class="button button-secondary" href="${gamesUrl()}">← Game choices</a><button class="button button-secondary" id="restart-matching" type="button">Shuffle and restart <span aria-hidden="true">↻</span></button></div></section>`;
    showScreen('matching-screen');
  }

  function finishMatching() {
    if (matchingState.saved) return;
    matchingState.saved = true;
    const result = { pairs: matchingState.pairsFound, moves: matchingState.moves };
    window.LearnSphereProgress.recordMatchingResult(lessonId, result, matchingState.attemptId);
    setResultsAddress();
    renderResults(result);
  }

  function startMatching() {
    if (matchingState?.timer) window.clearTimeout(matchingState.timer);
    matchingState = { cards: shuffledCards(), selected: [], matched: new Set(), moves: 0, pairsFound: 0, busy: false, mismatch: false, feedback: '', saved: false, attemptId: window.LearnSphereProgress.createAttemptId('matching', lessonId) };
    renderMatching();
  }

  function attachMatchingEvents() {
    const screen = document.getElementById('matching-screen');
    screen.addEventListener('click', event => {
      const restart = event.target.closest('#restart-matching');
      if (restart) { startMatching(); return; }
      const cardButton = event.target.closest('[data-card-index]');
      if (!cardButton || matchingState.busy || cardButton.disabled) return;
      const index = Number(cardButton.dataset.cardIndex);
      if (matchingState.selected.includes(index) || matchingState.matched.has(index)) return;
      matchingState.selected.push(index);
      matchingState.feedback = '';
      if (matchingState.selected.length < 2) { renderMatching(); return; }

      matchingState.moves += 1;
      const [first, second] = matchingState.selected;
      if (matchingState.cards[first].pairIndex === matchingState.cards[second].pairIndex) {
        matchingState.matched.add(first);
        matchingState.matched.add(second);
        matchingState.selected = [];
        matchingState.pairsFound += 1;
        matchingState.feedback = 'That’s a pair! Nice spotting.';
        renderMatching();
        if (matchingState.pairsFound === window.LEARNSPHERE_MATCHING[lessonId].length) {
          matchingState.busy = true;
          matchingState.timer = window.setTimeout(finishMatching, 550);
        }
      } else {
        matchingState.busy = true;
        matchingState.mismatch = true;
        matchingState.feedback = 'Those don’t go together. Try another pair.';
        renderMatching();
        matchingState.timer = window.setTimeout(() => {
          matchingState.selected = [];
          matchingState.busy = false;
          matchingState.mismatch = false;
          matchingState.timer = null;
          matchingState.feedback = 'Have another go — you can do it!';
          renderMatching();
        }, 850);
      }
    });
  }

  function showInvalid(message) {
    document.getElementById('game-breadcrumbs').innerHTML = '<a href="index.html">Dashboard</a><span aria-hidden="true">›</span><a href="games.html">Games</a>';
    document.getElementById('invalid-game-screen').innerHTML = `<section class="game-invalid-card"><span class="game-invalid-icon" aria-hidden="true">?</span><h1>Choose a game to play</h1><p>${message}</p><a class="button button-primary" href="games.html">Browse games</a></section>`;
    showScreen('invalid-game-screen');
  }

  function init() {
    const params = new URLSearchParams(window.location.search);
    gameType = params.get('type');
    lessonId = params.get('lesson');
    const isQuiz = gameType === 'quiz';
    typeLabel = isQuiz ? 'Quiz' : 'Matching';
    subject = window.LEARNSPHERE_SUBJECTS.find(item => item.lessons.some(entry => entry.id === lessonId));
    lesson = subject?.lessons.find(item => item.id === lessonId);
    const gameDataExists = isQuiz ? Boolean(window.LEARNSPHERE_QUIZZES[lessonId]?.length) : Boolean(window.LEARNSPHERE_MATCHING[lessonId]?.length);
    if (!['quiz', 'matching'].includes(gameType) || !subject || !lesson || !gameDataExists) {
      document.title = 'Choose a game · LearnSphere';
      showInvalid('Pick a lesson and a game type from the Games page.');
      return;
    }
    document.title = `${typeLabel} · ${lesson.title} · LearnSphere`;
    attachMatchingEvents();
    if (params.get('screen') === 'results') {
      const progress = window.LearnSphereProgress.readProgress();
      const saved = (isQuiz ? progress.quizzes : progress.matching)[lessonId];
      if (saved) { renderResults(saved); return; }
    }
    if (params.get('play') === '1') {
      if (isQuiz) startQuiz();
      else startMatching();
    } else renderPregame();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
