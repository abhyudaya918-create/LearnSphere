// Shared header and dashboard renderers used by every page.
(function () {
  const navItems = [
    { href: 'index.html', label: 'Dashboard' },
    { href: 'subjects.html', label: 'Subjects' },
    { href: 'games.html', label: 'Games' }
  ];

  function currentPage() { return window.location.pathname.split('/').pop() || 'index.html'; }

  function renderHeader() {
    const host = document.getElementById('site-header');
    if (!host) return;
    const progress = window.LearnSphereProgress.readProgress();
    const level = window.LearnSphereProgress.levelFor(progress.totalXP);
    const page = currentPage();
    const active = ['games.html', 'game.html'].includes(page) ? 'games.html'
      : ['subjects.html', 'lessons.html', 'lesson.html'].includes(page) ? 'subjects.html'
        : page;
    host.innerHTML = `<header class="site-header"><div class="header-inner">
      <a class="brand" href="index.html" aria-label="LearnSphere dashboard"><span class="brand-mark" aria-hidden="true">✦</span><span>LearnSphere</span></a>
      <nav class="main-nav" aria-label="Main navigation">${navItems.map(item => `<a class="nav-link" href="${item.href}" ${active === item.href ? 'aria-current="page"' : ''}>${item.label}</a>`).join('')}</nav>
      <div class="header-profile"><span class="header-xp" aria-label="${progress.totalXP} experience points">✦ ${progress.totalXP} XP</span><span class="header-level">Lvl ${level.number}</span><div class="auth-controls" id="auth-controls"><span class="auth-header-loading" aria-label="Checking sign-in status"></span></div></div>
    </div></header>`;
    window.LearnSphereAuthUI?.renderHeaderAuth();
  }

  function renderDashboard() {
    if (!document.getElementById('achievement-grid')) return;
    const progress = window.LearnSphereProgress.readProgress();
    const level = window.LearnSphereProgress.levelFor(progress.totalXP);
    const levelLine = document.getElementById('level-name');
    levelLine.textContent = `Level ${level.number} ${level.name}`;
    document.getElementById('journey-xp').textContent = `${level.xpIntoLevel} XP`;
    document.getElementById('next-level-xp').textContent = `${level.nextLevelXP} XP`;
    document.getElementById('stat-streak').textContent = progress.streak;
    document.getElementById('stat-xp').textContent = progress.totalXP;
    document.getElementById('stat-games').textContent = progress.gamesPlayed;
    const overall = window.LearnSphereProgress.getOverallProgress();
    const overallCopy = document.getElementById('overall-progress');
    if (overallCopy) overallCopy.textContent = `${overall.completed} of ${overall.total} lessons complete · ${overall.percent}%`;
    window.LearnSphereProgress.getSubjectProgress().forEach(subject => {
      const subjectCopy = document.getElementById(`dashboard-${subject.id}-progress`);
      if (subjectCopy) subjectCopy.textContent = `${subject.completed} of ${subject.total} lessons complete`;
    });
    const achievements = window.LearnSphereProgress.getAchievements();
    const unlocked = achievements.filter(item => item.unlocked).length;
    document.getElementById('stat-badges').textContent = unlocked;
    document.getElementById('achievement-count').textContent = `${unlocked} of ${achievements.length} unlocked`;
    const percent = level.xpIntoLevel;
    const fill = document.getElementById('journey-progress');
    fill.style.width = `${percent}%`;
    fill.parentElement.setAttribute('aria-valuenow', String(percent));
    document.getElementById('journey-hint').textContent = progress.totalXP ? 'Great work! Keep learning to reach your next level.' : 'Your next adventure is just one lesson away.';
    document.getElementById('achievement-grid').innerHTML = achievements.map(item => {
      const isUnlocked = item.unlocked;
      const progressPercent = item.progressPercent;
      return `<article class="achievement-card ${isUnlocked ? 'is-unlocked' : ''}"><span class="achievement-icon" aria-hidden="true">${item.icon}</span><div><h3>${item.name}</h3><p>${item.description}</p><span class="achievement-count">${isUnlocked ? 'Unlocked' : `${item.value} / ${item.target}`}</span><div class="achievement-progress" aria-label="${progressPercent}% complete"><span style="width:${progressPercent}%"></span></div></div></article>`;
    }).join('');
  }

  function refresh() { renderHeader(); renderDashboard(); }
  document.addEventListener('DOMContentLoaded', refresh);
  window.addEventListener('learnsphere:progress', refresh);
  window.LearnSphereApp = { refresh };
})();
