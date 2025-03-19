import Loading from '@components/Loading';
import RedirectUtils from '@utilities/redirect.util';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Role } from '@constants/user.constants';

function AuthRedirectPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = Object.fromEntries(
      new URLSearchParams(location.search).entries()
    );
    const preUrl = {
      url: params.redirectToUrl,
      role: params.role as Role,
    };
    navigate(
      RedirectUtils.getRedirectUriBelongTo(
        Cookies.get('accessToken') || '',
        preUrl
      ),
      {
        replace: true,
      }
    );
  }, []);

  return <Loading message="Đang chuyển hướng..." />;
}

export default AuthRedirectPage;
