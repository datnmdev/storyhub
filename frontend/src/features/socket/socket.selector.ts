import { AppRootState } from '@store/store.type';

const socketSelector = {
  selectAll: (state: AppRootState) => state.socket,
};

export default socketSelector;
