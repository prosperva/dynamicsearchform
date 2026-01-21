# Database-Level Row Locking Implementation

## Overview

This implementation moves row locking from client-side state to the database, making locks persistent across page refreshes, browser crashes, and enabling true multi-user coordination.

---

## Database Schema

### Option 1: Separate Locks Table (Recommended)

#### PostgreSQL / MySQL

```sql
CREATE TABLE row_locks (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  row_id VARCHAR(255) NOT NULL,
  locked_by VARCHAR(255) NOT NULL,
  locked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Composite unique constraint: one lock per table+row
  UNIQUE (table_name, row_id),

  -- Indexes for fast lookups
  INDEX idx_locked_by (locked_by),
  INDEX idx_locked_at (locked_at),
  INDEX idx_table_row (table_name, row_id)
);
```

#### SQL Server

```sql
CREATE TABLE row_locks (
  id INT IDENTITY(1,1) PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  row_id VARCHAR(255) NOT NULL,
  locked_by VARCHAR(255) NOT NULL,
  locked_at DATETIME2 NOT NULL DEFAULT GETDATE(),

  -- Composite unique constraint
  CONSTRAINT UQ_table_row UNIQUE (table_name, row_id)
);

-- Create indexes
CREATE INDEX idx_locked_by ON row_locks(locked_by);
CREATE INDEX idx_locked_at ON row_locks(locked_at);
CREATE INDEX idx_table_row ON row_locks(table_name, row_id);
```

**Benefits**:
- ✅ Works for any table (products, orders, invoices, etc.)
- ✅ Centralized lock management
- ✅ Easy to query all locks across the system
- ✅ Clean separation of concerns

### Option 2: Add Columns to Existing Table

```sql
-- PostgreSQL / MySQL
ALTER TABLE products
ADD COLUMN locked_by VARCHAR(255),
ADD COLUMN locked_at TIMESTAMP;

CREATE INDEX idx_products_locked ON products(locked_by, locked_at);
```

```sql
-- SQL Server
ALTER TABLE products
ADD locked_by VARCHAR(255),
    locked_at DATETIME2;

CREATE INDEX idx_products_locked ON products(locked_by, locked_at);
```

**Benefits**:
- ✅ Simpler queries (no joins needed)
- ✅ Atomic updates with row data

**Drawbacks**:
- ❌ Need to add columns to every lockable table
- ❌ Harder to get system-wide lock overview

---

## API Endpoints

### File Structure

```
app/
  api/
    locks/
      acquire/
        route.ts       # POST - Acquire lock
      release/
        route.ts       # DELETE - Release lock
      check/
        route.ts       # GET - Check lock status
      cleanup/
        route.ts       # POST - Cleanup stale locks (cron)
```

### 1. Acquire Lock Endpoint

**File**: `app/api/locks/acquire/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql'; // or your DB library

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

export async function POST(request: NextRequest) {
  try {
    const { tableName, rowId, userId } = await request.json();

    if (!tableName || !rowId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const pool = await sql.connect(config);

    // Check for existing lock
    const checkQuery = `
      SELECT locked_by, locked_at
      FROM row_locks
      WHERE table_name = @tableName AND row_id = @rowId
    `;

    const checkRequest = pool.request();
    checkRequest.input('tableName', sql.VarChar(100), tableName);
    checkRequest.input('rowId', sql.VarChar(255), rowId);
    const checkResult = await checkRequest.query(checkQuery);

    if (checkResult.recordset.length > 0) {
      const existingLock = checkResult.recordset[0];

      // Check if lock is stale (older than 5 minutes)
      const lockAge = Date.now() - new Date(existingLock.locked_at).getTime();
      const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

      if (existingLock.locked_by === userId) {
        // User already has the lock, refresh timestamp
        const refreshQuery = `
          UPDATE row_locks
          SET locked_at = GETDATE()
          WHERE table_name = @tableName AND row_id = @rowId
        `;
        const refreshRequest = pool.request();
        refreshRequest.input('tableName', sql.VarChar(100), tableName);
        refreshRequest.input('rowId', sql.VarChar(255), rowId);
        await refreshRequest.query(refreshQuery);

        return NextResponse.json({
          success: true,
          message: 'Lock refreshed',
          lockedBy: userId
        });
      }

      if (lockAge < LOCK_TIMEOUT) {
        // Lock is held by another user and still valid
        return NextResponse.json(
          {
            error: 'Row is locked by another user',
            lockedBy: existingLock.locked_by,
            lockedAt: existingLock.locked_at
          },
          { status: 423 } // 423 Locked
        );
      }

      // Lock is stale, delete it and acquire new lock
      const deleteQuery = `
        DELETE FROM row_locks
        WHERE table_name = @tableName AND row_id = @rowId
      `;
      const deleteRequest = pool.request();
      deleteRequest.input('tableName', sql.VarChar(100), tableName);
      deleteRequest.input('rowId', sql.VarChar(255), rowId);
      await deleteRequest.query(deleteQuery);
    }

    // Acquire new lock
    const insertQuery = `
      INSERT INTO row_locks (table_name, row_id, locked_by, locked_at)
      VALUES (@tableName, @rowId, @userId, GETDATE())
    `;

    const insertRequest = pool.request();
    insertRequest.input('tableName', sql.VarChar(100), tableName);
    insertRequest.input('rowId', sql.VarChar(255), rowId);
    insertRequest.input('userId', sql.VarChar(255), userId);
    await insertRequest.query(insertQuery);

    return NextResponse.json({
      success: true,
      message: 'Lock acquired',
      lockedBy: userId,
      lockedAt: new Date()
    });

  } catch (error: any) {
    console.error('Lock acquisition error:', error);
    return NextResponse.json(
      { error: 'Failed to acquire lock', details: error.message },
      { status: 500 }
    );
  }
}
```

