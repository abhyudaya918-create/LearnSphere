import {
  createEmailAccount, getAuthState, sendPasswordReset, signInWithEmail,
  signInWithGoogle, signOutUser, subscribeAuth, updateFirebaseDisplayName
} from './auth.js';

let authState = getAuthState();
let authFlowActive = false;
let successRedirectTimer = null;
let logoutInProgress = false;

function escapeHTML(value) {
  return String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function safeReturnTo(value) {
  const fallback = 'account.html';
  if (!value) return fallback;
  try {
    const url = new URL(value, window.location.origin);
    const allowed = ['index.html', 'subjects.html', 'lessons.html', 'lesson.html', 'games.html', 'game.html', 'account.html'];
    const page = url.pathname.split('/').pop();
    if (url.origin !== window.location.origin || !allowed.includes(page)) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch (error) { return fallback; }
}

function currentReturnTo() {
  return safeReturnTo(new URLSearchParams(window.location.search).get('returnTo'));
}

function updateProfileIdentity(user) {
  const avatar = document.getElementById('profile-avatar');
  const meta = document.getElementById('profile-auth-meta');
  if (meta) {
    if (user?.email) {
      meta.textContent = user.email;
      meta.hidden = false;
    } else {
      meta.textContent = '';
      meta.hidden = true;
    }
  }
  if (!avatar) return;
  avatar.replaceChildren();
  if (user?.photoURL) {
    const image = document.createElement('img');
    image.src = user.photoURL;
    image.alt = '';
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => { avatar.textContent = (window.LearnSphereProgress.readProgress().learnerName || 'L').slice(0, 1).toUpperCase(); }, { once: true });
    avatar.append(image);
    avatar.classList.add('has-photo');
  } else {
    avatar.classList.remove('has-photo');
    avatar.textContent = (window.LearnSphereProgress.readProgress().learnerName || 'L').trim().slice(0, 1).toUpperCase();
  }
}

function renderHeaderAuth() {
  const host = document.getElementById('auth-controls');
  if (!host) return;
  if (authState.status === 'loading') {
    host.innerHTML = '<span class="auth-header-loading" aria-label="Checking sign-in status"></span>';
    return;
  }
  if (authState.status === 'signed-in' && authState.user) {
    const progress = window.LearnSphereProgress.readProgress();
    const name = progress.learnerName && progress.learnerName !== 'Learner' ? progress.learnerName : authState.user.displayName || 'Learner';
    const current = window.location.pathname.split('/').pop() === 'account.html' ? 'aria-current="page"' : '';
    host.innerHTML = `<a class="auth-user-link" href="account.html" aria-label="Profile for ${escapeHTML(name)}" ${current}>${escapeHTML(name)}</a><button class="auth-header-logout" type="button" data-auth-logout>Log out</button>`;
  } else {
    host.innerHTML = '<a class="account-link" href="login.html">Log in</a><a class="auth-header-signup" href="signup.html">Sign up</a>';
  }
  updateProfileIdentity(authState.user);
}

function showMessage(text, kind = '') {
  const host = document.getElementById('auth-message');
  if (!host) return;
  host.textContent = text;
  host.className = `auth-message ${kind}`;
}

function setLoading(loading, label) {
  const form = document.getElementById('auth-form');
  const submit = document.getElementById('auth-submit');
  const google = document.getElementById('google-auth');
  const forgot = document.getElementById('forgot-password');
  if (form) form.querySelectorAll('input, button').forEach(item => { item.disabled = loading; });
  if (submit) {
    submit.disabled = loading;
    submit.classList.toggle('is-loading', loading);
    const text = submit.querySelector('.auth-submit-label');
    if (text) text.textContent = loading ? label || 'Please wait…' : (document.body.dataset.authMode === 'signup' ? 'Create account' : 'Log in');
  }
  if (google) google.disabled = loading;
  if (forgot) forgot.disabled = loading;
}

function setUnavailable(label) {
  const form = document.getElementById('auth-form');
  const submit = document.getElementById('auth-submit');
  const google = document.getElementById('google-auth');
  if (form) form.querySelectorAll('input, button').forEach(item => { item.disabled = true; });
  if (submit) {
    submit.disabled = true;
    submit.classList.remove('is-loading');
    const text = submit.querySelector('.auth-submit-label');
    if (text) text.textContent = label;
  }
  if (google) google.disabled = true;
}

function explainError(error) {
  const code = error?.code || '';
  const messages = {
    'auth/invalid-email': 'That email address does not look right. Check it and try again.',
    'auth/email-already-in-use': 'There is already a LearnSphere profile with that email. Try logging in instead.',
    'auth/weak-password': 'Choose a password with at least 6 characters.',
    'auth/invalid-credential': 'The email or password did not match. Check your details and try again.',
    'auth/user-not-found': 'The email or password did not match. Check your details and try again.',
    'auth/wrong-password': 'The email or password did not match. Check your details and try again.',
    'auth/too-many-requests': 'There have been too many tries. Wait a little and try again.',
    'auth/network-request-failed': 'Could not connect. Check your internet connection and try again.',
    'auth/popup-closed-by-user': 'The Google sign-in window was closed before finishing.',
    'auth/cancelled-popup-request': 'The Google sign-in window was cancelled. Try again when you are ready.',
    'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow pop-ups for this site and try again.',
    'auth/unauthorized-domain': 'This website address is not enabled in Firebase yet. Add localhost or your site domain in Firebase Authentication settings.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase Authentication yet.',
    'auth/account-exists-with-different-credential': 'An account with this email uses a different sign-in method. Try logging in with that method.'
  };
  if (code && messages[code]) return messages[code];
  if (!authState.configured) return 'Firebase is not configured yet. Add your Firebase web app settings in js/firebase-config.js.';
  return 'Something went wrong while signing in. Please try again.';
}

function returnAfterLogin() {
  const target = currentReturnTo();
  clearTimeout(successRedirectTimer);
  successRedirectTimer = setTimeout(() => { window.location.replace(target); }, 650);
}

async function finishSignIn(user) {
  await window.LearnSphereProgress.activateUser(user.uid, user.displayName || '');
  window.dispatchEvent(new CustomEvent('learnsphere:auth-ready', { detail: { user } }));
  renderHeaderAuth();
}

async function submitAuthForm(event) {
  event.preventDefault();
  const mode = document.body.dataset.authMode;
  const form = event.currentTarget;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const nickname = document.getElementById('auth-nickname')?.value.trim().replace(/\s+/g, ' ').slice(0, 24) || '';
  if (mode === 'signup' && password !== document.getElementById('auth-confirm-password').value) {
    showMessage('Those passwords do not match. Check them and try again.', 'is-error');
    return;
  }
  authFlowActive = true;
  showMessage('');
  setLoading(true, mode === 'signup' ? 'Creating your profile…' : 'Logging in…');
  try {
    const user = mode === 'signup' ? await createEmailAccount(email, password) : await signInWithEmail(email, password);
    if (mode === 'signup' && nickname) {
      window.LearnSphereProgress.setLearnerName(nickname);
      try { await updateFirebaseDisplayName(user, nickname); } catch (error) { /* The local LearnSphere nickname is still saved. */ }
    }
    await finishSignIn(user);
    authFlowActive = false;
    showMessage(mode === 'signup' ? 'Your profile is ready. Taking you there now…' : 'You are logged in. Taking you back now…', 'is-success');
    returnAfterLogin();
  } catch (error) {
    authFlowActive = false;
    setLoading(false);
    showMessage(explainError(error), 'is-error');
  }
}

async function handleGoogleSignIn() {
  authFlowActive = true;
  showMessage('');
  setLoading(true, 'Connecting to Google…');
  try {
    const user = await signInWithGoogle();
    await finishSignIn(user);
    authFlowActive = false;
    showMessage('You are signed in. Taking you back now…', 'is-success');
    returnAfterLogin();
  } catch (error) {
    authFlowActive = false;
    setLoading(false);
    showMessage(explainError(error), 'is-error');
  }
}

async function handlePasswordReset() {
  const email = document.getElementById('auth-email')?.value.trim();
  if (!email) {
    showMessage('Enter your email address above, then choose “Forgot password?”', 'is-error');
    document.getElementById('auth-email')?.focus();
    return;
  }
  setLoading(true, 'Sending reset email…');
  showMessage('');
  try {
    await sendPasswordReset(email);
    showMessage('If an account uses that email, a password reset link is on its way.', 'is-success');
  } catch (error) {
    showMessage(explainError(error), 'is-error');
  } finally { setLoading(false); }
}

function setupAuthPage() {
  const form = document.getElementById('auth-form');
  if (!form) return;
  const returnTo = new URLSearchParams(window.location.search).get('returnTo');
  const switchLink = document.getElementById('auth-switch-link');
  if (switchLink && returnTo) switchLink.href += `?returnTo=${encodeURIComponent(safeReturnTo(returnTo))}`;
  form.addEventListener('submit', submitAuthForm);
  document.getElementById('google-auth')?.addEventListener('click', handleGoogleSignIn);
  document.getElementById('forgot-password')?.addEventListener('click', handlePasswordReset);
  document.querySelectorAll('[data-toggle-password]').forEach(button => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.togglePassword);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.textContent = show ? 'Hide' : 'Show';
      button.setAttribute('aria-label', `${show ? 'Hide' : 'Show'} password`);
    });
  });
}

