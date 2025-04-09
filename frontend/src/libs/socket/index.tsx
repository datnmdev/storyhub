import {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren,
  useRef,
} from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAppSelector } from '@hooks/redux.hook';
import socketFeature from '@features/socket';
import { SocketState } from '@features/socket/socket.reducer';
import store from '@store/index';
import notificationFeature from '@features/notification';
import NotificationRingtone from '@assets/audio/notification_ringtone.mp3';

const WebSocketContext = createContext<Socket | null>(null);

function WebSocketProvider({ children }: PropsWithChildren) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketState: SocketState = useAppSelector(
    socketFeature.socketSelector.selectAll
  );
  const audioRef = useRef<HTMLAudioElement>(null);

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

  useEffect(() => {
    if (socket) {
      store.dispatch(
        notificationFeature.notificationThunk.getAllNotification()
      );
      store.dispatch(
        notificationFeature.notificationThunk.getAllUnSeenNotifications()
      );
      socket.on('notification', () => {
        store.dispatch(
          notificationFeature.notificationThunk.getAllNotification()
        );
        store.dispatch(
          notificationFeature.notificationThunk.getAllUnSeenNotifications()
        );
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.error('Error playing audio:', error);
          });
        }
      });
    }
  }, [socket]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
      <audio ref={audioRef} src={NotificationRingtone} preload="auto" hidden />
    </WebSocketContext.Provider>
  );
}

export default WebSocketProvider;

export const useWebSocket = () => useContext(WebSocketContext);
