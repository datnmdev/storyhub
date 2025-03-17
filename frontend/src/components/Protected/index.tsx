import { memo, useEffect } from 'react';
import { Location, Navigate, useLocation } from 'react-router-dom';
import { ProtectedProps } from './Protected.type';
import paths from '@routers/router.path';
import { LocationState } from '@type/reactRouterDom.type';
import { useAppSelector } from '@hooks/redux.hook';
import authFeature from '@features/auth';
import { TOKEN_KEY } from '@constants/auth.constants';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '@type/jwt.type';
import { ForbiddenError } from '@utilities/error.util';

function Protected({ children, role }: ProtectedProps) {
  const location: Location<LocationState> = useLocation();
  const isAuthenticated = useAppSelector(
    authFeature.authSelector.selectAuthenticated
  );

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  if (isAuthenticated) {
    const tokenJson = localStorage.getItem(TOKEN_KEY);
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

  return children;
}

export default memo(Protected);
