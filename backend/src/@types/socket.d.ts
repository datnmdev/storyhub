import { Socket } from 'socket.io';
import { User } from './express';

declare module 'socket.io' {
  interface Socket {
    user?: User;
  }
}
