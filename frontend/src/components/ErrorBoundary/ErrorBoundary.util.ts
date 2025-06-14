import { Role } from '@constants/user.constants';
import paths from '@routers/router.path';
import { JwtPayload } from '@type/jwt.type';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export function getHomePage() {
  let homeRoute: string = paths.readerHomePage();
  const tokenJson = Cookies.get('accessToken');

  if (tokenJson) {
    const payload = jwtDecode(tokenJson) as JwtPayload;
    switch (payload.role) {
      case Role.ADMIN:
        homeRoute = paths.managerDashboardPage();
        break;

      case Role.AUTHOR:
        homeRoute = paths.authorStoryManagementPage();
        break;

      case Role.MODERATOR:
        homeRoute = paths.moderatorModerationRequestManagementPage();
        break;

      default:
        homeRoute = paths.readerHomePage();
        break;
    }
  }

  return homeRoute;
}
