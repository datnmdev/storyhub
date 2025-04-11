import { Role } from '@constants/user.constants';
import paths from '@routers/router.path';
import { JwtPayload } from '@type/jwt.type';
import { jwtDecode } from 'jwt-decode';

interface PreUrl {
  url?: string;
  role?: Role;
}

const RedirectUtils = {
  getRedirectUriBelongTo(token: string, preUrl: PreUrl) {
    const payload = jwtDecode(token) as JwtPayload;
    let route: string;
    switch (payload.role) {
      case Role.ADMIN:
        route = paths.managerDashboardPage();
        break;

      case Role.MODERATOR:
        route = paths.moderatorHomePage();
        break;

      case Role.AUTHOR:
        route = paths.authorStoryManagementPage();
        break;

      case Role.TRANSLATOR:
        route = '';
        break;

      default:
        route = paths.readerHomePage();
        break;
    }
    if (preUrl.role === payload.role) {
      if (typeof preUrl.url === 'string') {
        route = preUrl.url;
      }
    }
    return route;
  },
};

export default RedirectUtils;
