import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SOCKET_KEY } from '@constants/socket.constants';

export interface SocketState {
  isCreateNewConnection: boolean;
}

const initialState: SocketState = {
  isCreateNewConnection: true,
};

export const socketSlice = createSlice({
  name: SOCKET_KEY,
  initialState,
  reducers: {
    setCreateNewConnection: (_state, action: PayloadAction<SocketState>) => {
      return action.payload;
    },
  },
});

export const socketReducer = socketSlice.reducer;
export default socketReducer;
