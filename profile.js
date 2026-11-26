// Profile details are rendered from the same saved progress record as the dashboard.
(function () {
  const progressApi = () => window.LearnSphereProgress;

  function initials(name) {
    const words = String(name || 'Learner').trim().split(/\s+/).filter(Boolean);
    return words.slice(0, 2).map(word => word[0].toUpperCase()).join('') || 'L';
  }

  function dateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function renderSubjects(progress) {
    const host = document.getElementById('profile-subject-list');
    const data = progressApi().getSubjectProgress();
    host.innerHTML = data.map(item => {
      const subject = window.LEARNSPHERE_SUBJECTS.find(entry => entry.id === item.id);
      const lessonRows = subject.lessons.map((lesson, index) => {
        const complete = progress.lessonsCompleted.includes(lesson.id);
        return `<span class="profile-lesson-chip ${complete ? 'is-complete' : ''}"><i aria-hidden="true">${complete ? '✓' : String(index + 1).padStart(2, '0')}</i>${lesson.title.split(':')[0]}</span>`;
      }).join('');
      return `<article class="profile-subject-card ${subject.theme}">
        <div class="profile-subject-top"><span class="profile-subject-icon" aria-hidden="true">${subject.icon}</span><div><h3>${subject.name}</h3><p>${item.completed} of ${item.total} lessons complete</p></div><span class="profile-subject-percent">${item.percent}%</span></div>
        <div class="progress-track profile-subject-track" role="progressbar" aria-label="${subject.name} progress" aria-valuemin="0" aria-valuemax="${item.total}" aria-valuenow="${item.completed}"><span style="width:${item.percent}%"></span></div>
        <div class="profile-lesson-chips">${lessonRows}</div>
        <a href="lessons.html?subject=${subject.id}" class="profile-subject-link">${item.completed === item.total ? 'Review lessons' : 'Continue learning'} <span aria-hidden="true">→</span></a>
      </article>`;
    }).join('');
  }

  function renderAchievements() {
    const list = progressApi().getAchievements();
    const unlocked = list.filter(item => item.unlocked);
    document.getElementById('profile-achievement-summary').textContent = `${unlocked.length} of ${list.length} unlocked`;
    const host = document.getElementById('profile-achievement-list');
    if (!unlocked.length) {
      host.innerHTML = '<div class="profile-empty-achievements"><span aria-hidden="true">✧</span><p>Your first badge is waiting. Complete a lesson or game to earn one!</p></div>';
      return;
    }
    host.innerHTML = unlocked.slice(-4).reverse().map(item => `<article class="profile-badge-card"><span class="profile-badge-icon" aria-hidden="true">${item.icon}</span><span><strong>${item.name}</strong><small>${item.description}</small></span><span class="profile-badge-check" aria-label="Unlocked">✓</span></article>`).join('');
  }

  function renderActivity(progress) {
    const host = document.getElementById('activity-week');
    const days = [];
    const today = new Date();
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
      const key = dateKey(date);
      days.push({ key, label: date.toLocaleDateString(undefined, { weekday: 'short' }), number: date.getDate(), active: progress.activityDates.includes(key), today: offset === 0 });
    }
    host.innerHTML = days.map(day => `<div class="activity-day ${day.active ? 'is-active' : ''} ${day.today ? 'is-today' : ''}" aria-label="${day.label}, ${day.number}${day.active ? ', learning day' : ', no activity recorded'}"><span>${day.label}</span><i>${day.active ? '✓' : day.number}</i></div>`).join('');
    const count = days.filter(day => day.active).length;
    document.getElementById('activity-days-count').textContent = `${count} of 7 days`;
    document.getElementById('activity-summary').textContent = progress.streak ? `${progress.streak} ${progress.streak === 1 ? 'day' : 'days'} in a row — keep it going!` : 'A little learning today starts your streak.';
    document.getElementById('profile-longest-streak').textContent = `${progress.longestStreak} ${progress.longestStreak === 1 ? 'day' : 'days'}`;
  }

  function render() {
    const progress = progressApi().readProgress();
    const overall = progressApi().getOverallProgress();
    const level = progressApi().levelFor(progress.totalXP);
    const name = progress.learnerName || 'Learner';
    document.getElementById('profile-title').textContent = `Hello, ${name}!`;
    const avatar = document.getElementById('profile-avatar');
    if (!avatar.classList.contains('has-photo')) avatar.textContent = initials(name);
    document.getElementById('profile-level').textContent = `Level ${level.number} · ${level.name}`;
    document.getElementById('profile-xp').textContent = progress.totalXP.toLocaleString();
    document.getElementById('profile-lessons').textContent = `${overall.completed} / ${overall.total}`;
    document.getElementById('profile-streak').textContent = `${progress.streak} ${progress.streak === 1 ? 'day' : 'days'}`;
    document.getElementById('profile-badges').textContent = `${progressApi().getAchievements().filter(item => item.unlocked).length} / ${window.LEARNSPHERE_ACHIEVEMENTS.length}`;
    document.getElementById('display-name-input').value = name;
    renderSubjects(progress);
    renderAchievements();
    renderActivity(progress);
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    document.getElementById('display-name-form').addEventListener('submit', event => {
      event.preventDefault();
      const input = document.getElementById('display-name-input');
      const result = progressApi().setLearnerName(input.value);
      const message = document.getElementById('profile-save-message');
      if (!result.saved) {
        message.textContent = 'Add a nickname before saving.';
        input.focus();
        return;
      }
      message.textContent = 'Nickname saved on this device.';
      render();
      document.getElementById('profile-save-message').textContent = 'Nickname saved on this device.';
    });
  });
})();
