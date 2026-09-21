import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  DocumentData,
  Unsubscribe,
} from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import firebaseConfig from '../../firebase-applet-config.json';
import { CartItem, MaintenanceSettings, ThemeSettings, SiteContentConfig, Product, Order } from '../types';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Collection / Document references
const SETTINGS_COLLECTION = 'store_settings';
const GLOBAL_DOC = 'global';
const USERS_COLLECTION = 'users';

/**
 * Persist authenticated user's cart items into Firestore
 */
export const saveUserCartToFirestore = async (userId: string, cartItems: CartItem[]): Promise<boolean> => {
  if (!userId) return false;
  try {
    const userCartDocRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(
      userCartDocRef,
      {
        cart: cartItems,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.warn('Could not save user cart to Firestore (using local storage fallback):', error);
    return false;
  }
};

/**
 * Retrieve authenticated user's cart items from Firestore
 */
export const getUserCartFromFirestore = async (userId: string): Promise<CartItem[] | null> => {
  if (!userId) return null;
  try {
    const userCartDocRef = doc(db, USERS_COLLECTION, userId);
    const snap = await getDoc(userCartDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.cart)) {
        return data.cart as CartItem[];
      }
    }
    return null;
  } catch (error) {
    console.warn('Could not retrieve user cart from Firestore:', error);
    return null;
  }
};

/**
 * Global Admin & Maintenance state sync interface
 */
export interface GlobalStoreSyncData {
  maintenance: MaintenanceSettings;
  themeSettings?: ThemeSettings;
  siteContent?: SiteContentConfig;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  version: number;
  forceReloadTrigger?: number;
}

/**
 * Listen to real-time changes from Firestore across all connected agents and clients
 */
export const listenToGlobalStoreSync = (
  onUpdate: (data: Partial<GlobalStoreSyncData>) => void
): Unsubscribe => {
  try {
    const globalDocRef = doc(db, SETTINGS_COLLECTION, GLOBAL_DOC);
    return onSnapshot(
      globalDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as GlobalStoreSyncData;
          onUpdate(data);
        }
      },
      (error) => {
        console.warn('Firestore real-time sync listener warning (fallback to broadcast):', error);
      }
    );
  } catch (error) {
    console.warn('Failed to attach Firestore snapshot listener:', error);
    return () => {};
  }
};

/**
 * Publish global changes (maintenance, theme, content) to Firestore for all agents
 */
export const publishGlobalStoreSync = async (
  payload: Partial<GlobalStoreSyncData>
): Promise<boolean> => {
  try {
    const globalDocRef = doc(db, SETTINGS_COLLECTION, GLOBAL_DOC);
    await setDoc(
      globalDocRef,
      {
        ...payload,
        lastUpdatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.warn('Firestore publish notice (broadcast channel will handle local tabs):', error);
    return false;
  }
};

/**
 * Persist email subscribers to Firestore
 */
export const saveSubscriberToFirestore = async (subscriber: any): Promise<boolean> => {
  try {
    const subDocRef = doc(db, 'email_subscribers', subscriber.id);
    await setDoc(subDocRef, subscriber, { merge: true });
    return true;
  } catch (error) {
    console.warn('Firestore subscriber save warning (saved locally):', error);
    return false;
  }
};

/**
 * Persist email campaign records to Firestore
 */
export const saveCampaignToFirestore = async (campaign: any): Promise<boolean> => {
  try {
    const campDocRef = doc(db, 'email_campaigns', campaign.id);
    await setDoc(campDocRef, campaign, { merge: true });
    return true;
  } catch (error) {
    console.warn('Firestore campaign save warning (saved locally):', error);
    return false;
  }
};

