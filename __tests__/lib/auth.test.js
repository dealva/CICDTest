import { handleUserNotFound, handleForbidden, getRBACScope } from '@/lib/auth';

describe('handleUserNotFound', () => {
  it('should return 404 response if user is null', async () => {
    const res = await handleUserNotFound(null);
    const json = await res.json();
    expect(res.status).toBe(404);
    expect(json).toEqual({ error: 'User not found' });
  });

  it('should return null if user exists', () => {
    const user = { id: 1, name: 'Test' };
    const res = handleUserNotFound(user);
    expect(res).toBeNull();
  });
});

describe('handleForbidden', () => {
  it('should return 403 response with error message', async () => {
    const res = handleForbidden();
    const json = await res.json();
    expect(res.status).toBe(403);
    expect(json).toEqual({ error: 'Forbidden' });
  });
});

describe('getRBACScope', () => {
  const baseUser = { id: 2, major: 'CS' };

  it('should return "own" if session userId matches target user id', () => {
    const session = { userId: 2, role: 'student', major: 'CS' };
    expect(getRBACScope(session, baseUser)).toBe('own');
  });

  it('should return "related" if lecturer and same major', () => {
    const session = { userId: 1, role: 'lecturer', major: 'CS' };
    expect(getRBACScope(session, baseUser)).toBe('related');
  });

  it('should return "any" if neither owner nor related', () => {
    const session = { userId: 1, role: 'admin', major: 'Math' };
    expect(getRBACScope(session, baseUser)).toBe('any');
  });
});
