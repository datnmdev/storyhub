import { RequestInit } from '@apis/api.type';
import apis from '@apis/index';
import Button from '@components/Button';
import LoadingWrapper from '@components/LoadingWrapper';
import Pagination from '@components/Pagination';
import useFetch from '@hooks/fetch.hook';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HistoryItem from './components/HistoryItem';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import NoData from '@components/NoData';

function HistorySection() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [getHistoryRequest, setGetHistoryRequest] = useState<RequestInit>({
    queries: {
      page: 1,
      limit: 10,
    },
  });
  const { data, isLoading, setRefetch } = useFetch(
    apis.historyApi.getHistoryWithFilter,
    getHistoryRequest
  );
  const [deleteAllHistoryRequest, setDeleteAllHistoryRequest] =
    useState<RequestInit>();
  const {
    data: isDeleteAllHistory,
    isLoading: isDeletingAllHistory,
    error: deleteAllHistoryError,
    setRefetch: setReDeleteAllHistory,
  } = useFetch(
    apis.historyApi.deleteAllHistory,
    deleteAllHistoryRequest,
    false
  );

  useEffect(() => {
    if (getHistoryRequest) {
      setRefetch({
        value: true,
      });
    }
  }, [getHistoryRequest]);

  useEffect(() => {
    if (deleteAllHistoryRequest) {
      setReDeleteAllHistory({
        value: true,
      });
    }
  }, [deleteAllHistoryRequest]);

  useEffect(() => {
    if (!isDeletingAllHistory) {
      if (isDeleteAllHistory) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.deleteAllReadingHistorySuccess'),
          })
        );
        setRefetch({
          value: true,
        });
      } else {
        if (deleteAllHistoryError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.undefinedError'),
            })
          );
        }
      }
    }
  }, [isDeletingAllHistory]);

  return (
    <LoadingWrapper
      isLoading={isLoading}
      message={t(
        'reader.readingHistoryPage.readingHistorySection.loading.message'
      )}
      level="component"
    >
      <LoadingWrapper
        isLoading={isDeletingAllHistory}
        message={t(
          'reader.readingHistoryPage.readingHistorySection.loading.handlingReqMessage'
        )}
      >
        {data && (
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-[1.4rem] font-semibold">
                {t('reader.readingHistoryPage.readingHistorySection.title')}
              </h3>

              <Button
                width={80}
                height={32}
                onClick={() => setDeleteAllHistoryRequest({})}
              >
                {t(
                  'reader.readingHistoryPage.readingHistorySection.btn.deleteAllBtn'
                )}
              </Button>
            </div>

            {data[1] > 0 ? (
              <div className="grow mt-6 space-y-6">
                <div className="grid desktop:grid-cols-2 tablet:grid-cols-2 mobile:grid-cols-1 gap-4">
                  {data[0].map((story: any) => {
                    return (
                      <HistoryItem
                        key={story.id}
                        data={story}
                        setReGetHistory={setRefetch}
                      />
                    );
                  })}
                </div>

                <div className="flex justify-center items-start">
                  <Pagination
                    page={getHistoryRequest.queries.page}
                    count={Math.ceil(data[1] / getHistoryRequest.queries.limit)}
                    onChange={(_e, page) =>
                      setGetHistoryRequest({
                        queries: {
                          ...getHistoryRequest.queries,
                          page,
                        },
                      })
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="min-h-[320px] flex items-center justify-center">
                <NoData />
              </div>
            )}
          </div>
        )}
      </LoadingWrapper>
    </LoadingWrapper>
  );
}

export default memo(HistorySection);
