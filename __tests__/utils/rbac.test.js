import { canUseAction } from '@/utils/rbac';

describe('canUseAction', () => {
  it('should allow student to view and update own data', () => {
    expect(canUseAction('student', 'view', 'own')).toBe(true);
    expect(canUseAction('student', 'update', 'own')).toBe(true);
  });

  it('should not allow student to perform actions on any or related scope', () => {
    expect(canUseAction('student', 'view', 'any')).toBe(false);
    expect(canUseAction('student', 'delete', 'related')).toBe(false);
  });

  it('should allow lecturer to view, update, and delete related data', () => {
    expect(canUseAction('lecturer', 'view', 'related')).toBe(true);
    expect(canUseAction('lecturer', 'update', 'related')).toBe(true);
    expect(canUseAction('lecturer', 'delete', 'related')).toBe(true);
  });

  it('should not allow lecturer to perform admin-level actions', () => {
    expect(canUseAction('lecturer', 'delete', 'any')).toBe(false);
    expect(canUseAction('lecturer', 'add', 'any')).toBe(false);
  });

  it('should allow admin to do anything with any scope', () => {
    expect(canUseAction('admin', 'view', 'any')).toBe(true);
    expect(canUseAction('admin', 'add', 'any')).toBe(true);
    expect(canUseAction('admin', 'update', 'any')).toBe(true);
    expect(canUseAction('admin', 'delete', 'any')).toBe(true);
  });

  it('should return false for unknown roles or actions', () => {
    expect(canUseAction('guest', 'view')).toBe(false);
    expect(canUseAction('admin', 'fly', 'any')).toBe(false);
    expect(canUseAction(undefined, 'view')).toBe(false);
  });
});
