import { AppRootState } from '@store/store.type';

const notificationSelector = {
  selectAllNotifications: (state: AppRootState) =>
    state.notification.allNotifications,
  selectAllUnSeenNotifications: (state: AppRootState) =>
    state.notification.allUnSeenNotifications,
};

export default notificationSelector;
