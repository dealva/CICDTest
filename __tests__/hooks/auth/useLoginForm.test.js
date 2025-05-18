import { renderHook, act } from '@testing-library/react';
import useLoginForm from '@/hooks/auth/useLoginForm';

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

jest.mock('next-recaptcha-v3', () => ({
  useReCaptcha: () => ({
    executeRecaptcha: jest.fn(() => Promise.resolve('recaptcha-token')),
  }),
}));

jest.mock('@/lib/validators', () => ({
  loginValidator: {
    validate: jest.fn(() => Promise.resolve()),
  },
}));

describe('useLoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default form values', () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.formData).toEqual({ email: '', password: '' });
    expect(result.current.loading).toBe(false);
  });

  it('updates formData on handleChange', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'user@example.com' },
      });
    });

    expect(result.current.formData.email).toBe('user@example.com');
  });

  it('submits login successfully', async () => {
    global.fetch = jest.fn(); // unnecessary but safe fallback

    const { result } = renderHook(() => useLoginForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    const { toast } = require('react-toastify');
    expect(toast.success).toHaveBeenCalledWith('Login successful');
  });

  it('handles login failure', async () => {
    const { signIn } = require('next-auth/react');
    signIn.mockImplementationOnce(() =>
      Promise.resolve({ ok: false, error: 'Invalid credentials' })
    );

    const { result } = renderHook(() => useLoginForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    const { toast } = require('react-toastify');
    expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
  });

  it('handles validation error', async () => {
    const { loginValidator } = require('@/lib/validators');
    loginValidator.validate.mockImplementationOnce(() =>
      Promise.reject(new Error('Validation failed'))
    );

    const { result } = renderHook(() => useLoginForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} });
    });

    const { toast } = require('react-toastify');
    expect(toast.error).toHaveBeenCalledWith(expect.any(Error));
  });
});
