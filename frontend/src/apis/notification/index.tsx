import { RequestInit } from '@apis/api.type';
import { NotificationStatus } from '@constants/notification.constants';
import axiosInstance from 'libs/axios';

export interface Notification {
  receiverId: number;
  notificationId: number;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
  notification: {
    id: number;
    type: string;
    referenceId: number;
    reference: any;
  };
}

const notificationApi = {
  getNotificationWithFilter: (options: RequestInit) => {
    return axiosInstance().get('/notification/filter', {
      params: options.queries,
    });
  },
  updateNotification: (options: RequestInit) => {
    return axiosInstance().put('/notification', options.body);
  },
  deleteNotificationById: (options: RequestInit) => {
    return axiosInstance().delete('/notification', {
      params: options.queries,
    });
  },
  deleteAllNotification: () => {
    return axiosInstance().delete('/notification/delete-all');
  },
};

export default notificationApi;
