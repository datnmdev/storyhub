import authFeature from '@features/auth';
import notificationFeature from '@features/notification';
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
    notification: notificationFeature.notificationReducer,
  },
});

export default store;
