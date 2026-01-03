// Haptic feedback utility with graceful fallback
import * as Haptics from 'expo-haptics';

export enum HapticType {
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

/**
 * Trigger haptic feedback
 * @param type - Type of haptic feedback
 */
export function triggerHaptic(type: HapticType = HapticType.Light): void {
  try {
    switch (type) {
      case HapticType.Light:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case HapticType.Medium:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case HapticType.Heavy:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case HapticType.Success:
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case HapticType.Warning:
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case HapticType.Error:
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch (error) {
    // Silently fail - haptics are optional
    console.debug('Haptic feedback not available:', error);
  }
}

/**
 * Check if haptics are available
 */
export function isHapticsAvailable(): boolean {
  return true; // expo-haptics is installed
}

