import { memo } from 'react';
import { Location, Navigate, useLocation } from 'react-router-dom';
import { ProtectedProps } from './Protected.type';
import paths from '@routers/router.path';
import { LocationState } from '@type/reactRouterDom.type';
import { useAppSelector } from '@hooks/redux.hook';
import authFeature from '@features/auth';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@type/jwt.type';
import { ForbiddenError } from '@utilities/error.util';
import Cookies from 'js-cookie';

function Protected({ children, role, enable = true }: ProtectedProps) {
  const location: Location<LocationState> = useLocation();
  const isAuthenticated = useAppSelector(
    authFeature.authSelector.selectAuthenticated
  );

  if (enable) {
    if (isAuthenticated) {
      const tokenJson = Cookies.get('accessToken');
      if (tokenJson) {
        const payload = jwtDecode(tokenJson) as JwtPayload;
        if (payload.role != role) {
          throw ForbiddenError();
        }
      }
    } else {
      return (
        <Navigate
          to={paths.signInPage()}
          replace
          state={{
            from: location.pathname,
            role,
          }}
        />
      );
    }
  }

  return children;
}

export default memo(Protected);
