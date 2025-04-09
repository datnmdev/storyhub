import apis from '@apis/index';
import { NotificationStatus } from '@constants/notification.constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import store from '@store/index';

const notificationThunk = {
  getAllNotification: createAsyncThunk(
    'notification/getAllNotification',
    async () => {
      const res = await apis.notificationApi.getNotificationWithFilter({
        queries: {
          orderBy: JSON.stringify([
            ['createdAt', 'DESC'],
            ['updatedAt', 'DESC'],
          ]),
          page: store.getState().notification.allNotifications.pagination.page,
          limit:
            store.getState().notification.allNotifications.pagination.limit,
        },
      });
      return res.data;
    }
  ),
  getAllUnSeenNotifications: createAsyncThunk(
    'notification/getAllUnSeenNotifications',
    async () => {
      const res = await apis.notificationApi.getNotificationWithFilter({
        queries: {
          status: JSON.stringify([NotificationStatus.SENT]),
          orderBy: JSON.stringify([
            ['createdAt', 'DESC'],
            ['updatedAt', 'DESC'],
          ]),
          page: store.getState().notification.allUnSeenNotifications.pagination
            .page,
          limit:
            store.getState().notification.allUnSeenNotifications.pagination
              .limit,
        },
      });
      return res.data;
    }
  ),
  updateNotification: createAsyncThunk(
    'notification/updateNotification',
    async (body: any) => {
      const res = await apis.notificationApi.updateNotification({
        body,
      });
      store.dispatch(notificationThunk.getAllNotification());
      store.dispatch(notificationThunk.getAllUnSeenNotifications());
      return res.data;
    }
  ),
  deleteNotificationById: createAsyncThunk(
    'notification/deleteNotificationById',
    async (id: number) => {
      const res = await apis.notificationApi.deleteNotificationById({
        queries: {
          id,
        },
      });
      store.dispatch(notificationThunk.getAllNotification());
      store.dispatch(notificationThunk.getAllUnSeenNotifications());
      return res.data;
    }
  ),
  deleteAllNotification: createAsyncThunk(
    'notification/deleteAllNotification',
    async () => {
      const res = await apis.notificationApi.deleteAllNotification();
      store.dispatch(notificationThunk.getAllNotification());
      store.dispatch(notificationThunk.getAllUnSeenNotifications());
      return res.data;
    }
  ),
};

export default notificationThunk;
