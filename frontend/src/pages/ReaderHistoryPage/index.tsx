import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import paths from '@routers/router.path';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import HistorySection from './components/HistorySection';

function ReaderHistoryPage() {
  const { t } = useTranslation();

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      label: t('reader.readingHistoryPage.breadcrumb.items.homePage'),
      path: paths.readerHomePage(),
    },
    {
      label: t('reader.readingHistoryPage.breadcrumb.items.readingHistoryPage'),
      path: paths.readerFollowManagementPage(),
    },
  ];

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <HistorySection />
      </div>
    </div>
  );
}

export default memo(ReaderHistoryPage);
