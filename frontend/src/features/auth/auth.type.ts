import { Gender } from '@constants/user.constants';

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  name: string;
  dob: Date | null;
  gender: Gender | null;
  phone: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Auth {
  isAuthenticated: boolean | null;
  user: User | null;
}
