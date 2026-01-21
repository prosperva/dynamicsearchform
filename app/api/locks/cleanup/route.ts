import { NextRequest, NextResponse } from 'next/server';

// Mock database - replace with your actual database
let mockLocks: Record<string, { lockedBy: string; lockedAt: Date }> = {};

const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    // Optional: Verify cron secret to prevent unauthorized cleanup
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const now = Date.now();
    const staleKeys: string[] = [];

    // Find all stale locks
    Object.entries(mockLocks).forEach(([key, lock]) => {
      const lockAge = now - new Date(lock.lockedAt).getTime();
      if (lockAge >= LOCK_TIMEOUT) {
        staleKeys.push(key);
      }
    });

    // Delete stale locks
    staleKeys.forEach(key => {
      console.log(`Cleaning up stale lock: ${key} (locked by ${mockLocks[key].lockedBy})`);
      delete mockLocks[key];
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${staleKeys.length} stale locks`,
      cleanedLocks: staleKeys.length
    });

  } catch (error: any) {
    console.error('Lock cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup locks', details: error.message },
      { status: 500 }
    );
  }
}
