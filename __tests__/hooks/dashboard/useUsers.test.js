import { renderHook, act } from '@testing-library/react';
import { useUsers } from '@/hooks/dashboard/useUsers';
import axios from 'axios';
import * as rbac from '@/utils/rbac';

jest.mock('axios');
jest.mock('@/utils/rbac', () => ({
  canUseAction: jest.fn(),
}));

// Mock window.confirm
global.confirm = jest.fn();

describe('useUsers', () => {
  const mockUsers = [
    { id: 1, name: 'Alice', email: 'alice@example.com', major: 'CS', role: 'student', address: 'Street 1' },
    { id: 2, name: 'Bob', email: 'bob@example.com', major: 'Math', role: 'lecturer', address: 'Street 2' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', major: 'Physics', role: 'admin', address: 'Street 3' },
  ];

  const mockCurrentUser = { role: 'admin' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters users based on search term', () => {
    const { result } = renderHook(() =>
      useUsers(mockUsers, mockCurrentUser)
    );

    act(() => {
      result.current.handleChange({ target: { value: 'bob' } });
    });

    expect(result.current.filteredUsers).toHaveLength(1);
    expect(result.current.filteredUsers[0].name).toBe('Bob');
  });

  it('paginates users correctly', () => {
    const { result } = renderHook(() =>
      useUsers(mockUsers, mockCurrentUser, 2)
    );

    expect(result.current.paginatedUsers).toHaveLength(2);
    act(() => {
      result.current.handlePageChange(2);
    });

    expect(result.current.paginatedUsers).toHaveLength(1);
  });

  it('updates items per page and resets page', () => {
    const { result } = renderHook(() =>
      useUsers(mockUsers, mockCurrentUser, 1)
    );

    act(() => {
      result.current.handleItemsPerPageChange({ target: { value: 3 } });
    });

    expect(result.current.itemsPerPage).toBe(3);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedUsers).toHaveLength(3);
  });

  it('deletes user if permitted and confirmed', async () => {
    rbac.canUseAction.mockReturnValue(true);
    global.confirm.mockReturnValue(true);
    axios.delete.mockResolvedValue({});

    const { result } = renderHook(() =>
      useUsers(mockUsers, mockCurrentUser)
    );

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(axios.delete).toHaveBeenCalledWith('/api/users/1');
    expect(result.current.users.find((u) => u.id === 1)).toBeUndefined();
  });

  it('does not delete user if not permitted', async () => {
    rbac.canUseAction.mockReturnValue(false);

    const { result } = renderHook(() =>
      useUsers(mockUsers, mockCurrentUser)
    );

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(axios.delete).not.toHaveBeenCalled();
  });

  it('does not delete user if confirmation is cancelled', async () => {
    rbac.canUseAction.mockReturnValue(true);
    global.confirm.mockReturnValue(false);

    const { result } = renderHook(() =>
      useUsers(mockUsers, mockCurrentUser)
    );

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(axios.delete).not.toHaveBeenCalled();
  });
});
