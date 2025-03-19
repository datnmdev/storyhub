import { memo } from 'react';
import { ErrorMessageProps } from './ErrorMessage.type';

function ErrorMessage({ message }: ErrorMessageProps) {
  return <p className="text-red-500 py-0.5 animate-fadeIn">{message}</p>;
}

export default memo(ErrorMessage);
