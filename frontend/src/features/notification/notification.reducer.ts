import { NOTIFICATION_KEY } from '@constants/notification.constants';
import { createSlice } from '@reduxjs/toolkit';
import notificationThunk from './notification.thunk';

export interface NotificationState {
  allNotifications: {
    data: Notification[];
    total: number;
    pagination: {
      page: number;
      limit: number;
    };
    isLoading: boolean;
    error: any;
  };
  allUnSeenNotifications: {
    data: Notification[];
    total: number;
    pagination: {
      page: number;
      limit: number;
    };
    isLoading: boolean;
    error: any;
  };
}

const initialState: NotificationState = {
  allNotifications: {
    data: [],
    total: 0,
    pagination: {
      page: 1,
      limit: 12,
    },
    isLoading: false,
    error: false,
  },
  allUnSeenNotifications: {
    data: [],
    total: 0,
    pagination: {
      page: 1,
      limit: 12,
    },
    isLoading: false,
    error: false,
  },
};

export const notificationSlice = createSlice({
  name: NOTIFICATION_KEY,
  initialState,
  reducers: {
    setAllNotificationPagination: (state, action) => {
      state.allNotifications.pagination = action.payload;
    },
    setAllUnSeenNotificationPagination: (state, action) => {
      state.allUnSeenNotifications.pagination = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(notificationThunk.getAllNotification.pending, (state) => {
        state.allNotifications.isLoading = true;
      })
      .addCase(
        notificationThunk.getAllNotification.fulfilled,
        (state, action) => {
          state.allNotifications.isLoading = false;
          state.allNotifications.data = action.payload[0];
          state.allNotifications.total = action.payload[1];
        }
      )
      .addCase(
        notificationThunk.getAllNotification.rejected,
        (state, payload) => {
          state.allNotifications.isLoading = false;
          state.allNotifications.error = payload.error;
        }
      )
      .addCase(notificationThunk.getAllUnSeenNotifications.pending, (state) => {
        state.allUnSeenNotifications.isLoading = true;
      })
      .addCase(
        notificationThunk.getAllUnSeenNotifications.fulfilled,
        (state, action) => {
          state.allUnSeenNotifications.isLoading = false;
          state.allUnSeenNotifications.data = action.payload[0];
          state.allUnSeenNotifications.total = action.payload[1];
        }
      )
      .addCase(
        notificationThunk.getAllUnSeenNotifications.rejected,
        (state, payload) => {
          state.allUnSeenNotifications.isLoading = false;
          state.allUnSeenNotifications.error = payload.error;
        }
      );
  },
});

export const notificationReducer = notificationSlice.reducer;
export default notificationReducer;
