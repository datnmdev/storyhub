import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Auth } from './auth.type';
import { AUTH_KEY } from '@constants/user.constants';
import Cookies from 'js-cookie';

const initialState: Auth = {
  isAuthenticated: null,
  user: null,
};

export const authSlice = createSlice({
  name: AUTH_KEY,
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    signIn: (state, action) => {
      Cookies.set('accessToken', action.payload.accessToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'None',
        expires: 7200 / (60 * 60 * 24),
      });
      Cookies.set('refreshToken', action.payload.refreshToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'None',
        expires: 2592000 / (60 * 60 * 24),
      });
      state.isAuthenticated = true;
    },
    signOut: (state) => {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      state.isAuthenticated = false;
    },
  },
});

export const authReducer = authSlice.reducer;
export default authReducer;
