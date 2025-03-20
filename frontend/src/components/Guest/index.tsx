import { memo, useEffect } from 'react';
import { GuestProps } from './Guest.type';
import { useAppSelector } from '@hooks/redux.hook';
import authFeature from '@features/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import RedirectUtils from '@utilities/redirect.util';

function Guest({ children }: GuestProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector(
    authFeature.authSelector.selectAuthenticated
  );

  useEffect(() => {
    const tokenString = Cookies.get('accessToken');
    if (tokenString) {
      navigate(
        RedirectUtils.getRedirectUriBelongTo(tokenString, {
          url: location.state?.from || '',
          role: location.state?.role || 'guest',
        })
      );
    }
  }, [isAuthenticated]);

  return children;
}

export default memo(Guest);
