import Breadcrumb from '@components/Breadcrumb';
import { BreadcrumbProps } from '@components/Breadcrumb/Breadcrumb.type';
import paths from '@routers/router.path';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterFormSection from './components/FilterFormSection';
import { FilterInputData } from './components/FilterFormSection/FilterFormSection.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import LoadingWrapper from '@components/LoadingWrapper';
import StoryItem from '@components/StoryItem';
import Pagination from '@components/Pagination';

function ReaderStoryFilterPage() {
  const { t } = useTranslation();
  const [isSumit, setSubmit] = useState({
    value: false,
  });
  const [requestInit, setRequestInit] =
    useState<RequestInit<undefined, undefined, FilterInputData>>();
  const { data, isLoading, setRefetch } = useFetch(
    apis.storyApi.getStoryWithFilter,
    requestInit,
    false
  );

  const breadcrumbItems: BreadcrumbProps['items'] = [
    {
      label: t('reader.storyFilterPage.breadcrumb.items.homePage'),
      path: paths.readerHomePage(),
    },
    {
      label: t('reader.storyFilterPage.breadcrumb.items.storyFilterPage'),
      path: paths.storyFilterPage(),
    },
  ];

  useEffect(() => {
    if (isSumit.value) {
      setRefetch({
        value: true,
      });
    }
  }, [isSumit]);

  return (
    <div className="grow desktop:w-[var(--desktop-container-w)] tablet:w-[var(--tablet-container-w)] mobile:w-[var(--mobile-container-w)] mx-auto py-8 space-y-6">
      <div>
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div>
        <FilterFormSection
          onChange={(data) =>
            setRequestInit({
              queries: data,
            })
          }
          onSubmit={() =>
            setSubmit({
              value: true,
            })
          }
        />
      </div>

      <div>
        <LoadingWrapper
          isLoading={isLoading}
          message={t('reader.storyFilterPage.resultSection.loading.message')}
          level="page"
        >
          {data && (
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-[1.4rem] font-[450]">
                  {t('reader.storyFilterPage.resultSection.title', {
                    value: data[1],
                  })}
                </h3>
              </div>

              <div className="mt-2">
                <div className="space-y-4">
                  <div className="grid desktop:grid-cols-6 tablet:grid-cols-4 mobile:grid-cols-2 gap-4">
                    {data[0].map((story: any) => {
                      return <StoryItem key={story.id} data={story} />;
                    })}
                  </div>

                  {data[1] > 0 && (
                    <div className="flex justify-center items-center">
                      <Pagination
                        page={requestInit?.queries.page}
                        count={Math.ceil(data[1] / requestInit?.queries.limit)}
                        onChange={(_e, page) => {
                          setRequestInit((prev) => ({
                            queries: {
                              ...prev?.queries,
                              page,
                            },
                          }));
                          setRefetch({
                            value: true,
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </LoadingWrapper>
      </div>
    </div>
  );
}

export default memo(ReaderStoryFilterPage);
