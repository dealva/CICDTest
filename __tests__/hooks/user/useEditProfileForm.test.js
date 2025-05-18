import { renderHook, act, waitFor } from '@testing-library/react';
import useEditProfileForm from '@/hooks/user/useEditProfileForm';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// Mock modules
jest.mock('next-auth/react');
jest.mock('axios');

// Mock redirect
const redirectMock = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: (...args) => redirectMock(...args),
}));

describe('useEditProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login if no session', () => {
    useSession.mockReturnValue({ data: null, status: 'authenticated' });

    renderHook(() => useEditProfileForm());

    expect(redirectMock).toHaveBeenCalledWith('/login');
  });

  it('fetches user data and updates form state', async () => {
    const mockData = {
      major: 'Computer Science',
      bio: 'Love coding',
      address: '123 Street',
    };

    useSession.mockReturnValue({
      data: { user: { email: 'john@example.com', role: 'student' } },
      status: 'authenticated',
    });

    axios.get.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useEditProfileForm());

    await waitFor(() => {
      expect(result.current.formData.major).toBe(mockData.major);
    });

    expect(axios.get).toHaveBeenCalledWith('/api/user/data/john@example.com');
  });

  it('updates form state on input change', () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com', role: 'student' } },
      status: 'authenticated',
    });

    const { result } = renderHook(() => useEditProfileForm());

    act(() => {
      result.current.handleInputChange({
        target: { name: 'major', value: 'Engineering' },
      });
    });

    expect(result.current.formData.major).toBe('Engineering');
  });

  it('handles file change', () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com', role: 'student' } },
      status: 'authenticated',
    });

    const file = new File(['image'], 'photo.png', { type: 'image/png' });

    const { result } = renderHook(() => useEditProfileForm());

    act(() => {
      result.current.handleFileChange({ target: { files: [file] } });
    });

    expect(result.current.formData.photo).toBe(file);
  });

  it('submits the form and redirects to dashboard', async () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com', role: 'student' } },
      status: 'authenticated',
    });

    axios.put.mockResolvedValue({});

    const { result } = renderHook(() => useEditProfileForm());

    act(() => {
      result.current.handleInputChange({
        target: { name: 'major', value: 'Math' },
      });
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });

    expect(axios.put).toHaveBeenCalled();
    expect(redirectMock).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects to dashboard on cancel', () => {
    useSession.mockReturnValue({
      data: { user: { email: 'test@example.com', role: 'student' } },
      status: 'authenticated',
    });

    const { result } = renderHook(() => useEditProfileForm());

    act(() => {
      result.current.handleCancel();
    });

    expect(redirectMock).toHaveBeenCalledWith('/dashboard');
  });
});
