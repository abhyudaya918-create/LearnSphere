import { isFirebaseConfigured, loadFirebaseModules } from './firebase-config.js';

let sdk = null;
let auth = null;
let initPromise = null;
let firstAuthState = null;
const authListeners = new Set();
let state = { status: 'loading', user: null, configured: isFirebaseConfigured(), error: null };

function publish(next) {
  state = next;
  authListeners.forEach(listener => listener(state));
  window.dispatchEvent(new CustomEvent('learnsphere:auth-state', { detail: state }));
}

export function getAuthState() { return state; }

export function subscribeAuth(listener) {
  authListeners.add(listener);
  listener(state);
  startAuth();
  return () => authListeners.delete(listener);
}

export function startAuth() {
  if (initPromise) return initPromise;
  if (!isFirebaseConfigured()) {
    publish({ status: 'signed-out', user: null, configured: false, error: null });
    initPromise = Promise.resolve(state);
    return initPromise;
  }
  initPromise = (async () => {
    try {
      sdk = await loadFirebaseModules();
      auth = sdk.getAuth(sdk.app);
      await sdk.setPersistence(auth, sdk.browserLocalPersistence);
      await new Promise((resolve, reject) => {
        let first = true;
        sdk.onAuthStateChanged(auth, user => {
          const next = { status: user ? 'signed-in' : 'signed-out', user, configured: true, error: null };
          publish(next);
          if (first) { first = false; firstAuthState = next; resolve(next); }
        }, error => {
          publish({ status: 'error', user: null, configured: true, error });
          if (first) { first = false; reject(error); }
        });
      });
      return firstAuthState || state;
    } catch (error) {
      publish({ status: 'error', user: null, configured: true, error });
      return state;
    }
  })();
  return initPromise;
}

async function readyAuth() {
  const result = await startAuth();
  if (!auth || !sdk || result.status === 'error') throw result.error || new Error('Firebase Authentication is not available.');
  return { auth, sdk };
}

export async function createEmailAccount(email, password) {
  const { auth: client, sdk: firebase } = await readyAuth();
  const credential = await firebase.createUserWithEmailAndPassword(client, email, password);
  return credential.user;
}

export async function signInWithEmail(email, password) {
  const { auth: client, sdk: firebase } = await readyAuth();
  const credential = await firebase.signInWithEmailAndPassword(client, email, password);
  return credential.user;
}

export function signInWithGoogle() {
  if (!auth || !sdk || state.status === 'error') return Promise.reject(state.error || new Error('Firebase Authentication is not ready yet.'));
  const provider = new sdk.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return sdk.signInWithPopup(auth, provider).then(credential => credential.user);
}

export async function updateFirebaseDisplayName(user, name) {
  if (!name) return;
  const { sdk: firebase } = await readyAuth();
  await firebase.updateProfile(user, { displayName: name });
}

export async function sendPasswordReset(email) {
  const { auth: client, sdk: firebase } = await readyAuth();
  await firebase.sendPasswordResetEmail(client, email);
}

export async function signOutUser() {
  const { auth: client, sdk: firebase } = await readyAuth();
  await firebase.signOut(client);
}
