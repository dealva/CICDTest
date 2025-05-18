import { requireSession, jsonResponse, errorResponse } from '@/lib/api';
import { getServerSession } from 'next-auth';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('requireSession', () => {
  it('should return session if authenticated', async () => {
    const mockSession = { user: { id: 1, name: 'Test User' } };
    getServerSession.mockResolvedValueOnce(mockSession);

    const result = await requireSession();
    expect(result).toEqual(mockSession);
  });

  it('should throw 401 if not authenticated', async () => {
    getServerSession.mockResolvedValueOnce(null);

    await expect(requireSession()).rejects.toEqual({
      status: 401,
      message: 'Not authenticated',
    });
  });
});

describe('jsonResponse', () => {
  it('should return JSON response with correct status', async () => {
    const res = jsonResponse({ success: true }, 201);
    expect(res.status).toBe(201);

    const data = await res.json();
    expect(data).toEqual({ success: true });
  });
});

describe('errorResponse', () => {
  it('should return error response with correct status and message', async () => {
    const res = errorResponse('Something went wrong', 500);
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data).toEqual({ message: 'Something went wrong' });
  });
});
