(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const host = document.getElementById('subject-catalog');
    if (!host) return;
    const subjectProgress = Object.fromEntries(window.LearnSphereProgress.getSubjectProgress().map(item => [item.id, item]));
    host.innerHTML = window.LEARNSPHERE_SUBJECTS.map(subject => {
      const { completed, percent } = subjectProgress[subject.id];
      return `
        <article class="subject-card ${subject.theme}">
          <div class="subject-card-head"><span class="subject-card-icon" aria-hidden="true">${subject.icon}</span><h2>${subject.name}</h2><span class="lesson-pill">${subject.lessons.length} lessons</span></div>
          <p class="subject-tagline">${subject.tagline}</p>
          <p class="subject-description">${subject.description}</p>
          <div class="subject-progress"><div class="subject-progress-copy"><span>Lesson progress</span><strong>${completed} of ${subject.lessons.length} complete</strong></div><div class="progress-track" role="progressbar" aria-label="${subject.name} lesson progress" aria-valuemin="0" aria-valuemax="${subject.lessons.length}" aria-valuenow="${completed}"><span style="width:${percent}%"></span></div></div>
          <div class="tag-list" aria-label="Topics">${subject.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
          <a class="button button-primary" href="lessons.html?subject=${subject.id}">Explore ${subject.name} <span aria-hidden="true">→</span></a>
        </article>`;
    }).join('');
  });
})();
