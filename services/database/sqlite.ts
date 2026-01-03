/**
 * Local SQLite database operations
 * Handles on-device database for offline functionality
 */

import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize SQLite database connection
 */
export async function initSQLite(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync('shabados.db');
    return db;
  } catch (error) {
    console.error('Failed to open SQLite database:', error);
    throw error;
  }
}

/**
 * Get SQLite database instance
 */
export function getDatabase(): SQLite.SQLiteDatabase | null {
  return db;
}

/**
 * Execute a query on the SQLite database
 */
export async function querySQLite<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const database = await initSQLite();
  const result = await database.getAllAsync<T>(sql, params);
  return result;
}

/**
 * Execute a single row query
 */
export async function querySQLiteOne<T = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const database = await initSQLite();
  const result = await database.getFirstAsync<T>(sql, params);
  return result;
}

/**
 * Check if database is initialized
 */
export function isDatabaseInitialized(): boolean {
  return db !== null;
}

