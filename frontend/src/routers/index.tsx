import { createBrowserRouter, Outlet } from 'react-router-dom';
import ReaderLayout from '@layouts/ReaderLayout';
import SignInPage from '@pages/SignInPage';
import paths from './router.path';
import ReaderHomePage from '@pages/ReaderHomePage';
import Protected from '@components/Protected';
import AuthorHomePage from '@pages/AuthorHomePage';
import ManagerDashboardPage from '@pages/ManagerDashboardPage';
import ModeratorHomePage from '@pages/ModeratorHomePage';
import { Role } from '@constants/auth.constants';
import Authentication from '@components/Authentication';
import ErrorBoundary from '@components/ErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Authentication>
        <Outlet />
      </Authentication>
    ),
    errorElement: <ErrorBoundary />,
    hasErrorBoundary: true,
    children: [
      {
        index: true,
        element: (
          <ReaderLayout>
            <ReaderHomePage />
          </ReaderLayout>
        ),
      },
      {
        path: paths.signInPage(),
        element: (
          <ReaderLayout>
            <SignInPage />
          </ReaderLayout>
        ),
      },
      {
        path: paths.managerDashboardPage(),
        element: (
          <Protected role={Role.MANAGER}>
            <ReaderLayout>
              <ManagerDashboardPage />
            </ReaderLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorHomePage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <ReaderLayout>
              <AuthorHomePage />
            </ReaderLayout>
          </Protected>
        ),
      },
      {
        path: paths.moderatorHomePage(),
        element: (
          <Protected role={Role.MODERATOR}>
            <ReaderLayout>
              <ModeratorHomePage />
            </ReaderLayout>
          </Protected>
        ),
      },
    ],
  },
]);

export default router;
