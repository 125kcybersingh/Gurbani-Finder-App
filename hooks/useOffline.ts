/**
 * Hook for offline detection
 */

import { useState, useEffect } from 'react';
import { isOnline } from '@/services/database/sync';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(!isOnline());

  useEffect(() => {
    // TODO: Use @react-native-community/netinfo for actual network detection
    // For now, use the sync service's isOnline function
    const checkOnline = () => {
      setIsOffline(!isOnline());
    };

    // Check periodically
    const interval = setInterval(checkOnline, 5000);
    checkOnline();

    return () => clearInterval(interval);
  }, []);

  return {
    isOffline,
    isOnline: !isOffline,
  };
}

