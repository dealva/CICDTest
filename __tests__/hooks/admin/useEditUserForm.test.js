import { renderHook, act } from '@testing-library/react';
import useEditUserForm from '@/hooks/admin/useEditUserForm';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock redirect instead of useRouter
const redirectMock = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: (...args) => redirectMock(...args),
}));

jest.mock('@/utils/rbac', () => ({
  canUseAction: jest.fn(() => true),
}));

describe('useEditUserForm', () => {
  const initialUser = {
    id: 'user123',
    name: 'John Doe',
    major: 'Computer Science',
    bio: 'I love coding',
    address: '123 Main St',
    role: 'student',
  };

  beforeEach(() => {
    fetch.resetMocks?.();
    jest.clearAllMocks();
  });

  it('submits form and shows success toast on success', async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: 'Updated' }), { status: 200 });

    const { result } = renderHook(() => useEditUserForm(initialUser, 'admin'));

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    expect(fetch).toHaveBeenCalledWith('/api/users/user123', expect.any(Object));
    expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
    expect(redirectMock).toHaveBeenCalledWith('/dashboard');
  });

  it('shows error toast on failed response', async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: 'Error' }), { status: 400 });

    const { result } = renderHook(() => useEditUserForm(initialUser, 'admin'));

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    expect(toast.error).toHaveBeenCalledWith('Error');
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it('shows error toast on exception', async () => {
    fetch.mockRejectOnce(new Error('Network error'));

    const { result } = renderHook(() => useEditUserForm(initialUser, 'admin'));

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    expect(toast.error).toHaveBeenCalledWith('Network error');
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
