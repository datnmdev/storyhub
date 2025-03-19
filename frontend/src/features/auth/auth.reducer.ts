import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Auth, Token } from './auth.type';
import { AUTH_KEY } from '@constants/user.constants';

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
