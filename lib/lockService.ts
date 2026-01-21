export interface Lock {
  rowId: string;
  lockedBy: string;
  lockedAt: Date;
}

export interface LockAcquireResult {
  success: boolean;
  error?: string;
  lockedBy?: string;
  lockedAt?: Date;
}

/**
 * Service for managing database-level row locks
 */
export class LockService {
  /**
   * Acquire a lock on a row
   * @param tableName - The table name (e.g., 'products')
   * @param rowId - The row ID to lock
   * @param userId - The user requesting the lock
   * @returns Lock acquisition result
   */
  static async acquireLock(
    tableName: string,
    rowId: string,
    userId: string
  ): Promise<LockAcquireResult> {
    try {
      const response = await fetch('/api/locks/acquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName, rowId, userId })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to acquire lock',
          lockedBy: data.lockedBy
        };
      }

      return {
        success: true,
        lockedBy: data.lockedBy,
        lockedAt: new Date(data.lockedAt)
      };
    } catch (error: any) {
      console.error('Lock acquisition error:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }

  /**
   * Release a lock on a row
   * @param tableName - The table name
   * @param rowId - The row ID to unlock
   * @param userId - The user releasing the lock
   * @returns True if released successfully
   */
  static async releaseLock(
    tableName: string,
    rowId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/locks/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName, rowId, userId })
      });

      if (!response.ok) {
        console.error('Failed to release lock:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('Lock release error:', error);
      return false;
    }
  }

  /**
   * Check if a specific row is locked
   * @param tableName - The table name
   * @param rowId - The row ID to check
   * @returns Lock information if locked, null otherwise
   */
  static async checkLock(tableName: string, rowId: string): Promise<Lock | null> {
    try {
      const response = await fetch(
        `/api/locks/check?tableName=${encodeURIComponent(tableName)}&rowId=${encodeURIComponent(rowId)}`
      );

      if (!response.ok) {
        console.error('Failed to check lock:', await response.text());
        return null;
      }

      const data = await response.json();
      return data.locked ? data.lock : null;
    } catch (error) {
      console.error('Lock check error:', error);
      return null;
    }
  }

  /**
   * Get all locks for a table
   * @param tableName - The table name
   * @returns Array of active locks
   */
  static async getTableLocks(tableName: string): Promise<Lock[]> {
    try {
      const response = await fetch(
        `/api/locks/check?tableName=${encodeURIComponent(tableName)}`
      );

      if (!response.ok) {
        console.error('Failed to get table locks:', await response.text());
        return [];
      }

      const data = await response.json();
      return data.locks || [];
    } catch (error) {
      console.error('Get table locks error:', error);
      return [];
    }
  }

  /**
   * Refresh a lock to keep it alive (updates timestamp)
   * @param tableName - The table name
   * @param rowId - The row ID
   * @param userId - The user refreshing the lock
   * @returns True if refreshed successfully
   */
  static async refreshLock(
    tableName: string,
    rowId: string,
    userId: string
  ): Promise<boolean> {
    // Re-acquiring the lock refreshes the timestamp
    const result = await this.acquireLock(tableName, rowId, userId);
    return result.success;
  }

  /**
   * Trigger cleanup of stale locks (usually called by cron)
   * @returns Number of locks cleaned up
   */
  static async cleanupStaleLocks(): Promise<number> {
    try {
      const response = await fetch('/api/locks/cleanup', {
        method: 'POST'
      });

      if (!response.ok) {
        console.error('Failed to cleanup locks:', await response.text());
        return 0;
      }

      const data = await response.json();
      return data.cleanedLocks || 0;
    } catch (error) {
      console.error('Cleanup locks error:', error);
      return 0;
    }
  }
}
