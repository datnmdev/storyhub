import { memo } from 'react';
import { ToastProps } from './Toast.type';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import './Toast.style.scss';

const icons = {
  success: 'fas fa-check-circle',
  info: 'fas fa-info-circle',
  warning: 'fas fa-exclamation-circle',
  error: 'fas fa-exclamation-circle',
};

function Toast({ id, type, title, description }: ToastProps) {
  const dispatch = useAppDispatch();

  return (
    <div
      className={`toast toast--${type}`}
      style={{
        animation: `slideInLeft ease 0.5s, fadeOut linear 1s 4s forwards`,
      }}
    >
      <div className="toast__icon">
        <i className={`${icons[type]}`}></i>
      </div>
      <div className="toast__body">
        <h3 className="toast__title">{title}</h3>
        <p className="toast__msg">{description}</p>
      </div>
      <div
        className="toast__close"
        onClick={() => dispatch(toastFeature.toastAction.remove(id))}
      >
        <i className="fas fa-times"></i>
      </div>
    </div>
  );
}

export default memo(Toast);
