import { createSlice } from '@reduxjs/toolkit';
import { Toast } from './toast.type';
import { TOAST_KEY } from '@constants/toast.constants';

const initialState: Toast[] = [];

export const toastSlice = createSlice({
  name: TOAST_KEY,
  initialState,
  reducers: {
    add: (state, action) => {
      state.push({
        ...action.payload,
        id: state.length === 0 ? 0 : state[state.length - 1].id + 1,
      });
    },
    remove: (state, action) => {
      const index = state.findIndex((toast) => toast.id === action.payload);
      state.splice(index, 1);
    },
  },
});

const toastReducer = toastSlice.reducer;
export default toastReducer;
