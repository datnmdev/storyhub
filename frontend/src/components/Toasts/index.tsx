import toastFeature from '@features/toast';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import { memo, useEffect, useState } from 'react';
import { ToastProps } from './components/Toast/Toast.type';
import Toast from './components/Toast';

function Toasts() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(toastFeature.toastSelector.selectAll);
  const [lastToast, setLastToast] = useState<ToastProps | null>(null);

  useEffect(() => {
    if (toasts.length > 0) {
      if (lastToast) {
        if (lastToast.id != toasts[toasts.length - 1].id) {
          setLastToast(toasts[toasts.length - 1]);
          setTimeout(
            () => {
              dispatch(
                toastFeature.toastAction.remove(toasts[toasts.length - 1].id)
              );
            },
            4000 + toasts[toasts.length - 1].id * 500
          );
        }
      } else {
        setLastToast(toasts[0]);
        setTimeout(
          () => {
            dispatch(toastFeature.toastAction.remove(toasts[0].id));
          },
          4000 + toasts[0].id * 500
        );
      }
    } else {
      setLastToast(null);
    }
  }, [toasts]);

  return (
    <div className="desktop:w-[450px] tablet:w-[350px] mobile:w-[100vw] fixed top-8 desktop:right-8 tablet:right-4 mobile:right-0 z-[999]">
      {toasts &&
        toasts.map((toast: ToastProps) => {
          return (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              title={toast.title}
              description={toast.description}
            />
          );
        })}
    </div>
  );
}

export default memo(Toasts);
