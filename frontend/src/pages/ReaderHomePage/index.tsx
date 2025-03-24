import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import paths from '@routers/router.path';
import { useTranslation } from 'react-i18next';
import SliderSection from './components/SliderSection';
import NewUpdateStorySection from './components/NewUpdateStorySection';

function ReaderHomePage() {
  const { t } = useTranslation();

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      label: t('reader.walletPage.breadcrumb.items.homePage'),
      path: paths.readerHomePage(),
    },
  ];

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <SliderSection />
      </div>

      <div>
        <NewUpdateStorySection />
      </div>
    </div>
  );
}

export default ReaderHomePage;
