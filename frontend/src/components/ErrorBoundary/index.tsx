import { memo } from 'react';
import NotFoundPage from './components/NotFoundPage';
import { useRouteError } from 'react-router-dom';
import { HttpStatus } from '@constants/http.constants';
import ForbiddenPage from './components/ForbiddenPage';
import {
  AppErrorResponse,
  ForbiddenError,
  NotFoundError,
} from '@utilities/error.util';

function ErrorBoundary() {
  const error = useRouteError() as AppErrorResponse;

  if (error.status === HttpStatus.FORBIDDEN) {
    return <ForbiddenPage error={ForbiddenError()} />;
  }

  return <NotFoundPage error={NotFoundError()} />;
}

export default memo(ErrorBoundary);
