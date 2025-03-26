import { memo, useEffect, useState } from 'react';
import TopStoryItem from './components/TopStoryItem';
import { RequestInit } from '@apis/api.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import Button from '@components/Button';
import { useTranslation } from 'react-i18next';
import LoadingWrapper from '@components/LoadingWrapper';

function TopStoryList() {
  const { t } = useTranslation();
  const [getTopRatingStoryListReq, setGetTopRatingStoryListReq] =
    useState<RequestInit>({
      queries: {
        page: 1,
        limit: 10,
      },
    });
  const { data, isLoading, setRefetch } = useFetch(
    apis.ratingApi.getTopRatingStory,
    getTopRatingStoryListReq
  );

  useEffect(() => {
    setRefetch({
      value: true,
    });
  }, [getTopRatingStoryListReq]);

  return (
    <div className="space-y-6">
      <div className="grid desktop:grid-cols-2 tablet:grid-cols-1 mobile:grid-cols-1 gap-4">
        {data?.[0].map((story: any, index: number) => {
          return <TopStoryItem key={story.id} index={index} data={story} />;
        })}
      </div>

      <div className="flex justify-center items-center">
        <LoadingWrapper
          isLoading={isLoading}
          message={t(
            'reader.rankPage.topRatingSection.topStoryList.loading.message'
          )}
        >
          <Button
            onClick={() =>
              setGetTopRatingStoryListReq({
                queries: {
                  limit: getTopRatingStoryListReq.queries.limit + 10,
                  page: 1,
                },
              })
            }
          >
            {t('reader.rankPage.topRatingSection.topStoryList.btn.moreBtn')}
          </Button>
        </LoadingWrapper>
      </div>
    </div>
  );
}

export default memo(TopStoryList);
