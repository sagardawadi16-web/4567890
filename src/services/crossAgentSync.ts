import { CrossAgentSyncMessage, MaintenanceSettings, ThemeSettings, SiteContentConfig } from '../types';
import { publishGlobalStoreSync, listenToGlobalStoreSync } from './firestoreService';

const BROADCAST_CHANNEL_NAME = 'dawosti_multi_agent_bus';
const LOCAL_STORAGE_SYNC_KEY = 'dawosti_agent_sync_event';

// Generate random agent session ID for identification
export const CURRENT_AGENT_ID =
  typeof window !== 'undefined'
    ? `agent_${Math.random().toString(36).substring(2, 8)}`
    : 'agent_server';

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not supported or blocked, falling back to storage events');
  }
}

type SyncCallback = (message: CrossAgentSyncMessage) => void;
const subscribers: Set<SyncCallback> = new Set();

/**
 * Subscribe to multi-agent real-time sync events
 */
export const subscribeToCrossAgentSync = (callback: SyncCallback) => {
  subscribers.add(callback);

  // Cross-Tab BroadcastChannel listener
  const handleMessage = (event: MessageEvent) => {
    if (event.data && typeof event.data === 'object') {
      const msg = event.data as CrossAgentSyncMessage;
      if (msg.senderId !== CURRENT_AGENT_ID) {
        callback(msg);
      }
    }
  };

  // Cross-Tab LocalStorage event fallback
  const handleStorage = (event: StorageEvent) => {
    if (event.key === LOCAL_STORAGE_SYNC_KEY && event.newValue) {
      try {
        const msg = JSON.parse(event.newValue) as CrossAgentSyncMessage;
        if (msg.senderId !== CURRENT_AGENT_ID) {
          callback(msg);
        }
      } catch (e) {
        // ignore parse error
      }
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleMessage);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  // Cross-Device Firestore real-time listener
  const unsubscribeFirestore = listenToGlobalStoreSync((firestoreData) => {
    if (firestoreData.lastUpdatedBy && firestoreData.lastUpdatedBy !== CURRENT_AGENT_ID) {
      if (firestoreData.maintenance) {
        callback({
          type: 'MAINTENANCE_CHANGE',
          senderId: firestoreData.lastUpdatedBy,
          senderRole: 'head_admin',
          timestamp: Date.now(),
          data: firestoreData.maintenance,
        });
      }
      if (firestoreData.themeSettings || firestoreData.siteContent) {
        callback({
          type: 'SETTINGS_CHANGE',
          senderId: firestoreData.lastUpdatedBy,
          senderRole: 'head_admin',
          timestamp: Date.now(),
          data: {
            themeSettings: firestoreData.themeSettings,
            siteContent: firestoreData.siteContent,
          },
        });
      }
      if (firestoreData.forceReloadTrigger) {
        callback({
          type: 'FORCE_RELOAD',
          senderId: firestoreData.lastUpdatedBy,
          senderRole: 'head_admin',
          timestamp: firestoreData.forceReloadTrigger,
        });
      }
    }
  });

  return () => {
    subscribers.delete(callback);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleMessage);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
    if (typeof unsubscribeFirestore === 'function') {
      unsubscribeFirestore();
    }
  };
};

/**
 * Broadcast an update from this agent to all other agents & customers
 */
export const broadcastAgentUpdate = (
  type: CrossAgentSyncMessage['type'],
  data?: any,
  senderRole: CrossAgentSyncMessage['senderRole'] = 'head_admin'
) => {
  const message: CrossAgentSyncMessage = {
    type,
    senderId: CURRENT_AGENT_ID,
    senderRole,
    timestamp: Date.now(),
    data,
  };

  // 1. Post to local BroadcastChannel (instant for other tabs on same machine)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(message);
    } catch (e) {
      console.warn('BroadcastChannel post error', e);
    }
  }

  // 2. Write to localStorage to trigger 'storage' event in other tabs
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_SYNC_KEY, JSON.stringify(message));
    } catch (e) {
      // ignore
    }
  }

  // 3. Publish to Firestore cloud database for cross-device agents
  if (type === 'MAINTENANCE_CHANGE' && data) {
    publishGlobalStoreSync({
      maintenance: data as MaintenanceSettings,
      lastUpdatedBy: CURRENT_AGENT_ID,
      version: Date.now(),
    });
  } else if (type === 'SETTINGS_CHANGE' && data) {
    publishGlobalStoreSync({
      themeSettings: data.themeSettings,
      siteContent: data.siteContent,
      lastUpdatedBy: CURRENT_AGENT_ID,
      version: Date.now(),
    });
  } else if (type === 'FORCE_RELOAD') {
    publishGlobalStoreSync({
      forceReloadTrigger: Date.now(),
      lastUpdatedBy: CURRENT_AGENT_ID,
      version: Date.now(),
    });
  }
};
