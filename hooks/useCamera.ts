/**
 * Hook for camera permissions and control
 */

import { useState, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';

export function useCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (permission?.granted) {
      setIsReady(true);
    }
  }, [permission]);

  const requestCameraPermission = async () => {
    const result = await requestPermission();
    return result.granted;
  };

  return {
    permission,
    isReady,
    hasPermission: permission?.granted ?? false,
    requestPermission: requestCameraPermission,
  };
}

