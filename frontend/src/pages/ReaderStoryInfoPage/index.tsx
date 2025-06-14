import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import paths from '@routers/router.path';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import StoryInfoSection from './components/StoryInfoSection';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { useParams } from 'react-router-dom';
import { Story } from '@pages/ReaderHomePage/components/NewUpdateStorySection/NewUpdateStorySection.type';
import ChapterSection from './components/ChapterSection';
import CommentSection from './components/CommentSection';
import { CommentType } from '@constants/comment.constants';

function ReaderStoryInfoPage() {
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
      label: t('reader.walletPage.breadcrumb.items.homePage'),
      path: paths.readerHomePage(),
    },
    {
      label: data[0][0].title,
      path: paths.readerStoryInfoPage(storyId),
    },
  ];

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <StoryInfoSection />
      </div>

      <div>
        <ChapterSection />
      </div>

      <div>
        <CommentSection
          type={CommentType.STORY_COMMENT}
          storyId={Number(storyId)}
        />
      </div>
    </div>
  );
}

export default memo(ReaderStoryInfoPage);