async function handleAuthState(next) {
  authState = next;
  if (next.status === 'loading') {
    if (document.body.dataset.authMode) {
      showMessage('Connecting securely…');
      setLoading(true, 'Connecting…');
    }
    return;
  }
  if (next.status === 'signed-in' && next.user) {
    await window.LearnSphereProgress.activateUser(next.user.uid, next.user.displayName || '');
  } else {
    window.LearnSphereProgress.activateGuest();
  }
  renderHeaderAuth();
  window.dispatchEvent(new CustomEvent('learnsphere:auth-ready', { detail: next }));
  document.body.classList.remove('auth-initializing');

  if (document.body.dataset.authRequired === 'true') {
    if (next.status === 'signed-in') document.body.classList.add('auth-authorized');
    else if (next.status === 'signed-out' || next.status === 'error') {
      const login = new URL('login.html', window.location.href);
      login.searchParams.set('returnTo', 'account.html');
      if (next.status === 'error') login.searchParams.set('authError', 'unavailable');
      window.location.replace(login.href);
    }
  }

  if (next.status === 'signed-in' && document.body.dataset.authMode && !authFlowActive && !successRedirectTimer) {
    window.location.replace(currentReturnTo());
  }
  if (next.status === 'signed-out' && document.body.dataset.authMode && next.configured) {
    showMessage('');
    setLoading(false);
  }
  if (next.status === 'signed-out' && document.body.dataset.authMode && !next.configured) {
    showMessage('Firebase setup is needed before sign-in can work. See the setup steps in README.md.', 'is-error');
    setUnavailable('Setup needed');
  } else if (next.status === 'error' && document.body.dataset.authMode) {
    showMessage('Could not connect to Firebase. Check the config and internet connection, then reload.', 'is-error');
    setUnavailable('Unavailable');
  }
}

function setupHeaderLogout() {
  document.getElementById('site-header')?.addEventListener('click', async event => {
    const button = event.target.closest('[data-auth-logout]');
    if (!button || logoutInProgress) return;
    logoutInProgress = true;
    button.disabled = true;
    button.textContent = 'Logging out…';
    try {
      await signOutUser();
      window.location.replace('index.html');
    } catch (error) {
      logoutInProgress = false;
      button.disabled = false;
      button.textContent = 'Try again';
      button.title = 'Could not log out right now. Select to try again.';
    }
  });
}

window.LearnSphereAuthUI = { renderHeaderAuth };
document.body.classList.add('auth-initializing');
function initializeAuthUI() {
  setupAuthPage();
  setupHeaderLogout();
  subscribeAuth(handleAuthState);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeAuthUI, { once: true });
else initializeAuthUI();
