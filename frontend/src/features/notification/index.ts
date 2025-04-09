import notificationAction from './notification.action';
import notificationReducer from './notification.reducer';
import notificationSelector from './notification.selector';
import notificationThunk from './notification.thunk';

const notificationFeature = {
  notificationReducer,
  notificationSelector,
  notificationAction,
  notificationThunk,
};

export default notificationFeature;
