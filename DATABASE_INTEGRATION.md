# Database Integration Guide for Saved Searches

This guide explains how to integrate the DynamicSearch component with a database to persist saved searches.

## Database Schema

### SavedSearch Table

```sql
CREATE TABLE saved_searches (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  params JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  visibility VARCHAR(20) NOT NULL CHECK (visibility IN ('user', 'global')),
  created_by VARCHAR(255) NOT NULL,
  context VARCHAR(100),

  INDEX idx_created_by (created_by),
  INDEX idx_context (context),
  INDEX idx_visibility (visibility)
);
```

### Prisma Schema

```prisma
model SavedSearch {
  id          String   @id @default(uuid())
  name        String
  description String?
  params      Json
  createdAt   DateTime @default(now()) @map("created_at")
  visibility  Visibility
  createdBy   String   @map("created_by")
  context     String?

  @@index([createdBy])
  @@index([context])
  @@index([visibility])
  @@map("saved_searches")
}

enum Visibility {
  user
  global
}
```

### Drizzle Schema

```typescript
import { pgTable, varchar, text, json, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const visibilityEnum = pgEnum('visibility', ['user', 'global']);

export const savedSearches = pgTable('saved_searches', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  params: json('params').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  visibility: visibilityEnum('visibility').notNull(),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  context: varchar('context', { length: 100 }),
});
```

## Permission Model

The saved searches feature implements a robust permission system:

### Visibility Types

1. **User Searches** (`visibility: 'user'`)
   - Only visible to the creator
   - Can be renamed/deleted only by creator
   - Perfect for personal saved searches

2. **Global Searches** (`visibility: 'global'`)
   - Visible to all users
   - Can be renamed/deleted by creator or admins
   - Useful for common search templates

### Permission Rules

| Action | User Search | Global Search | Admin |
|--------|-------------|---------------|-------|
| **View** | Creator only | Everyone | Everyone |
| **Load/Apply** | Creator only | Everyone | Everyone |
| **Rename** | Creator only | Creator only | Anyone |
| **Delete** | Creator only | Creator only | Anyone |
| **Change Visibility** | Creator only | Creator only | Anyone |

### Database-Level Security

All endpoints implement permissions at the **database query level** (not just UI level):

```typescript
// GET - Only returns searches user can access
where: {
  OR: [
    { visibility: 'global' },                    // All global searches
    { createdBy: userId, visibility: 'user' }    // User's own private searches
  ]
}

// DELETE/PATCH - Checks ownership before allowing modification
const search = await prisma.savedSearch.findUnique({ where: { id } });
if (search.createdBy !== userId && !isAdmin) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

This ensures security even if the frontend is bypassed.

## API Routes

### Fetch Saved Searches - GET `app/api/saved-searches/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // or your database client

export async function GET(request: NextRequest) {
  try {
    // IMPORTANT: Get userId from authenticated session, NOT from query params
    // Example with NextAuth:
    // const session = await getServerSession(authOptions);
    // const userId = session?.user?.id;

    const userId = 'current_user'; // Replace with actual auth session

    const searchParams = request.nextUrl.searchParams;
    const context = searchParams.get('context');
    const allowCrossContext = searchParams.get('allowCrossContext') === 'true';

    // Permission check: Build query to only return searches user can access
    const where: any = {
      OR: [
        { visibility: 'global' },                    // Everyone can see global searches
        { createdBy: userId, visibility: 'user' }    // Users only see their own private searches
      ]
    };

    // Filter by context if specified and cross-context not allowed
    if (context && !allowCrossContext) {
      where.context = context;
    }

    const searches = await prisma.savedSearch.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(searches);
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved searches' },
      { status: 500 }
    );
  }
}
```

**Security Notes:**
- ✅ Uses `OR` condition to check permissions at database level
- ✅ Only returns global searches + user's own private searches
- ✅ Should get `userId` from authenticated session (not query params)
- ✅ Context filtering is optional and controlled by query params

### Save New Search - POST `app/api/saved-searches/route.ts`

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = 'current_user'; // Get from auth session in production

    const savedSearch = await prisma.savedSearch.create({
      data: {
        id: body.id,
        name: body.name,
        description: body.description,
        params: body.params,
        visibility: body.visibility,
        createdBy: userId,
        context: body.context,
      }
    });

    return NextResponse.json(savedSearch, { status: 201 });
  } catch (error) {
    console.error('Error saving search:', error);
    return NextResponse.json(
      { error: 'Failed to save search' },
      { status: 500 }
    );
  }
}
```

