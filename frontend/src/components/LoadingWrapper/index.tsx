import { memo } from 'react';
import { LoadingWrapperProps } from './LoadingWrapper.type';
import Loading from '@components/Loading';

function LoadingWrapper({
  level = 'page',
  isLoading = false,
  message,
  backgroundVisible = 'frog',
  children,
}: LoadingWrapperProps) {
  if (isLoading && level === 'component') {
    return (
      <Loading
        level={level}
        message={message}
        backgroundVisible={backgroundVisible}
      />
    );
  }

  return (
    <div className="h-full">
      <div className="h-full">{children}</div>

      {isLoading && (
        <Loading
          level={level}
          message={message}
          backgroundVisible={backgroundVisible}
        />
      )}
    </div>
  );
}

export default memo(LoadingWrapper);
