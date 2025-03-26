import apis from '@apis/index';
import Pagination from '@components/Pagination';
import StoryItem from '@components/StoryItem';
import useFetch from '@hooks/fetch.hook';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetNewUpdatedStoriesQueries,
  GetNewUpdatedStoriesResData,
} from './NewUpdateStorySection.type';

function NewUpdateStorySection() {
  const { t } = useTranslation();
  const [queries, setQueries] = useState<GetNewUpdatedStoriesQueries>({
    orderBy: JSON.stringify([
      ['updated_at', 'DESC'],
      ['id', 'DESC'],
    ]),
    page: 1,
    limit: 24,
  });
  const { data, isLoading, setRefetch } = useFetch<GetNewUpdatedStoriesResData>(
    apis.storyApi.getStoryWithFilter,
    {
      queries,
    }
  );

  useEffect(() => {
    setRefetch({
      value: true,
    });
  }, [queries]);

  if (isLoading || data === null) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[1.4rem] font-semibold">
        {t('reader.homePage.newUpdatedSection.title')}
      </h3>
      <div>
        <div className="space-y-4">
          <div className="grid desktop:grid-cols-6 tablet:grid-cols-4 mobile:grid-cols-2 gap-4">
            {data[0].map((story) => {
              return <StoryItem key={story.id} data={story} />;
            })}
          </div>

          <div className="flex justify-center items-center">
            <Pagination
              page={queries.page}
              count={Math.ceil(data[1] / queries.limit)}
              onChange={(_e, page) =>
                setQueries({
                  ...queries,
                  page,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(NewUpdateStorySection);
