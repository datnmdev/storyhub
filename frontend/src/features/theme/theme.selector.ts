import { AppRootState } from '@store/store.type';

const themeSelector = {
  selectValue: (state: AppRootState) => state.theme.value,
};

export default themeSelector;
