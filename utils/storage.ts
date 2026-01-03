/**
 * AsyncStorage helper utilities
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store a value in AsyncStorage
 */
export async function storeData(key: string, value: any): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
}

/**
 * Retrieve a value from AsyncStorage
 */
export async function getData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
}

/**
 * Remove a value from AsyncStorage
 */
export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
}

/**
 * Clear all data from AsyncStorage
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
}

/**
 * Get all keys from AsyncStorage
 */
export async function getAllKeys(): Promise<string[]> {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting keys:', error);
    return [];
  }
}

