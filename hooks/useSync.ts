/**
 * Hook for data synchronization
 */

import { useState, useEffect, useCallback } from 'react';
import { performFullSync, getSyncStatus, SyncStatus } from '@/services/database/sync';
import { useOffline } from './useOffline';

export function useSync() {
  const { isOffline } = useOffline();
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

  const sync = useCallback(async () => {
    if (isOffline) {
      console.log('Device is offline, cannot sync');
      return;
    }

    setSyncing(true);
    try {
      await performFullSync();
      const status = await getSyncStatus();
      setSyncStatus(status);
      setLastSyncTime(status.lastSyncTime);
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  }, [isOffline]);

  useEffect(() => {
    // Load initial sync status
    getSyncStatus().then(setSyncStatus);
  }, []);

  return {
    syncing,
    syncStatus,
    lastSyncTime,
    sync,
    canSync: !isOffline,
  };
}

