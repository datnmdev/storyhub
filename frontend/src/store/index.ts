import authFeature from '@features/auth';
import themeFeature from '@features/theme';
import toastFeature from '@features/toast';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    theme: themeFeature.themeReducer,
    auth: authFeature.authReducer,
    toast: toastFeature.toastReducer,
  },
});

export default store;
