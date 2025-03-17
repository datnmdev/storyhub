import { createSlice } from '@reduxjs/toolkit';
import { Auth } from './auth.type';
import { TOKEN_KEY, AUTH_KEY } from '@constants/auth.constants';

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
    saveToken: (state, action) => {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(action.payload));
    },
    signIn: (state, action) => {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(action.payload));
      state.isAuthenticated = true;
    },
    signOut: (state) => {
      localStorage.removeItem(TOKEN_KEY);
      state.isAuthenticated = false;
    },
  },
});

export const authReducer = authSlice.reducer;
export default authReducer;
