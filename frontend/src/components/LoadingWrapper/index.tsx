import { memo } from 'react';
import { LoadingWrapperProps } from './LoadingWrapper.type';
import Loading from '@components/Loading';

function LoadingWrapper({
  isLoading = false,
  message,
  backgroundVisible = 'frog',
  children,
}: LoadingWrapperProps) {
  return (
    <div>
      <div>{children}</div>

      {isLoading && (
        <Loading message={message} backgroundVisible={backgroundVisible} />
      )}
    </div>
  );
}

export default memo(LoadingWrapper);