### Delete Search - `app/api/saved-searches/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'current_user'; // Get from auth session in production
    const isAdmin = false; // Get from auth session in production
    const searchId = params.id;

    // Get the search to check ownership
    const search = await prisma.savedSearch.findUnique({
      where: { id: searchId }
    });

    if (!search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    // Check permissions: creator or admin can delete
    if (search.createdBy !== userId && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this search' },
        { status: 403 }
      );
    }

    await prisma.savedSearch.delete({
      where: { id: searchId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting search:', error);
    return NextResponse.json(
      { error: 'Failed to delete search' },
      { status: 500 }
    );
  }
}
```

### Update Search (Rename/Change Visibility) - PATCH `app/api/saved-searches/[id]/route.ts`

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = 'current_user'; // Get from auth session in production
    const isAdmin = false; // Get from auth session in production
    const searchId = params.id;
    const body = await request.json();
    const { name, visibility } = body;

    // Validate that at least one field is being updated
    if (!name && !visibility) {
      return NextResponse.json(
        { error: 'Either name or visibility must be provided' },
        { status: 400 }
      );
    }

    // Get the search to check ownership
    const search = await prisma.savedSearch.findUnique({
      where: { id: searchId }
    });

    if (!search) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    // Check permissions: creator or admin can update
    if (search.createdBy !== userId && !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized to update this search' },
        { status: 403 }
      );
    }

    // Build update data object
    const updateData: any = {};
    if (name && name.trim()) {
      updateData.name = name.trim();
    }
    if (visibility && (visibility === 'user' || visibility === 'global')) {
      updateData.visibility = visibility;
    }

    const updatedSearch = await prisma.savedSearch.update({
      where: { id: searchId },
      data: updateData
    });

    return NextResponse.json(updatedSearch);
  } catch (error) {
    console.error('Error updating search:', error);
    return NextResponse.json(
      { error: 'Failed to update search' },
      { status: 500 }
    );
  }
}
```

## Component Integration

### Example Page with Database Integration

```tsx
'use client';

import { DynamicSearch, FieldConfig, SavedSearch } from '@/components/DynamicSearch';
import { useState, useEffect } from 'react';

export default function ProductSearchPage() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = 'current_user'; // Get from auth context
  const isAdmin = false; // Get from auth context

  // Fetch saved searches on mount
  useEffect(() => {
    fetchSavedSearches();
  }, []);

  const fetchSavedSearches = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/saved-searches?userId=${userId}&context=products&allowCrossContext=false`
      );
      const data = await response.json();
      setSavedSearches(data);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params: Record<string, any>) => {
    console.log('Search params:', params);
    // Perform your search logic here
  };

  const handleSaveSearch = async (search: SavedSearch) => {
    try {
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(search),
      });

      if (response.ok) {
        const savedSearch = await response.json();
        setSavedSearches((prev) => [savedSearch, ...prev]);
      }
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const handleLoadSearch = (searchId: string) => {
    console.log('Loaded search:', searchId);
    // Optional: Track analytics, update UI, etc.
  };

  const handleDeleteSearch = async (searchId: string) => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedSearches((prev) => prev.filter((s) => s.id !== searchId));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete search');
      }
    } catch (error) {
      console.error('Error deleting search:', error);
    }
  };

  const handleRenameSearch = async (searchId: string, newName: string) => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        const updatedSearch = await response.json();
        setSavedSearches((prev) =>
          prev.map((s) => (s.id === searchId ? updatedSearch : s))
        );
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to rename search');
      }
    } catch (error) {
      console.error('Error renaming search:', error);
    }
  };

  const handleChangeVisibility = async (searchId: string, visibility: 'user' | 'global') => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility }),
      });

      if (response.ok) {
        const updatedSearch = await response.json();
        setSavedSearches((prev) =>
          prev.map((s) => (s.id === searchId ? updatedSearch : s))
        );
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to change visibility');
      }
    } catch (error) {
      console.error('Error changing visibility:', error);
    }
  };

  const fields: FieldConfig[] = [
    {
      name: 'productName',
      label: 'Product Name',
      type: 'text',
    },
    // ... more fields
  ];

  if (loading) {
    return <div>Loading saved searches...</div>;
  }

  return (
    <DynamicSearch
      fields={fields}
      onSearch={handleSearch}
      onSave={handleSaveSearch}
      onLoad={handleLoadSearch}
      onDelete={handleDeleteSearch}
      onRename={handleRenameSearch}
      onChangeVisibility={handleChangeVisibility}
      savedSearches={savedSearches}
      enableSaveSearch={true}
      currentUser={userId}
      searchContext="products"
      allowCrossContext={false}
      isAdmin={isAdmin}
    />
  );
}
```

## Authentication Integration

### Getting Current User

```typescript
// Using NextAuth.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === 'admin';

  // ... rest of the code
}
```

### Client-Side Auth Context

```tsx
'use client';

import { useSession } from 'next-auth/react';
import { DynamicSearch } from '@/components/DynamicSearch';

