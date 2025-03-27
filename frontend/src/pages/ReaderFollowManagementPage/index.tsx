import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import paths from '@routers/router.path';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import FollowManagementSection from './components/FollowManagementSection';

function ReaderFollowManagementPage() {
  const { t } = useTranslation();

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      label: t('reader.followManagementPage.breadcrumb.items.homePage'),
      path: paths.readerHomePage(),
    },
    {
      label: t(
        'reader.followManagementPage.breadcrumb.items.followManagementPage'
      ),
      path: paths.readerFollowManagementPage(),
    },
  ];

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <FollowManagementSection />
      </div>
    </div>
  );
}

export default memo(ReaderFollowManagementPage);
