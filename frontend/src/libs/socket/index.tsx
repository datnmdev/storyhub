import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
} from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAppSelector } from '@hooks/redux.hook';
import socketFeature from '@features/socket';
import { SocketState } from '@features/socket/socket.reducer';

const WebSocketContext = createContext<Socket | null>(null);

function WebSocketProvider({ children }: PropsWithChildren) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketState: SocketState = useAppSelector(
    socketFeature.socketSelector.selectAll
  );

  useEffect(() => {
    if (socketState.isCreateNewConnection) {
      const newSocket = io(import.meta.env.VITE_WS_URL, {
        transports: ['websocket'],
        auth: {
          token: Cookies.get('accessToken'),
        },
        reconnection: true,
        reconnectionDelay: 5000,
        reconnectionAttempts: Infinity,
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket.IO connected:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        console.log('🔌 Socket.IO disconnected');
      });

      newSocket.on('connect_error', (err) => {
        console.error('❌ Socket.IO connection error:', err);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [socketState]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}

export default WebSocketProvider;

export const useWebSocket = () => useContext(WebSocketContext);
