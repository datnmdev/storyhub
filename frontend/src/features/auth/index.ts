import authAction from './auth.action';
import authReducer from './auth.reducer';
import authSelector from './auth.selector';
import authThunk from './auth.thunk';

const authFeature = {
  authReducer,
  authSelector,
  authAction,
  authThunk,
};

export default authFeature;
