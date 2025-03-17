import { AppDispatch, AppRootState, Store } from '@store/store.type';
import { useDispatch, useSelector, useStore } from 'react-redux';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<AppRootState>();
export const useAppStor = useStore.withTypes<Store>();
