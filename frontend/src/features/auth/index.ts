import authAction from './auth.action';
import authReducer from './auth.reducer';
import authSelector from './auth.selector';

const authFeature = {
  authReducer,
  authSelector,
  authAction,
};

export default authFeature;
