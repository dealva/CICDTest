import { renderHook, act } from '@testing-library/react';
import useAddProfileForm from '@/hooks/user/useAddProfileForm';
import { toast } from 'react-toastify';

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock redirect
const redirectMock = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: (...args) => redirectMock(...args),
}));

describe('useAddProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default form data and loading false', () => {
    const { result } = renderHook(() => useAddProfileForm());
    expect(result.current.formData.name).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('updates formData on input change', () => {
    const { result } = renderHook(() => useAddProfileForm());
    act(() => {
      result.current.handleInputChange({
        target: { name: 'name', value: 'John Doe' },
      });
    });
    expect(result.current.formData.name).toBe('John Doe');
  });

  it('shows error toast if passwords do not match', async () => {
    const { result } = renderHook(() => useAddProfileForm());
    act(() => {
      result.current.handleInputChange({ target: { name: 'password', value: '123456' } });
      result.current.handleInputChange({ target: { name: 'confirmPassword', value: 'wrong' } });
    });
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });
    expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
  });

  it('submits data successfully and redirects to dashboard', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ success: true }),
    };
    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    const { result } = renderHook(() => useAddProfileForm());
    act(() => {
      result.current.handleInputChange({ target: { name: 'name', value: 'Jane' } });
      result.current.handleInputChange({ target: { name: 'email', value: 'jane@example.com' } });
      result.current.handleInputChange({ target: { name: 'password', value: '123456' } });
      result.current.handleInputChange({ target: { name: 'confirmPassword', value: '123456' } });
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    expect(fetch).toHaveBeenCalledWith('/api/user/add', expect.anything());
    expect(toast.success).toHaveBeenCalledWith('User added successfully!');
    expect(redirectMock).toHaveBeenCalledWith('/dashboard');
  });

  it('shows error if fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    const { result } = renderHook(() => useAddProfileForm());
    act(() => {
      result.current.handleInputChange({ target: { name: 'password', value: '123456' } });
      result.current.handleInputChange({ target: { name: 'confirmPassword', value: '123456' } });
    });
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });

  it('redirects to dashboard on cancel', () => {
    const { result } = renderHook(() => useAddProfileForm());
    act(() => {
      result.current.handleCancel();
    });
    expect(redirectMock).toHaveBeenCalledWith('/dashboard');
  });
});
