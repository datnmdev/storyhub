import { createSlice } from '@reduxjs/toolkit';
import { ThemeState } from './theme.type';
import { Theme, THEME_KEY } from '@constants/theme.constants';

const initialState: ThemeState = {
  value: localStorage.getItem(THEME_KEY) || Theme.LIGHT,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggle: (state) => {
      if (state.value === Theme.LIGHT) {
        state.value = Theme.DARK;
      } else {
        state.value = Theme.LIGHT;
      }
      localStorage.setItem(THEME_KEY, state.value);
    },
  },
});

const themeReducer = themeSlice.reducer;

export default themeReducer;
