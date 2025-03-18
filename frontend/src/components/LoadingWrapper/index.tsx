import { memo } from 'react';
import { LoadingWrapperProps } from './LoadingWrapper.type';
import Loading from '@components/Loading';

function LoadingWrapper({ isLoading = false, children }: LoadingWrapperProps) {
  return (
    <div>
      <div>{children}</div>

      {isLoading && <Loading backgroundVisible="frog" />}
    </div>
  );
}

export default memo(LoadingWrapper);
