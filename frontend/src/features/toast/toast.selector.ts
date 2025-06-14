import { AppRootState } from '@store/store.type';

const toastSelector = {
  selectAll: (state: AppRootState) => state.toast,
};

export default toastSelector;
