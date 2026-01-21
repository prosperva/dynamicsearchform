import { NextRequest, NextResponse } from 'next/server';

// Mock database - replace with your actual database
let mockLocks: Record<string, { lockedBy: string; lockedAt: Date }> = {};

const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tableName = searchParams.get('tableName');
    const rowId = searchParams.get('rowId');

    if (!tableName) {
      return NextResponse.json(
        { error: 'tableName parameter is required' },
        { status: 400 }
      );
    }

    const now = Date.now();

    if (rowId) {
      // Check specific row
      const lockKey = `${tableName}:${rowId}`;
      const lock = mockLocks[lockKey];

      if (!lock) {
        return NextResponse.json({
          locked: false,
          lock: null
        });
      }

      // Check if lock is stale
      const lockAge = now - new Date(lock.lockedAt).getTime();
      if (lockAge >= LOCK_TIMEOUT) {
        // Cleanup stale lock
        delete mockLocks[lockKey];
        return NextResponse.json({
          locked: false,
          lock: null
        });
      }

      return NextResponse.json({
        locked: true,
        lock: {
          rowId,
          lockedBy: lock.lockedBy,
          lockedAt: lock.lockedAt
        }
      });
    }

    // Get all locks for the table
    const tableLocks = Object.entries(mockLocks)
      .filter(([key]) => key.startsWith(`${tableName}:`))
      .map(([key, lock]) => {
        const rowId = key.split(':')[1];
        const lockAge = now - new Date(lock.lockedAt).getTime();

        // Filter out stale locks
        if (lockAge >= LOCK_TIMEOUT) {
          delete mockLocks[key];
          return null;
        }

        return {
          rowId,
          lockedBy: lock.lockedBy,
          lockedAt: lock.lockedAt
        };
      })
      .filter(lock => lock !== null);

    return NextResponse.json({
      locks: tableLocks
    });

  } catch (error: any) {
    console.error('Lock check error:', error);
    return NextResponse.json(
      { error: 'Failed to check lock', details: error.message },
      { status: 500 }
    );
  }
}
