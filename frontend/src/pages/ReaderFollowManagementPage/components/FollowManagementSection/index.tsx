import { RequestInit } from '@apis/api.type';
import apis from '@apis/index';
import Button from '@components/Button';
import LoadingWrapper from '@components/LoadingWrapper';
import Pagination from '@components/Pagination';
import useFetch from '@hooks/fetch.hook';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FollowStoryItem from './components/FollowStoryItem';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import NoData from '@components/NoData';

function FollowManagementSection() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [getFollowListRequest, setGetFollowListRequest] = useState<RequestInit>(
    {
      queries: {
        page: 1,
        limit: 10,
      },
    }
  );
  const { data, isLoading, setRefetch } = useFetch(
    apis.followApi.getFollowWithFilter,
    getFollowListRequest
  );
  const [deleteAllFollowRequest, setDeleteAllFollowRequest] =
    useState<RequestInit>();
  const {
    data: isDeleteAllFollow,
    isLoading: isDeletingAllFollow,
    error: deleteAllFollowError,
    setRefetch: setReDeleteAllFollow,
  } = useFetch(apis.followApi.deleteAllFollow, deleteAllFollowRequest, false);

  useEffect(() => {
    if (getFollowListRequest) {
      setRefetch({
        value: true,
      });
    }
  }, [getFollowListRequest]);

  useEffect(() => {
    if (deleteAllFollowRequest) {
      setReDeleteAllFollow({
        value: true,
      });
    }
  }, [deleteAllFollowRequest]);

  useEffect(() => {
    if (!isDeletingAllFollow) {
      if (isDeleteAllFollow) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.deleteAllFollowSuccess'),
          })
        );
        setRefetch({
          value: true,
        });
      } else {
        if (deleteAllFollowError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.undefinedError'),
            })
          );
        }
      }
    }
  }, [isDeletingAllFollow]);

  return (
    <LoadingWrapper
      isLoading={isLoading}
      message={t(
        'reader.followManagementPage.followManagementSection.loading.message'
      )}
      level="component"
    >
      <LoadingWrapper
        isLoading={isDeletingAllFollow}
        message={t(
          'reader.followManagementPage.followManagementSection.loading.handlingReqMessage'
        )}
      >
        {data && (
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-[1.4rem] font-semibold">
                {t('reader.followManagementPage.followManagementSection.title')}
              </h3>

              <Button
                width={80}
                height={32}
                onClick={() => setDeleteAllFollowRequest({})}
              >
                {t(
                  'reader.followManagementPage.followManagementSection.btn.deleteAllBtn'
                )}
              </Button>
            </div>

            {data[1] > 0 ? (
              <div className="grow mt-6 space-y-6">
                <div className="grid desktop:grid-cols-2  tablet:grid-cols-2  mobile:grid-cols-1 gap-4">
                  {data[0].map((follow: any) => {
                    return (
                      <FollowStoryItem
                        key={follow.story.id}
                        data={follow}
                        setReGetFollowList={setRefetch}
                      />
                    );
                  })}
                </div>

                <div className="flex justify-center items-start">
                  <Pagination
                    page={getFollowListRequest.queries.page}
                    count={Math.ceil(
                      data[1] / getFollowListRequest.queries.limit
                    )}
                    onChange={(_e, page) =>
                      setGetFollowListRequest({
                        queries: {
                          ...getFollowListRequest.queries,
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

export default memo(FollowManagementSection);
