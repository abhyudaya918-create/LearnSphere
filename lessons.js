(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const subject = window.LEARNSPHERE_SUBJECTS.find(item => item.id === params.get('subject'));
    const banner = document.getElementById('subject-banner');
    const grid = document.getElementById('lesson-grid');
    if (!subject) {
      banner.innerHTML = '<span class="subject-icon" aria-hidden="true">?</span><div><h1>Choose a subject</h1><p>Select Maths or Science to see its lessons.</p></div>';
      banner.className = 'subject-banner';
      grid.innerHTML = '<p class="empty-state">Go to <a class="text-link" href="subjects.html">Subjects</a> and pick a learning path.</p>';
      return;
    }
    document.title = `${subject.name} Lessons · LearnSphere`;
    document.getElementById('breadcrumb-subject').textContent = subject.name;
    const progress = window.LearnSphereProgress.readProgress();
    const completedCount = window.LearnSphereProgress.getSubjectProgress(subject.id)[0].completed;
    const percent = Math.round(completedCount / subject.lessons.length * 100);
    document.getElementById('lesson-count').textContent = `${completedCount} of ${subject.lessons.length} complete`;
    banner.className = `subject-banner ${subject.theme}`;
    banner.innerHTML = `<span class="subject-icon" aria-hidden="true">${subject.icon}</span><div class="subject-banner-copy"><p class="eyebrow">Your subject</p><h1>${subject.name}</h1><p>${subject.description}</p></div><div class="subject-banner-progress"><span>${completedCount} of ${subject.lessons.length} lessons complete</span><div class="progress-track" role="progressbar" aria-label="${subject.name} lesson progress" aria-valuemin="0" aria-valuemax="${subject.lessons.length}" aria-valuenow="${completedCount}"><span style="width:${percent}%"></span></div></div>`;
    grid.innerHTML = subject.lessons.map((lesson, index) => {
      const complete = progress.lessonsCompleted.includes(lesson.id);
      return `<article class="lesson-card ${subject.theme} ${complete ? 'is-complete' : ''}"><div class="lesson-card-top"><span class="lesson-illustration" aria-hidden="true">${lesson.icon}</span><span class="lesson-number">LESSON ${index + 1}</span></div><div class="lesson-status ${complete ? 'complete' : ''}"><span aria-hidden="true">${complete ? '✓' : '○'}</span> ${complete ? 'Completed' : 'Not started'}</div><h3>${lesson.title}</h3><p>${lesson.description}</p><div class="lesson-card-bottom"><span class="lesson-duration">◷ ${lesson.minutes} min</span><a class="button button-primary" href="lesson.html?id=${lesson.id}">${complete ? 'Review lesson' : 'Start lesson'} <span aria-hidden="true">→</span></a></div></article>`;
    }).join('');
  });
})();
