import { NextRequest, NextResponse } from 'next/server';

// Mock database - replace with your actual database
let mockLocks: Record<string, { lockedBy: string; lockedAt: Date }> = {};

const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const { tableName, rowId, userId } = await request.json();

    if (!tableName || !rowId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: tableName, rowId, userId' },
        { status: 400 }
      );
    }

    const lockKey = `${tableName}:${rowId}`;
    const existingLock = mockLocks[lockKey];

    if (existingLock) {
      const lockAge = Date.now() - new Date(existingLock.lockedAt).getTime();

      // If user already has the lock, refresh it
      if (existingLock.lockedBy === userId) {
        mockLocks[lockKey] = {
          lockedBy: userId,
          lockedAt: new Date()
        };

        return NextResponse.json({
          success: true,
          message: 'Lock refreshed',
          lockedBy: userId,
          lockedAt: mockLocks[lockKey].lockedAt
        });
      }

      // If lock is still valid and owned by someone else
      if (lockAge < LOCK_TIMEOUT) {
        return NextResponse.json(
          {
            error: 'Row is locked by another user',
            lockedBy: existingLock.lockedBy,
            lockedAt: existingLock.lockedAt
          },
          { status: 423 } // 423 Locked
        );
      }

      // Lock is stale, will be replaced below
      console.log(`Replacing stale lock on ${lockKey} (was locked by ${existingLock.lockedBy})`);
    }

    // Acquire new lock
    mockLocks[lockKey] = {
      lockedBy: userId,
      lockedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      message: 'Lock acquired',
      lockedBy: userId,
      lockedAt: mockLocks[lockKey].lockedAt
    });

  } catch (error: any) {
    console.error('Lock acquisition error:', error);
    return NextResponse.json(
      { error: 'Failed to acquire lock', details: error.message },
      { status: 500 }
    );
  }
}
