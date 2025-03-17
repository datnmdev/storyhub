import { Role, TOKEN_KEY } from '@constants/auth.constants';
import paths from '@routers/router.path';
import { JwtPayload } from '@type/jwt.type';
import { jwtDecode } from 'jwt-decode';

export function getHomePage() {
  let homeRoute: string = paths.readerHomePage();
  const tokenJson = localStorage.getItem(TOKEN_KEY);

  if (tokenJson) {
    const payload = jwtDecode(tokenJson) as JwtPayload;
    switch (payload.role) {
      case Role.MANAGER:
        homeRoute = paths.managerDashboardPage();
        break;

      case Role.AUTHOR:
        homeRoute = paths.authorHomePage();
        break;

      case Role.MODERATOR:
        homeRoute = paths.moderatorHomePage();
        break;

      default:
        homeRoute = paths.readerHomePage();
        break;
    }
  }

  return homeRoute;
}
