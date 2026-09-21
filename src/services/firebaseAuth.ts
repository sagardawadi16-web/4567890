import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const standardProvider = new GoogleAuthProvider();
// Standard provider only uses openid, email, profile.
// CRITICAL: NEVER add 'https://www.googleapis.com/auth/drive' or 'drive.readonly' here,
// as Google classifies them as Restricted Scopes which triggers immediate "error in verification"
// and blocks users from signing in.

// In-memory cache for access token (never stored in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token?: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken || undefined);
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Standard customer & merchant Google Sign-In.
 * Uses standard scopes (profile, email, openid) so it never gets blocked by Google's app verification.
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken?: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, standardProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    return { user: result.user, accessToken: cachedAccessToken || undefined };
  } catch (error: unknown) {
    console.warn('Firebase popup sign-in notice (may be blocked in iframe):', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Explicit Google Sheets authorization for Admin functions (Syncing master sheet).
 * Requests ONLY 'https://www.googleapis.com/auth/spreadsheets'.
 * Does NOT request restricted Drive scopes, avoiding OAuth "error in verification".
 */
export const authorizeGoogleSheets = async (): Promise<string | null> => {
  try {
    const sheetsProvider = new GoogleAuthProvider();
    sheetsProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
    const result = await signInWithPopup(auth, sheetsProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
      return cachedAccessToken;
    }
    return null;
  } catch (error: unknown) {
    console.warn('Google Sheets OAuth authorization notice:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logout = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.error('Logout error:', err);
  }
  cachedAccessToken = null;
};
