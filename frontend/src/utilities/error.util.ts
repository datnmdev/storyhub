import { HttpStatus, HttpStatusText } from '@constants/http.constants';
import i18n from '@i18n/index';
import { ErrorResponse } from 'react-router-dom';

export interface AppErrorResponse extends ErrorResponse {
  data: {
    message: string;
  };
}

export const ForbiddenError: () => AppErrorResponse = () => ({
  status: HttpStatus.FORBIDDEN,
  statusText: HttpStatusText.FORBIDDEN,
  data: {
    message: i18n.t('errorPage.forbiddenPage.message'),
  },
});

export const NotFoundError: () => AppErrorResponse = () => ({
  status: HttpStatus.NOT_FOUND,
  statusText: HttpStatusText.NOT_FOUND,
  data: {
    message: i18n.t('errorPage.notFoundPage.message'),
  },
});
