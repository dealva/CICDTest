// __tests__/hooks/dashboard/websocket/useDashboardSocket.test.js

import { renderHook, act } from '@testing-library/react';
import useDashboardSocket from '@/hooks/dashboard/websocket/useDashboardSocket';

// Create a mock socket instance we can inspect
const socketMock = {
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
};

// Mock useSocket globally for this test file
jest.mock('@/contexts/websocket/client', () => ({
  useSocket: () => socketMock,
}));

describe('useDashboardSocket', () => {
  beforeEach(() => {
    // Reset mock calls, not modules
    jest.clearAllMocks();
  });

  it('should register and clean up socket event listener', () => {
    const { unmount } = renderHook(() => useDashboardSocket('john'));
    expect(socketMock.on).toHaveBeenCalledWith('event', expect.any(Function));

    unmount();
    expect(socketMock.off).toHaveBeenCalledWith('event');
  });

  it('should send socket message when sendEvent is called', () => {
    const { result } = renderHook(() => useDashboardSocket('john'));

    act(() => {
      result.current.sendEvent();
    });

    expect(socketMock.emit).toHaveBeenCalledWith('event', {
      message: 'Hello from Dashboard! to john',
    });
  });
});
