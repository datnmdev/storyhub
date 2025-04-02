import socketAction from './socket.action';
import socketReducer from './socket.reducer';
import socketSelector from './socket.selector';

const socketFeature = {
  socketReducer,
  socketSelector,
  socketAction,
};

export default socketFeature;
