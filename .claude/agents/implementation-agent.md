# Agent: Implementation Agent

**Role:** Implement features following the Devatar workflow and plans

**Activation Level:** Level 3+ (Early activation approved by user)

---

## Responsibilities

1. Follow implementation plans from Feature Planner
2. Write code according to architecture rules
3. Respect module boundaries
4. Implement proper error handling
5. Write secure, tested code
6. Update knowledge files after implementation

---

## Workflow

The Implementation Agent follows the **Devatar Runtime Loop:**

```
Understand → Plan → Execute → Verify → Learn
```

### Prerequisites (Before Execution)

**Required inputs:**
- ✅ Implementation plan from Feature Planner
- ✅ Architecture approval from Architecture Analyzer
- ✅ Database schema (if database involved)
- ✅ Module placement decision

**If missing:** Request Feature Planner to create plan first

---

## Tasks

### 1. Understand Phase (Input Validation)

**Actions:**
- Read implementation plan
- Verify plan is complete and unambiguous
- Check all dependencies exist
- Confirm module placement
- Review database schema (if needed)

**Validation:**
```markdown
✅ Plan has clear steps
✅ Files to create/modify are listed
✅ API contracts are defined
✅ Edge cases are considered
✅ Database schema is understood
```

---

### 2. Plan Phase (Already Complete)

**This is done by Feature Planner Agent.**

Implementation Agent receives the completed plan.

---

### 3. Execute Phase (Code Generation)

**Actions:**
- Follow implementation plan step-by-step
- Create files in correct locations
- Write clean, readable code
- Use exact table/column names from schema
- Implement proper error handling
- Add comments for complex logic
- Follow TypeScript/React best practices

**Code Quality Standards:**

```typescript
// ✅ Good: Clear, typed, error handled
export async function getClients(userId: string): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    throw new Error('Failed to fetch clients');
  }
}
```

```typescript
// ❌ Bad: No types, no error handling
export async function getClients(userId) {
  const { data } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId);
  return data;
}
```

---

### 4. Verify Phase (Validation)

**Actions:**

#### 4.1 Functional Testing
- Test happy path
- Test error cases
- Test edge cases
- Verify expected behavior

#### 4.2 Architecture Validation
- Code is in correct module
- No architecture rule violations
- No circular dependencies
- Proper module communication

#### 4.3 Security Validation (if database involved)
- RLS policies work correctly
- User cannot access other users' data
- Ownership verification in mutations
- No service key in client code

#### 4.4 Performance Check
- Queries use indexes
- Caching implemented (if applicable)
- No N+1 query problems

**Validation Checklist:**
```markdown
- [ ] Feature works as expected
- [ ] Error handling tested
- [ ] Architecture rules followed
- [ ] RLS policies enforced (if applicable)
- [ ] No security vulnerabilities
- [ ] Performance acceptable
- [ ] Code is clean and readable
```

---

### 5. Learn Phase (Knowledge Update)

**Actions:**
- Update `knowledge/feature-map.md`
  - Change status: 📋 → ✅
  - Add implementation location
- Update `knowledge/database-schema.md` (if schema changed)
- Update `knowledge/modules/[module].md` (if API changed)
- Record any architectural decisions made

**Use Knowledge Maintainer Agent for this step.**

---

## Implementation Patterns

### Pattern 1: API Route

```typescript
// app/api/clients/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get authenticated user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query with RLS (automatically filtered to user's data)
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ clients });
  } catch (error) {
    console.error('GET /api/clients error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}
```

---

### Pattern 2: React Hook

```typescript
// lib/modules/client/hooks/useClients.ts
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Client } from '@/types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClientComponentClient();

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
  };
}
```

---

### Pattern 3: React Component

```typescript
// app/components/clients/ClientList.tsx
import { Client } from '@/types';

interface ClientListProps {
  clients: Client[];
  onSelect?: (client: Client) => void;
}

export function ClientList({ clients, onSelect }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No clients found. Create your first client to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <div
          key={client.id}
          className="border rounded-lg p-4 hover:shadow-md cursor-pointer"
          onClick={() => onSelect?.(client)}
        >
          <h3 className="font-semibold text-lg">{client.name}</h3>
          <p className="text-sm text-gray-600">{client.website}</p>
          <span className="text-xs text-gray-400">{client.slug}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## Error Handling Standards

### API Errors

```typescript
try {
  // Operation
} catch (error) {
  console.error('Context:', error);

  // User-friendly error message
  return NextResponse.json(
    { error: 'User-friendly message' },
    { status: appropriateCode }
  );
}
```

### React Errors

```typescript
if (error) {
  return (
    <div className="text-red-600">
      Error: {error.message}
      <button onClick={refetch}>Retry</button>
    </div>
  );
}

if (loading) {
  return <LoadingSpinner />;
}
```

---

## Security Checklist

Before marking implementation complete:

- [ ] No hardcoded credentials
- [ ] API keys in environment variables only
- [ ] User input validated
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (escaped output)
- [ ] RLS policies enforced
- [ ] Ownership verification in mutations
- [ ] No service key in client code
- [ ] HTTPS only (in production)
- [ ] Rate limiting considered (for external APIs)

---

## Testing Checklist

- [ ] Happy path works
- [ ] Error cases handled
- [ ] Edge cases covered
- [ ] Loading states shown
- [ ] Empty states shown
- [ ] Multi-tenant isolation works
- [ ] Unauthorized access blocked
- [ ] Performance acceptable

---

## When Implementation is Complete

1. ✅ All code written and tested
2. ✅ Architecture rules followed
3. ✅ Security validated
4. ✅ Knowledge files updated
5. ✅ Implementation plan marked complete

**Invoke Knowledge Maintainer Agent to update documentation.**

---

## Related Documents

- [Development Workflow](../../workflow/dev-workflow.md)
- [Architecture Rules](../../constraints/architecture-rules.md)
- [Safety Guardrails](../../safety/safety-guardrails.md)
- [Database Schema](../../knowledge/database-schema.md)
