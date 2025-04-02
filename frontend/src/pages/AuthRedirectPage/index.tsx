import Loading from '@components/Loading';
import RedirectUtils from '@utilities/redirect.util';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Role } from '@constants/user.constants';
import { useDispatch } from 'react-redux';
import authFeature from '@features/auth';
import socketFeature from '@features/socket';

function AuthRedirectPage() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access-token');
    const refreshToken = params.get('refresh-token');

    if (accessToken && refreshToken) {
      dispatch(authFeature.authAction.signIn({ accessToken, refreshToken }));
      dispatch(
        socketFeature.socketAction.setCreateNewConnection({
          isCreateNewConnection: true,
        })
      );
    }
    const preUrl = {
      url: params.get('url') || '',
      role: params.get('role') as Role,
    };
    window.location.href = RedirectUtils.getRedirectUriBelongTo(
      accessToken || '',
      preUrl
    );
  }, []);

  return <Loading message="Đang chuyển hướng..." />;
}

export default AuthRedirectPage;
