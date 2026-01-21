import { NextRequest, NextResponse } from 'next/server';

// Mock database - replace with your actual database
// Note: This should be the same object as in acquire/route.ts
// In production, this would be in your database
let mockLocks: Record<string, { lockedBy: string; lockedAt: Date }> = {};

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

    if (!existingLock) {
      return NextResponse.json(
        { error: 'Lock not found' },
        { status: 404 }
      );
    }

    if (existingLock.lockedBy !== userId) {
      return NextResponse.json(
        { error: 'Lock is owned by another user' },
        { status: 403 }
      );
    }

    // Release the lock
    delete mockLocks[lockKey];

    return NextResponse.json({
      success: true,
      message: 'Lock released'
    });

  } catch (error: any) {
    console.error('Lock release error:', error);
    return NextResponse.json(
      { error: 'Failed to release lock', details: error.message },
      { status: 500 }
    );
  }
}