### 2. Release Lock Endpoint

**File**: `app/api/locks/release/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

export async function POST(request: NextRequest) {
  try {
    const { tableName, rowId, userId } = await request.json();

    if (!tableName || !rowId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const pool = await sql.connect(config);

    // Delete lock only if owned by this user
    const deleteQuery = `
      DELETE FROM row_locks
      WHERE table_name = @tableName
        AND row_id = @rowId
        AND locked_by = @userId
    `;

    const request = pool.request();
    request.input('tableName', sql.VarChar(100), tableName);
    request.input('rowId', sql.VarChar(255), rowId);
    request.input('userId', sql.VarChar(255), userId);

    const result = await request.query(deleteQuery);

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json(
        { error: 'Lock not found or not owned by user' },
        { status: 404 }
      );
    }

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
```

### 3. Check Lock Status Endpoint

**File**: `app/api/locks/check/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tableName = searchParams.get('tableName');
    const rowId = searchParams.get('rowId');

    if (!tableName) {
      return NextResponse.json(
        { error: 'tableName is required' },
        { status: 400 }
      );
    }

    const pool = await sql.connect(config);

    let query: string;
    const req = pool.request();
    req.input('tableName', sql.VarChar(100), tableName);

    if (rowId) {
      // Check specific row
      query = `
        SELECT row_id, locked_by, locked_at
        FROM row_locks
        WHERE table_name = @tableName AND row_id = @rowId
      `;
      req.input('rowId', sql.VarChar(255), rowId);
    } else {
      // Get all locks for table
      query = `
        SELECT row_id, locked_by, locked_at
        FROM row_locks
        WHERE table_name = @tableName
      `;
    }

    const result = await req.query(query);

    // Filter out stale locks (older than 5 minutes)
    const LOCK_TIMEOUT = 5 * 60 * 1000;
    const now = Date.now();

    const activeLocks = result.recordset.filter(lock => {
      const lockAge = now - new Date(lock.locked_at).getTime();
      return lockAge < LOCK_TIMEOUT;
    });

    if (rowId) {
      return NextResponse.json({
        locked: activeLocks.length > 0,
        lock: activeLocks[0] || null
      });
    }

    return NextResponse.json({
      locks: activeLocks
    });

  } catch (error: any) {
    console.error('Lock check error:', error);
    return NextResponse.json(
      { error: 'Failed to check lock', details: error.message },
      { status: 500 }
    );
  }
}
```

### 4. Cleanup Stale Locks Endpoint (Cron Job)

**File**: `app/api/locks/cleanup/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER!,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized cleanup
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const pool = await sql.connect(config);

    // Delete locks older than 5 minutes
    const cleanupQuery = `
      DELETE FROM row_locks
      WHERE DATEDIFF(MINUTE, locked_at, GETDATE()) > 5
    `;

    const result = await pool.request().query(cleanupQuery);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.rowsAffected[0]} stale locks`
    });

  } catch (error: any) {
    console.error('Lock cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup locks', details: error.message },
      { status: 500 }
    );
  }
}
```

---

## Frontend Integration

### Updated Lock Management Service

**File**: `lib/lockService.ts`

```typescript
export interface Lock {
  tableName: string;
  rowId: string;
  lockedBy: string;
  lockedAt: Date;
}

export class LockService {
  private static currentUser: string = 'user@example.com'; // Get from auth

