import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import paths from '@routers/router.path';
import { useTranslation } from 'react-i18next';
import ModerationRequestManagementSection from './components/ModerationRequestManagementSection';

function ModeratorModerationRequestManagementPage() {
  const { t } = useTranslation();

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      label: t('moderator.moderationRequestManagementPage.breadcrumb'),
      path: paths.moderatorModerationRequestManagementPage(),
    },
  ];

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <ModerationRequestManagementSection />
      </div>
    </div>
  );
}

export default ModeratorModerationRequestManagementPage;
