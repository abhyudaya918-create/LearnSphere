(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const subjectSelect = document.getElementById('game-subject-select');
    const lessonSelect = document.getElementById('game-lesson-select');
    const params = new URLSearchParams(window.location.search);
    const initialLesson = params.get('lesson');
    const foundSubject = window.LEARNSPHERE_SUBJECTS.find(subject => subject.lessons.some(lesson => lesson.id === initialLesson));
    const requestedSubject = params.get('subject');
    const validSubject = window.LEARNSPHERE_SUBJECTS.some(subject => subject.id === requestedSubject);
    const initialSubject = foundSubject?.id || (validSubject ? requestedSubject : 'maths');

    subjectSelect.innerHTML = window.LEARNSPHERE_SUBJECTS.map(subject => `<option value="${subject.id}">${subject.name}</option>`).join('');
    subjectSelect.value = initialSubject;

    function lessonsForSubject() {
      return window.LEARNSPHERE_SUBJECTS.find(subject => subject.id === subjectSelect.value)?.lessons || [];
    }

    function refreshLessonOptions(preferredLesson) {
      const lessons = lessonsForSubject();
      lessonSelect.innerHTML = lessons.map(lesson => `<option value="${lesson.id}">${lesson.title}</option>`).join('');
      lessonSelect.value = lessons.some(lesson => lesson.id === preferredLesson) ? preferredLesson : lessons[0]?.id;
      updateGameLinks();
    }

    function updateGameLinks() {
      const lessonId = lessonSelect.value;
      const quiz = document.getElementById('choose-quiz');
      const matching = document.getElementById('choose-matching');
      quiz.href = `game.html?type=quiz&lesson=${lessonId}`;
      matching.href = `game.html?type=matching&lesson=${lessonId}`;
      const subject = window.LEARNSPHERE_SUBJECTS.find(item => item.lessons.some(lesson => lesson.id === lessonId));
      const lesson = subject?.lessons.find(item => item.id === lessonId);
      document.querySelector('.games-intro').className = `games-intro ${subject?.theme || ''}`;
      document.getElementById('game-context-title').textContent = lesson ? `What would you like to practise?` : 'Choose a lesson to practise';
      document.getElementById('game-context-title').setAttribute('aria-label', lesson ? `${subject.name}: ${lesson.title}` : 'Choose a lesson');
      document.querySelector('.games-intro > div > p:last-child').textContent = lesson ? `Choose a game for ${lesson.title}.` : 'Practise what you’ve learned with a quick game.';
      const fromLesson = Boolean(initialLesson && initialLesson === lessonId);
      const fromSubject = params.has('subject');
      document.getElementById('games-back-link').href = fromLesson ? `lesson.html?id=${lessonId}` : fromSubject ? `lessons.html?subject=${subject?.id || subjectSelect.value}` : 'index.html';
      document.getElementById('games-back-link').textContent = fromLesson ? '← Back to lesson' : fromSubject ? `← Back to ${subject?.name || 'subject'} lessons` : '← Back to dashboard';
    }

    refreshLessonOptions(initialLesson);
    subjectSelect.addEventListener('change', () => refreshLessonOptions());
    lessonSelect.addEventListener('change', updateGameLinks);
  });
})();
