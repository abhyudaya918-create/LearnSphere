// One lesson template renders all six lessons; each activity is selected by its data kind.
(function () {
  const shapes = {
    Triangle: '<svg viewBox="0 0 64 56" aria-hidden="true"><path d="M32 5 60 51H4Z" /></svg>',
    Square: '<svg viewBox="0 0 64 56" aria-hidden="true"><rect x="10" y="6" width="44" height="44" rx="1" /></svg>',
    Circle: '<svg viewBox="0 0 64 56" aria-hidden="true"><circle cx="32" cy="28" r="22" /></svg>'
  };

  function subjectFor(lessonId) {
    return window.LEARNSPHERE_SUBJECTS.find(subject => subject.lessons.some(lesson => lesson.id === lessonId));
  }

  function renderText(lesson) {
    document.getElementById('lesson-reading').innerHTML = lesson.sections.map((section, index) => `
      <section class="lesson-section">
        <div class="lesson-section-heading"><span>${String(index + 1).padStart(2, '0')}</span><h2>${section.title}</h2></div>
        ${section.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}
        ${section.example ? `<aside class="lesson-example"><strong>Example</strong><p>${section.example}</p></aside>` : ''}
      </section>`).join('');
  }

  function answers(choices) {
    return `<div class="activity-choices">${choices.map(choice => `<button class="activity-choice" type="button" data-choice="${choice}">${choice}</button>`).join('')}</div>`;
  }

  function activityMarkup(activity, state) {
    const feedback = '<p class="activity-feedback" id="activity-feedback" role="status" aria-live="polite"></p>';
    if (activity.kind === 'worked-example') {
      return `<div class="worked-fraction" role="img" aria-label="${activity.shaded} of ${activity.total} equal parts shaded">${Array.from({ length: activity.total }, (_, index) => `<span class="${index < activity.shaded ? 'shaded' : ''}"></span>`).join('')}</div><div class="worked-answer"><span>Shaded fraction</span><strong>${activity.fraction}</strong></div><ol class="worked-steps">${activity.steps.map(step => `<li>${step}</li>`).join('')}</ol>`;
    }
    if (activity.kind === 'array') {
      const dots = Array.from({ length: state.rows * state.columns }, () => '<span></span>').join('');
      return `<div class="array-controls"><div><span>Rows</span><button type="button" class="step-button" data-field="rows" data-change="-1" aria-label="Fewer rows">−</button><strong>${state.rows}</strong><button type="button" class="step-button" data-field="rows" data-change="1" aria-label="More rows">+</button></div><b aria-hidden="true">×</b><div><span>Columns</span><button type="button" class="step-button" data-field="columns" data-change="-1" aria-label="Fewer columns">−</button><strong>${state.columns}</strong><button type="button" class="step-button" data-field="columns" data-change="1" aria-label="More columns">+</button></div></div><div class="array-visual" style="--array-columns:${state.columns}" role="img" aria-label="Array with ${state.rows} rows and ${state.columns} columns">${dots}</div><p class="array-equation">${state.rows} rows × ${state.columns} columns</p><button class="button button-primary array-check" type="button" data-check-array="true">Check my array <span aria-hidden="true">✓</span></button>${feedback}`;
    }
    if (activity.kind === 'shape') {
      return `<div class="shape-choices">${activity.choices.map(shape => `<button class="shape-choice" type="button" data-choice="${shape}">${shapes[shape]}<span>${shape}</span></button>`).join('')}</div>${feedback}`;
    }
    if (activity.kind === 'sequence') {
      const planets = ['Neptune', 'Earth', 'Jupiter', 'Mercury', 'Uranus', 'Mars', 'Saturn', 'Venus'];
      return `<p class="sequence-progress">Planet ${Math.min(state.index + 1, activity.items.length)} of ${activity.items.length}</p><div class="sequence-track" aria-label="Planets placed in order">${activity.items.slice(0, state.index).map((planet, index) => `<span><i>${index + 1}</i>${planet}</span>`).join('')}${state.index < activity.items.length ? '<span class="sequence-next">Next planet…</span>' : ''}</div><div class="planet-choices">${planets.filter(planet => !activity.items.slice(0, state.index).includes(planet)).map(planet => `<button class="planet-choice ${planet.toLowerCase()}" type="button" data-choice="${planet}"><i aria-hidden="true"></i>${planet}</button>`).join('')}</div>${feedback}`;
    }
    if (activity.kind === 'category') {
      return `<div class="category-list">${activity.items.map((item, index) => {
        const selected = state.answers[item.name];
        const correct = selected === item.answer;
        return `<div class="category-item ${selected ? (correct ? 'is-correct' : 'is-wrong') : ''}"><strong>${item.name}</strong><div><button type="button" class="category-choice ${selected === 'Living' ? 'is-selected' : ''}" data-item="${index}" data-category="Living">Living</button><button type="button" class="category-choice ${selected === 'Non-living' ? 'is-selected' : ''}" data-item="${index}" data-category="Non-living">Non-living</button></div></div>`;
      }).join('')}</div>${feedback}`;
    }
    if (activity.kind === 'property') {
      const question = activity.questions[state.index];
      return `<p class="sequence-progress">Question ${state.index + 1} of ${activity.questions.length}</p><div class="property-question">${question.prompt}</div>${answers(question.choices)}${state.answered ? `<button class="button button-primary activity-next" type="button" data-next="true">${state.index === activity.questions.length - 1 ? 'Finish activity' : 'Next question'} <span aria-hidden="true">→</span></button>` : ''}${feedback}`;
    }
    return '<p>Activity could not be loaded.</p>';
  }

  function startActivity(activity, subject) {
    const host = document.getElementById('lesson-activity');
    const state = { rows: activity.startRows || activity.rows || 3, columns: activity.startColumns || activity.columns || 4, index: 0, answers: {}, answered: false, correctCount: 0, finished: false };
    const heading = activity.kind === 'worked-example' ? 'Worked example' : 'Try it yourself';
    host.innerHTML = `<div class="activity-card ${subject.theme}"><div class="activity-heading"><span class="activity-spark" aria-hidden="true">✦</span><div><p class="eyebrow">${heading}</p><h2>${activity.title}</h2></div></div><p class="activity-prompt" id="activity-prompt">${activity.prompt}</p><div class="activity-workspace" id="activity-workspace">${activityMarkup(activity, state)}</div></div>`;

    function feedback(message, kind) {
      const target = host.querySelector('#activity-feedback');
      if (target) {
        target.textContent = message;
        target.className = `activity-feedback ${kind || ''}`;
      }
    }

    function finish(message) {
      if (state.finished) return;
      state.finished = true;
      feedback(message, 'success');
      host.querySelector('.activity-card').classList.add('activity-done');
    }

    function redraw(message = '', kind = '') {
      host.querySelector('#activity-workspace').innerHTML = activityMarkup(activity, state);
      if (message) feedback(message, kind);
    }

    host.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || state.finished) return;

      if (button.dataset.field) {
        const field = button.dataset.field;
        state[field] = Math.max(1, Math.min(6, state[field] + Number(button.dataset.change)));
        redraw();
        return;
      }

      if (activity.kind === 'array' && button.dataset.checkArray) {
        const correct = state.rows === activity.rows && state.columns === activity.columns;
        if (correct) finish(activity.explanation);
        else feedback('Not quite yet. The goal is 3 rows with 4 dots in each row. Adjust the array and check again.', 'try-again');
        return;
      }

      if (activity.kind === 'category' && button.dataset.category) {
        const item = activity.items[Number(button.dataset.item)];
        state.answers[item.name] = button.dataset.category;
        const allCorrect = activity.items.every(entry => state.answers[entry.name] === entry.answer);
        const chosenRight = state.answers[item.name] === item.answer;
        redraw(chosenRight ? `Yes! ${item.name} belongs in the ${item.answer.toLowerCase()} group.` : `Have another look at ${item.name}. Does it grow or need food and water?`, chosenRight ? 'success' : 'try-again');
        if (allCorrect) finish('Great sorting! You correctly classified all six items.');
        return;
      }

      if (activity.kind === 'sequence' && button.dataset.choice) {
        const expected = activity.items[state.index];
        if (button.dataset.choice !== expected) {
          feedback(`Not quite. The next planet from the Sun is ${expected}. Try that one.`, 'try-again');
          return;
        }
        state.index += 1;
        if (state.index === activity.items.length) {
          redraw();
          finish('Excellent! You placed all eight planets in the right order.');
        } else {
          redraw(`That’s right! ${expected} is planet ${state.index}. Now find the next one.`, 'success');
        }
        return;
      }

      if (activity.kind === 'property' && button.dataset.next) {
        if (state.index === activity.questions.length - 1) {
          finish(`Activity complete! You got ${state.correctCount} of ${activity.questions.length} properties right on your first try.`);
        } else {
          state.index += 1;
          state.answered = false;
          redraw();
        }
        return;
      }

      if (!button.dataset.choice) return;
      const choice = button.dataset.choice;
      if (activity.kind === 'property') {
        if (state.answered) return;
        const question = activity.questions[state.index];
        const correct = choice === question.answer;
        state.answered = true;
        if (correct) state.correctCount += 1;
        redraw(correct ? question.explanation : `Good try. ${question.answer} is the matching property. ${question.explanation}`, correct ? 'success' : 'try-again');
        return;
      }

      const correctAnswer = choice === activity.answer;
      if (correctAnswer) finish(activity.explanation);
      else feedback('Not quite. Have another look at the picture and try again.', 'try-again');
    });
  }

  function renderLesson(lessonId) {
    const subject = subjectFor(lessonId);
    const lesson = window.LEARNSPHERE_LESSONS[lessonId];
    const lessonInfo = subject?.lessons.find(item => item.id === lessonId);
    if (!subject || !lesson || !lessonInfo) {
      document.getElementById('lesson-hero').innerHTML = '<div><p class="eyebrow">Lesson not found</p><h1>Choose a lesson to get started</h1><a class="button button-primary" href="subjects.html">Browse subjects</a></div>';
      document.getElementById('lesson-breadcrumbs').innerHTML = '<a href="index.html">Dashboard</a><span aria-hidden="true">›</span><a href="subjects.html">Subjects</a>';
      document.getElementById('objectives-title').hidden = true;
      document.querySelector('.objectives-card').hidden = true;
      document.querySelector('.lesson-content-grid').hidden = true;
      document.querySelector('.lesson-takeaway').hidden = true;
      document.querySelector('.lesson-finish').hidden = true;
      document.querySelector('.lesson-games').hidden = true;
      document.querySelector('.lesson-pagination').innerHTML = '<a class="button button-secondary" href="subjects.html">Back to subjects</a>';
      return;
    }

    const lessonIndex = subject.lessons.findIndex(item => item.id === lessonId);
    const progress = window.LearnSphereProgress.readProgress();
    const completed = progress.lessonsCompleted.includes(lessonId);
    const title = `${lessonInfo.title} · LearnSphere`;
    document.title = title;
    document.getElementById('lesson-breadcrumbs').innerHTML = `<a href="index.html">Dashboard</a><span aria-hidden="true">›</span><a href="lessons.html?subject=${subject.id}">${subject.name}</a><span aria-hidden="true">›</span><span aria-current="page">Lesson ${lessonIndex + 1}</span>`;
    const hero = document.getElementById('lesson-hero');
    hero.className = `lesson-hero ${subject.theme}`;
    hero.innerHTML = `<div class="lesson-hero-icon" aria-hidden="true">${lessonInfo.icon}</div><div class="lesson-hero-copy"><div class="lesson-kickers"><span class="lesson-subject-label">${subject.name}</span><span>LESSON ${lessonIndex + 1}</span>${completed ? '<span class="completed-label">✓ Completed</span>' : ''}</div><h1>${lessonInfo.title}</h1><p>${lesson.intro}</p></div><span class="lesson-time">◷ ${lessonInfo.minutes} min</span>`;
    document.getElementById('lesson-objectives').innerHTML = lesson.objectives.map(objective => `<li>${objective}</li>`).join('');
    renderText(lesson);
    startActivity(lesson.activity, subject);
    document.getElementById('lesson-takeaway').innerHTML = `<div class="takeaway-icon" aria-hidden="true">✦</div><div><p class="eyebrow">Keep in mind</p><h2 id="takeaway-title">Key takeaways</h2><ul>${lesson.takeaway.map(point => `<li>${point}</li>`).join('')}</ul></div>`;

    const completeButton = document.getElementById('complete-lesson');
    document.getElementById('lesson-quiz-link').href = `game.html?type=quiz&lesson=${lessonId}`;
    document.getElementById('lesson-matching-link').href = `game.html?type=matching&lesson=${lessonId}`;
    const heading = document.getElementById('completion-heading');
    const message = document.getElementById('completion-message');
    function showCompleted() {
      completeButton.innerHTML = 'Completed <span aria-hidden="true">✓</span>';
      completeButton.disabled = true;
      completeButton.classList.add('is-complete-button');
      heading.textContent = 'Nice work!';
      message.textContent = 'This lesson is saved in your learning progress.';
      hero.querySelector('.lesson-kickers').classList.add('has-completed');
      if (!hero.querySelector('.completed-label')) hero.querySelector('.lesson-kickers').insertAdjacentHTML('beforeend', '<span class="completed-label">✓ Completed</span>');
    }
    if (completed) showCompleted();
    completeButton.addEventListener('click', () => {
      window.LearnSphereProgress.completeLesson(lessonId);
      showCompleted();
    }, { once: true });

    const previous = subject.lessons[lessonIndex - 1];
    const next = subject.lessons[lessonIndex + 1];
    document.getElementById('lesson-pagination').innerHTML = `<a class="button button-secondary" href="${previous ? `lesson.html?id=${previous.id}` : `lessons.html?subject=${subject.id}`}"><span aria-hidden="true">←</span> ${previous ? 'Previous lesson' : `All ${subject.name} lessons`}</a>${next ? `<a class="button button-next" href="lesson.html?id=${next.id}">Next lesson <span aria-hidden="true">→</span></a>` : `<a class="button button-next" href="lessons.html?subject=${subject.id}">Back to ${subject.name} <span aria-hidden="true">→</span></a>`}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderLesson(new URLSearchParams(window.location.search).get('id'));
  });
})();
