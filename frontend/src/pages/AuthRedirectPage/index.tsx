import Loading from '@components/Loading';
import RedirectUtils from '@utilities/redirect.util';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Role } from '@constants/user.constants';
import { useDispatch } from 'react-redux';
import authFeature from '@features/auth';

function AuthRedirectPage() {
  const disatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access-token');
    const refreshToken = params.get('refresh-token');

    if (accessToken && refreshToken) {
      disatch(authFeature.authAction.signIn({ accessToken, refreshToken }));
    }
    const preUrl = {
      url: params.get('url') || '',
      role: params.get('role') as Role,
    };
    navigate(RedirectUtils.getRedirectUriBelongTo(accessToken || '', preUrl), {
      replace: true,
    });
  }, []);

  return <Loading message="Đang chuyển hướng..." />;
}

export default AuthRedirectPage;
