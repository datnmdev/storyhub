import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import paths from '@routers/router.path';
import { useTranslation } from 'react-i18next';
import NotificationSection from './components/NotificationSection';

function AuthorNotificationPage() {
  const { t } = useTranslation();

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      label: t('author.notificationPage.breadcrumb.items.homePage'),
      path: paths.readerHomePage(),
    },
    {
      label: t('author.notificationPage.breadcrumb.items.notificationPage'),
      path: paths.readerNotificationPage(),
    },
  ];

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <NotificationSection />
      </div>
    </div>
  );
}

export default AuthorNotificationPage;
