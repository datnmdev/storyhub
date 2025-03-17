import { ToastType } from '@constants/toast.constants';

export interface Toast {
  id?: number;
  type: ToastType;
  title: string;
  description?: string;
}
