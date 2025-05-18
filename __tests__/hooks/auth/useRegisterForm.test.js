import { renderHook, act } from '@testing-library/react';
import useRegisterForm from '@/hooks/auth/useRegisterForm';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(() => Promise.resolve({ ok: true })),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/contexts/csrf-token/client', () => ({
  useCsrfToken: () => 'test-csrf-token',
}));

jest.mock('next-recaptcha-v3', () => ({
  useReCaptcha: () => ({
    executeRecaptcha: jest.fn(() => Promise.resolve('recaptcha-token')),
  }),
}));

jest.mock('@/lib/validators', () => ({
  registerValidator: {
    validate: jest.fn(() => Promise.resolve()),
  },
}));

describe('useRegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default form values', () => {
    const { result } = renderHook(() => useRegisterForm());
    expect(result.current.formData).toEqual({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    expect(result.current.loading).toBe(false);
  });

  it('should update formData on handleChange', () => {
    const { result } = renderHook(() => useRegisterForm());

    act(() => {
      result.current.handleChange({ target: { name: 'email', value: 'test@example.com' } });
    });

    expect(result.current.formData.email).toBe('test@example.com');
  });

  it('should submit form successfully and redirect', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.any(Object));
  });

  it('should handle registration error', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Registration failed' }),
      })
    );

    const { result } = renderHook(() => useRegisterForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    const { toast } = require('react-toastify');
    expect(toast.error).toHaveBeenCalledWith('Registration failed');
  });
});