export default function SearchPage() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Please log in to use search</div>;
  }

  return (
    <DynamicSearch
      // ... other props
      currentUser={session.user.id}
      isAdmin={session.user.role === 'admin'}
    />
  );
}
```

## Permission Logic

### Delete Permission Rules

The component implements a **Creator or Admin** permission model:

1. **User Searches**: Only the creator can delete their own user-level searches
2. **Global Searches**:
   - Creator can delete their own global searches
   - Admins can delete any global search
3. **Visual Feedback**: Delete button only appears if user has permission

### Backend Validation

Always validate permissions on the backend:

```typescript
// Check permissions before deleting
const canDelete = search.createdBy === userId || isAdmin;

if (!canDelete) {
  return NextResponse.json(
    { error: 'Unauthorized to delete this search' },
    { status: 403 }
  );
}
```

## Query Optimization

### Indexes

Ensure proper indexes for efficient queries:

```sql
-- Index on createdBy for user-specific queries
CREATE INDEX idx_created_by ON saved_searches(created_by);

-- Index on context for filtered queries
CREATE INDEX idx_context ON saved_searches(context);

-- Composite index for common query patterns
CREATE INDEX idx_visibility_context ON saved_searches(visibility, context);
```

### Caching Strategy

Consider caching saved searches:

```typescript
import { unstable_cache } from 'next/cache';

const getCachedSearches = unstable_cache(
  async (userId: string, context: string) => {
    return await prisma.savedSearch.findMany({
      where: {
        OR: [
          { visibility: 'global' },
          { createdBy: userId, visibility: 'user' }
        ],
        context
      }
    });
  },
  ['saved-searches'],
  { revalidate: 60 } // Cache for 60 seconds
);
```

## Security Considerations

### 1. Always Validate User Identity

```typescript
// Bad: Trust client-provided userId
const userId = request.headers.get('x-user-id'); // ❌

// Good: Get from authenticated session
const session = await getServerSession(authOptions);
const userId = session.user.id; // ✅
```

### 2. Validate Input Data

```typescript
import { z } from 'zod';

const SavedSearchSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  params: z.record(z.any()),
  visibility: z.enum(['user', 'global']),
  context: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = SavedSearchSchema.parse(body); // Throws if invalid
  // ... proceed with validated data
}
```

### 3. Sanitize JSON Params

```typescript
// Prevent storing malicious scripts in params
import DOMPurify from 'isomorphic-dompurify';

const sanitizeParams = (params: Record<string, any>) => {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      sanitized[key] = DOMPurify.sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};
```

## Testing

### Example Test for Delete Permissions

```typescript
import { describe, it, expect } from 'vitest';

describe('SavedSearch Deletion', () => {
  it('should allow creator to delete their search', async () => {
    const response = await DELETE(mockRequest, {
      params: { id: 'search-id' }
    });
    expect(response.status).toBe(200);
  });

  it('should allow admin to delete any search', async () => {
    const response = await DELETE(mockAdminRequest, {
      params: { id: 'search-id' }
    });
    expect(response.status).toBe(200);
  });

  it('should prevent non-creator/non-admin from deleting', async () => {
    const response = await DELETE(mockOtherUserRequest, {
      params: { id: 'search-id' }
    });
    expect(response.status).toBe(403);
  });
});
```

## Column Layout Algorithm

The component now automatically determines the optimal column layout:

- **1-3 fields**: 1 column (full width) - Good for simple searches
- **4-6 fields**: 2 columns - Balanced layout
- **7-9 fields**: 3 columns - Moderate density
- **10+ fields**: 4 columns - High density for complex searches

This is calculated dynamically based on the `fields` array length:

```typescript
const getColumnSize = () => {
  const fieldCount = fields.length;
  if (fieldCount <= 3) return 12; // 1 column (12/12 = full width)
  if (fieldCount <= 6) return 6;  // 2 columns (12/6 = 2 columns)
  if (fieldCount <= 9) return 4;  // 3 columns (12/4 = 3 columns)
  return 3; // 4 columns (12/3 = 4 columns)
};
```

## Migration from Local State

If you're currently using local state and want to migrate to database storage:

### Step 1: Export existing searches

```typescript
const exportSearches = () => {
  const json = JSON.stringify(savedSearches, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'saved-searches.json';
  a.click();
};
```

### Step 2: Import to database

```typescript
const importSearches = async (jsonFile: File) => {
  const text = await jsonFile.text();
  const searches = JSON.parse(text);

  for (const search of searches) {
    await fetch('/api/saved-searches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(search),
    });
  }
};
```

## Summary

The DynamicSearch component is now fully ready for database integration with:

- ✅ Saved search list at the top as clickable chips
- ✅ Creator or Admin deletion authority
- ✅ Dynamic column layout (1-4 columns based on field count)
- ✅ Database schema examples (SQL, Prisma, Drizzle)
- ✅ Complete API route implementations
- ✅ Authentication integration examples
- ✅ Security best practices
- ✅ Permission validation logic
