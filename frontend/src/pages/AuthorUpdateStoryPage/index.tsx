import apis from '@apis/index';
import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import useFetch from '@hooks/fetch.hook';
import { Story } from '@pages/ReaderHomePage/components/NewUpdateStorySection/NewUpdateStorySection.type';
import paths from '@routers/router.path';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import UpdateStorySection from './components/UpdateStorySection';
import ChapterManagementSection from './components/ChapterManagementSection';

function AuthorUpdateStoryPage() {
  const { t } = useTranslation();
  const { storyId } = useParams();
  const { data, isLoading } = useFetch<[Story[], number]>(
    apis.storyApi.getStoryWithFilter,
    {
      queries: {
        id: Number(storyId),
        page: 1,
        limit: 1,
      },
    },
    true
  );

  if (isLoading || data === null) {
    return null;
  }

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      label: t('author.storyManagementPage.breadcrumb'),
      path: paths.authorStoryManagementPage(),
    },
    {
      label: t('author.updateStoryPage.breadcrumb', {
        title: data[0][0].title,
      }),
      path: paths.authorUpdateStoryPage(storyId),
    },
  ];

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <h3 className="text-[1.4rem] font-[500]">
          {t('author.updateStoryPage.updateStorySection.title')}
        </h3>
        <UpdateStorySection />
      </div>

      <div>
        <h3 className="text-[1.4rem] font-[500] mb-2">
          {t('author.updateStoryPage.chapterManagementSection.title')}
        </h3>
        <ChapterManagementSection
          storyId={Number(storyId)}
          type={data?.[0]?.[0]?.type}
        />
      </div>
    </div>
  );
}

export default AuthorUpdateStoryPage;
