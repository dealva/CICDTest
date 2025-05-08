import { useCallback, useEffect } from 'react';
import { useSocket } from '@/contexts/websocket/client';

export default function useDashboardSocket(username) {
  const socket = useSocket();

  const sendEvent = useCallback(() => {
    socket.emit('event', { message: `Hello from Dashboard! to ${username}` });
  }, [socket, username]);

  useEffect(() => {
    socket.on('event', (data) => {
      console.log('Message :', data);
    });

    return () => {
      socket.off('event');
    };

  }, [socket]);

  return { sendEvent };
}
