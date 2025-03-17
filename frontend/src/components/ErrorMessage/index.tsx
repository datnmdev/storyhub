import { memo } from 'react';
import { ErrorMessageProps } from './type';

function ErrorMessage({ message }: ErrorMessageProps) {
  return <p className="text-red-500 py-0.5">{message}</p>;
}

export default memo(ErrorMessage);
