import { AppRootState } from '@store/store.type';

const authSelector = {
  selectAuthenticated: (state: AppRootState) => state.auth.isAuthenticated,
  selectUser: (state: AppRootState) => state.auth.user,
};

export default authSelector;
