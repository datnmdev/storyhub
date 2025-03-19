import { createSlice } from '@reduxjs/toolkit';
import { Auth } from './auth.type';
import { AUTH_KEY } from '@constants/user.constants';
import Cookies from 'js-cookie';

const initialState: Auth = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: AUTH_KEY,
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    signIn: (state) => {
      state.isAuthenticated = true;
    },
    signOut: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const authReducer = authSlice.reducer;
export default authReducer;
