import LoadingWrapper from '@components/LoadingWrapper';
import useFetch from '@hooks/fetch.hook';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BlockedContent from '../BlockedContent';
import apis from '@apis/index';
import { ChapterTranslation } from '@apis/chapter';
import UrlUtils from '@utilities/url.util';

function ImageContentSection() {
  const { t } = useTranslation();
  const { chapterTransId: chapterTranslationId } = useParams();
  const {
    data: chapterContent,
    error: getChapterContentError,
    isLoading: isGettingChapterContent,
  } = useFetch<ChapterTranslation>(apis.chapterApi.getChapterContent, {
    queries: {
      chapterTranslationId,
    },
  });

  return (
    <LoadingWrapper
      isLoading={isGettingChapterContent}
      message={t('reader.chapterContentPage.loadingWrapper.message')}
    >
      {getChapterContentError ? (
        <BlockedContent />
      ) : (
        <div className="flex flex-col items-center">
          {chapterContent?.images.map((image) => {
            return (
              <img
                key={image.id}
                src={UrlUtils.generateUrl(image.path)}
                alt={`${chapterContent.name} - ${t('reader.chapterContentPage.page')} ${image.order}`}
              />
            );
          })}
        </div>
      )}
    </LoadingWrapper>
  );
}

export default memo(ImageContentSection);
