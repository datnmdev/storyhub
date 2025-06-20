import { createBrowserRouter, Outlet } from 'react-router-dom';
import ReaderLayout from '@layouts/ReaderLayout';
import SignInPage from '@pages/SignInPage';
import paths from './router.path';
import ReaderHomePage from '@pages/ReaderHomePage';
import Protected from '@components/Protected';
import ManagerDashboardPage from '@pages/ManagerDashboardPage';
import { Role } from '@constants/user.constants';
import Authentication from '@components/Authentication';
import ErrorBoundary from '@components/ErrorBoundary';
import AuthRedirectPage from '@pages/AuthRedirectPage';
import SignUpPage from '@pages/SignUpPage';
import OtpVerificationPage from '@pages/OtpVerificationPage';
import Guest from '@components/Guest';
import ForgotPasswordPage from '@pages/ForgotPasswordPage';
import ResetPasswordPage from '@pages/ResetPasswordPage';
import ReaderWalletPage from '@pages/ReaderWalletPage';
import ReaderDepositeTransHistoryPage from '@pages/ReaderDepositeTransHistoryPage';
import ReaderStoryInfoPage from '@pages/ReaderStoryInfoPage';
import ReaderChapterContentPage from '@pages/ReaderChapterContentPage';
import ReaderInvoiceHistoryPage from '@pages/ReaderInvoiceHistoryPage';
import ReaderStoryFilterPage from '@pages/ReaderStoryFilterPage';
import ReaderRankPage from '@pages/ReaderRankPage';
import ReaderFollowManagementPage from '@pages/ReaderFollowManagementPage';
import ReaderPersonalProfilePage from '@pages/ReaderPersonalProfilePage';
import ReaderChangePasswordPage from '@pages/ReaderChangePasswordPage';
import ReaderHistoryPage from '@pages/ReaderHistoryPage';
import ReaderNotificationPage from '@pages/ReaderNotificationPage';
import AuthorLayout from '@layouts/AuthorLayout';
import AuthorPersonalProfilePage from '@pages/AuthorPersonalProfilePage';
import AuthorChangePasswordPage from '@pages/AuthorChangePasswordPage';
import AuthorStoryManagementPage from '@pages/AuthorStoryManagementPage';
import AuthorUpdateStoryPage from '@pages/AuthorUpdateStoryPage';
import ModeratorLayout from '@layouts/ModeratorLayout';
import ModeratorModerationRequestManagementPage from '@pages/ModeratorModerationRequestManagementPage';
import AuthorNotificationPage from '@pages/AuthorNotificationPage';

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
        path: paths.readerStoryInfoPage(),
        element: (
          <ReaderLayout>
            <ReaderStoryInfoPage />
          </ReaderLayout>
        ),
      },
      {
        path: paths.readerRankPage(),
        element: (
          <ReaderLayout>
            <ReaderRankPage />
          </ReaderLayout>
        ),
      },
      {
        path: paths.signInPage(),
        element: (
          <Guest>
            <ReaderLayout>
              <SignInPage />
            </ReaderLayout>
          </Guest>
        ),
      },
      {
        path: paths.authRedirectPage(),
        element: (
          <ReaderLayout>
            <AuthRedirectPage />
          </ReaderLayout>
        ),
      },
      {
        path: paths.signUpPage(),
        element: (
          <Guest>
            <ReaderLayout>
              <SignUpPage />
            </ReaderLayout>
          </Guest>
        ),
      },
      {
        path: paths.otpVerificationPage(),
        element: (
          <Guest>
            <ReaderLayout>
              <OtpVerificationPage />
            </ReaderLayout>
          </Guest>
        ),
      },
      {
        path: paths.forgotPasswordPage(),
        element: (
          <Guest>
            <ReaderLayout>
              <ForgotPasswordPage />
            </ReaderLayout>
          </Guest>
        ),
      },
      {
        path: paths.resetPasswordPage(),
        element: (
          <Guest>
            <ReaderLayout>
              <ResetPasswordPage />
            </ReaderLayout>
          </Guest>
        ),
      },
      {
        path: paths.readerWalletPage(),
        element: (
          <Protected role={Role.READER}>
            <ReaderLayout>
              <ReaderWalletPage />
            </ReaderLayout>
          </Protected>
        ),
      },
      {
        path: paths.readerDepositeTransHistoryPage(),
        element: (
          <Protected role={Role.READER}>
            <ReaderLayout>
              <ReaderDepositeTransHistoryPage />
            </ReaderLayout>
          </Protected>
        ),
      },
      {
        path: paths.readerInvoiceHistoryPage(),
        element: (
          <Protected role={Role.READER}>
            <ReaderLayout>
              <ReaderInvoiceHistoryPage />
            </ReaderLayout>
          </Protected>
        ),
      },
      {
        path: paths.readerChapterContentPage(),
        element: (
          <ReaderLayout>
            <ReaderChapterContentPage />
          </ReaderLayout>
        ),
      },
      {
        path: paths.storyFilterPage(),
        element: (
          <ReaderLayout>
            <ReaderStoryFilterPage />
          </ReaderLayout>
        ),
      },
      {
        path: paths.readerFollowManagementPage(),
        element: (
          <Protected role={Role.READER}>
            <ReaderLayout>
              <ReaderFollowManagementPage />
            </ReaderLayout>
          </Protected>
        ),
      },
      {
        path: paths.readerPersonalProfilePage(),
        element: (
          <Protected role={Role.READER}>
            <ReaderLayout>
              <ReaderPersonalProfilePage />
            </ReaderLayout>
          </Protected>
        ),
      },
      {
        path: paths.readerChangePasswordPage(),
        element: (
          <Protected role={Role.READER}>
            <ReaderLayout>
              <ReaderChangePasswordPage />
            </ReaderLayout>
          </Protected>
        ),
      },
      {
        path: paths.readerHistoryPage(),
        element: (
          <Protected role={Role.READER}>
            <ReaderLayout>
              <ReaderHistoryPage />
            </ReaderLayout>
          </Protected>
        ),
      },
      {
        path: paths.readerNotificationPage(),
        element: (
          <Protected role={Role.READER}>
            <ReaderLayout>
              <ReaderNotificationPage />
            </ReaderLayout>
          </Protected>
        ),
      },
      {
        path: paths.managerDashboardPage(),
        element: (
          <Protected role={Role.ADMIN}>
            <ReaderLayout>
              <ManagerDashboardPage />
            </ReaderLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorStoryManagementPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorStoryManagementPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorPersonalProfilePage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorPersonalProfilePage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorChangePasswordPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorChangePasswordPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorUpdateStoryPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorUpdateStoryPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorPersonalProfilePage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorPersonalProfilePage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorChangePasswordPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorChangePasswordPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorUpdateStoryPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorUpdateStoryPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorPersonalProfilePage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorPersonalProfilePage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorChangePasswordPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorChangePasswordPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorUpdateStoryPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorUpdateStoryPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorPersonalProfilePage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorPersonalProfilePage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorChangePasswordPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorChangePasswordPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorUpdateStoryPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorUpdateStoryPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorPersonalProfilePage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorPersonalProfilePage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorChangePasswordPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorChangePasswordPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorUpdateStoryPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorUpdateStoryPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.authorNotificationPage(),
        element: (
          <Protected role={Role.AUTHOR}>
            <AuthorLayout>
              <AuthorNotificationPage />
            </AuthorLayout>
          </Protected>
        ),
      },
      {
        path: paths.moderatorModerationRequestManagementPage(),
        element: (
          <Protected role={Role.MODERATOR}>
            <ModeratorLayout>
              <ModeratorModerationRequestManagementPage />
            </ModeratorLayout>
          </Protected>
        ),
      },
    ],
  },
]);

export default router;
