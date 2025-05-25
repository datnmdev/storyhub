import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import paths from '@routers/router.path';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import StoryManagementSection from './components/StoryManagementSection';

function AuthorStoryManagementPage() {
  const { t } = useTranslation();

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      label: t('author.storyManagementPage.breadcrumb'),
      path: paths.authorStoryManagementPage(),
    },
  ];

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <StoryManagementSection />
      </div>
    </div>
  );
}

export default memo(AuthorStoryManagementPage);
