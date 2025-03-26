import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import paths from '@routers/router.path';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import TopViewSection from './components/TopViewSection';
import TopRatingSection from './components/TopRatingSection';
import TopFollowSection from './components/TopFollowSection';

function ReaderRankPage() {
  const { t } = useTranslation();

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      label: t('reader.rankPage.breadcrumb.items.homePage'),
      path: paths.readerHomePage(),
    },
    {
      label: t('reader.rankPage.breadcrumb.items.rankPage'),
      path: paths.readerRankPage(),
    },
  ];

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <TopViewSection />
      </div>

      <div>
        <TopRatingSection />
      </div>

      <div>
        <TopFollowSection />
      </div>
    </div>
  );
}

export default memo(ReaderRankPage);
