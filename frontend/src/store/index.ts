import authFeature from '@features/auth';
import socketFeature from '@features/socket';
import themeFeature from '@features/theme';
import toastFeature from '@features/toast';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    socket: socketFeature.socketReducer,
    theme: themeFeature.themeReducer,
    auth: authFeature.authReducer,
    toast: toastFeature.toastReducer,
  },
});

export default store;
