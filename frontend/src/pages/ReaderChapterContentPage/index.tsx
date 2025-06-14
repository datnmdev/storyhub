import apis from '@apis/index';
import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import useFetchAll from '@hooks/fetchAll.hook';
import paths from '@routers/router.path';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Separator1Image from '@assets/imgs/separator-1.png';
import Separator2Image from '@assets/imgs/separator-2.png';
import Navigator from './components/Navigator';
import ImageContentSection from './components/ImageContentSection';
import { StoryType } from '@constants/story.constants';
import TextContentSection from './components/TextContentSection';
import CommentSection from './components/CommentSection';
import { CommentType } from '@constants/comment.constants';

function ReaderChapterContentPage() {
  const { t } = useTranslation();
  const { storyId, chapterId, chapterTransId } = useParams();
  const { data, isLoading } = useFetchAll([
    [
      apis.storyApi.getStoryWithFilter,
      {
        queries: {
          id: storyId,
          page: 1,
          limit: 1,
        },
      },
    ],
    [
      apis.chapterApi.getChapterWithFilter,
      {
        queries: {
          id: chapterId,
          page: 1,
          limit: 1,
        },
      },
    ],
  ]);

  if (isLoading || data === null) {
    return null;
  }

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      label: t('reader.walletPage.breadcrumb.items.homePage'),
      path: paths.readerHomePage(),
    },
    {
      label: data[0][0][0].title,
      path: paths.readerStoryInfoPage(storyId),
    },
    {
      label: data[1][0][0].name,
      path: paths.readerChapterContentPage(storyId, chapterId, chapterTransId),
    },
  ];

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <div>
          <div className="text-center text-[1.6rem] text-[var(--primary)] font-[450]">
            {data[0][0][0].title}
          </div>

          <div className="text-center text-[1.2rem] mt-2 text-[var(--dark-gray)] font-[450]">
            {data[1][0][0].name}
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <img className="w-[80px]" src={Separator1Image} alt="seperator" />
        </div>

        <div className="mt-2">
          <Navigator />
        </div>

        <div className="flex justify-center mt-2">
          <img className="w-[280px]" src={Separator2Image} alt="Seperator" />
        </div>
      </div>

      <div>
        {data[0][0][0].type === StoryType.COMIC ? (
          <ImageContentSection />
        ) : (
          <TextContentSection />
        )}
      </div>

      <div>
        <div className="flex justify-center mt-2">
          <img className="w-[280px]" src={Separator2Image} alt="Seperator" />
        </div>

        <div className="mt-2">
          <Navigator />
        </div>
      </div>

      <div>
        <CommentSection
          type={CommentType.CHAPTER_COMMENT}
          chapterId={Number(chapterId)}
        />
      </div>
    </div>
  );
}

export default memo(ReaderChapterContentPage);