  /**
   * Acquire a lock on a row
   */
  static async acquireLock(tableName: string, rowId: string): Promise<{ success: boolean; error?: string; lockedBy?: string }> {
    try {
      const response = await fetch('/api/locks/acquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName,
          rowId,
          userId: this.currentUser
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error,
          lockedBy: data.lockedBy
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Release a lock on a row
   */
  static async releaseLock(tableName: string, rowId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/locks/release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName,
          rowId,
          userId: this.currentUser
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to release lock:', error);
      return false;
    }
  }

  /**
   * Check if a row is locked
   */
  static async checkLock(tableName: string, rowId: string): Promise<Lock | null> {
    try {
      const response = await fetch(
        `/api/locks/check?tableName=${tableName}&rowId=${rowId}`
      );

      const data = await response.json();
      return data.locked ? data.lock : null;
    } catch (error) {
      console.error('Failed to check lock:', error);
      return null;
    }
  }

  /**
   * Get all locks for a table
   */
  static async getTableLocks(tableName: string): Promise<Lock[]> {
    try {
      const response = await fetch(`/api/locks/check?tableName=${tableName}`);
      const data = await response.json();
      return data.locks || [];
    } catch (error) {
      console.error('Failed to get table locks:', error);
      return [];
    }
  }

  /**
   * Keep lock alive by refreshing timestamp
   */
  static async refreshLock(tableName: string, rowId: string): Promise<boolean> {
    // Re-acquiring refreshes the timestamp
    const result = await this.acquireLock(tableName, rowId);
    return result.success;
  }
}
```

### Updated Frontend Component

**File**: `app/page.tsx` (changes)

```typescript
import { LockService } from '@/lib/lockService';

export default function Home() {
  const [lockedRows, setLockedRows] = useState<Record<number, { lockedBy: string; lockedAt: Date }>>({});
  const currentUser = 'user@example.com'; // Get from auth

  // Load locks on mount and periodically sync
  useEffect(() => {
    const syncLocks = async () => {
      const locks = await LockService.getTableLocks('products');
      const lockMap: Record<number, { lockedBy: string; lockedAt: Date }> = {};

      locks.forEach(lock => {
        lockMap[Number(lock.rowId)] = {
          lockedBy: lock.lockedBy,
          lockedAt: new Date(lock.lockedAt)
        };
      });

      setLockedRows(lockMap);
    };

    // Initial sync
    syncLocks();

    // Sync every 10 seconds to get updates from other users
    const interval = setInterval(syncLocks, 10000);

    return () => clearInterval(interval);
  }, []);

  // Heartbeat to keep lock alive while editing
  useEffect(() => {
    if (!editDialogOpen || !selectedRow || selectedRow.readOnly) return;

    const heartbeat = setInterval(async () => {
      await LockService.refreshLock('products', selectedRow.id.toString());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(heartbeat);
  }, [editDialogOpen, selectedRow]);

  const handleEditRow = async (row: any) => {
    if (row.readOnly) {
      alert('This record is read-only and cannot be edited.');
      return;
    }

    // Try to acquire lock from database
    const lockResult = await LockService.acquireLock('products', row.id.toString());

    if (!lockResult.success) {
      alert(`This record is currently being edited by ${lockResult.lockedBy}.\nPlease try again later.`);
      return;
    }

    // Update local state
    setLockedRows(prev => ({
      ...prev,
      [row.id]: { lockedBy: currentUser, lockedAt: new Date() }
    }));

    setSelectedRow(row);
    setDialogMode('edit');
    setEditDialogOpen(true);
  };

  const handleEditCancel = async () => {
    // Release lock in database
    if (selectedRow) {
      await LockService.releaseLock('products', selectedRow.id.toString());

      setLockedRows(prev => {
        const newLocks = { ...prev };
        delete newLocks[selectedRow.id];
        return newLocks;
      });
    }

    setEditDialogOpen(false);
    setSelectedRow(null);
  };

  // ... rest of component
}
```

---

## Cron Job Setup

### Vercel Cron (vercel.json)

```json
{
  "crons": [{
    "path": "/api/locks/cleanup",
    "schedule": "*/5 * * * *"
  }]
}
```

### Alternative: Node-cron

```typescript
// lib/cron.ts
import cron from 'node-cron';

export function startLockCleanup() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      await fetch('http://localhost:3000/api/locks/cleanup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CRON_SECRET}`
        }
      });
    } catch (error) {
      console.error('Lock cleanup failed:', error);
    }
  });
}
```

---

## Benefits of Database-Level Locking

✅ **Persistent across refreshes**: Page refresh doesn't lose locks
✅ **Multi-user coordination**: True real-time locking between users
✅ **Survives crashes**: Browser crash doesn't permanently lock rows
✅ **Centralized management**: All locks in one place
✅ **Audit trail**: Track who locked what and when
✅ **Automatic cleanup**: Cron job removes stale locks
✅ **Lock refresh**: Heartbeat keeps active sessions alive

---

## Testing

### 1. Basic Lock Acquisition
```bash
curl -X POST http://localhost:3000/api/locks/acquire \
  -H "Content-Type: application/json" \
  -d '{"tableName":"products","rowId":"1","userId":"user@example.com"}'
```

### 2. Check Lock Status
```bash
curl http://localhost:3000/api/locks/check?tableName=products&rowId=1
```

### 3. Release Lock
```bash
curl -X POST http://localhost:3000/api/locks/release \
  -H "Content-Type: application/json" \
  -d '{"tableName":"products","rowId":"1","userId":"user@example.com"}'
```

### 4. Cleanup Stale Locks
```bash
curl -X POST http://localhost:3000/api/locks/cleanup \
  -H "Authorization: Bearer your-cron-secret"
```

---

## Summary

✅ Database schema created
✅ API endpoints implemented
✅ Frontend service layer
✅ Lock synchronization
✅ Heartbeat mechanism
✅ Automatic cleanup
✅ Multi-user support

**No more client-side lock state!** Everything is now persisted in the database and syncs across all users in real-time.
