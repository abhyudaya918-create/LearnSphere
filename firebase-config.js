// Replace these placeholder values with the Firebase Web app config from
// Firebase Console → Project settings → General → Your apps.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfWg4ZZhVOxbBh0YYAWhLQfpYXuz0NvwQ",
  authDomain: "learnsphere-pp.firebaseapp.com",
  projectId: "learnsphere-pp",
  storageBucket: "learnsphere-pp.firebasestorage.app",
  messagingSenderId: "9006555502",
  appId: "1:9006555502:web:019da97dacd6e093f4a17f",
  measurementId: "G-D2H9NFJM7F"
};

export const FIREBASE_SDK_VERSION = '13.4.0';

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId)
    && !Object.values(firebaseConfig).some(value => typeof value === 'string' && value.startsWith('YOUR_'));
}

export async function loadFirebaseModules() {
  if (!isFirebaseConfigured()) throw new Error('Firebase configuration is missing.');
  const base = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
  const [appSdk, authSdk] = await Promise.all([
    import(`${base}/firebase-app.js`),
    import(`${base}/firebase-auth.js`)
  ]);
  const app = appSdk.initializeApp(firebaseConfig);
  return { app, ...authSdk };
}
