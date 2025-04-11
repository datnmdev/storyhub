import { RequestInit } from '@apis/api.type';
import apis from '@apis/index';
import IconButton from '@components/IconButton';
import Loading from '@components/Loading';
import LoadingWrapper from '@components/LoadingWrapper';
import NoData from '@components/NoData';
import Pagination from '@components/Pagination';
import { StoryStatus, StoryType } from '@constants/story.constants';
import { ToastType } from '@constants/toast.constants';
import themeFeature from '@features/theme';
import toastFeature from '@features/toast';
import useFetch from '@hooks/fetch.hook';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import UrlUtils from '@utilities/url.util';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function StoryManagementSection() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [getStoriesReq, setGetStoriesReq] = useState<RequestInit>({
    queries: {
      page: 1,
      limit: 24,
      status: JSON.stringify([
        StoryStatus.RELEASING,
        StoryStatus.PAUSED,
        StoryStatus.COMPLETED,
      ]),
      type: JSON.stringify([StoryType.COMIC, StoryType.NOVEL]),
    },
  });
  const {
    data: getStoriesResData,
    isLoading: isGettingStories,
    setRefetch: setReGetStories,
  } = useFetch(apis.storyApi.getStoryWithFilterForAuthor, getStoriesReq);
  const [softDeleteStoryReq, setSoftDeleteStoryReq] = useState<RequestInit>();
  const {
    data: softDeleteStoryResData,
    isLoading: isSoftDeletingStory,
    setRefetch: setReSoftDeleteStory,
  } = useFetch(apis.storyApi.softDeleteStory, softDeleteStoryReq, false);

  useEffect(() => {
    setReGetStories({
      value: true,
    });
  }, [getStoriesReq]);

  useEffect(() => {
    if (softDeleteStoryReq) {
      setReSoftDeleteStory({
        value: true,
      });
    }
  }, [softDeleteStoryReq]);

  useEffect(() => {
    if (!isSoftDeletingStory) {
      if (softDeleteStoryResData) {
        if (softDeleteStoryResData.affected > 0) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.SUCCESS,
              title: t('notification.softDeleteStorySuccess'),
            })
          );
          setReGetStories({
            value: true,
          });
        } else {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.SUCCESS,
              title: t('notification.softDeleteStoryFailure'),
            })
          );
        }
      }
    }
  }, [isSoftDeletingStory]);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <IconButton
          icon={<i className="fa-solid fa-plus"></i>}
          color="var(--white)"
          bgColor="var(--primary)"
          padding="8px 16px"
          borderRadius="4px"
          width={100}
        >
          {t('author.storyManagementPage.btn.add')}
        </IconButton>
      </div>

      <LoadingWrapper
        level="component"
        isLoading={isGettingStories}
        message={t('loading.getStories')}
      >
        {getStoriesResData && getStoriesResData?.[1] > 0 ? (
          <div>
            <div
              className={classNames(
                'h-full flex flex-col overflow-hidden',
                themeValue === 'light'
                  ? 'bg-[var(--light-gray)]'
                  : 'bg-[#242121]'
              )}
            >
              <div className="grow flex flex-col rounded-[4px] overflow-auto">
                <table className="w-full whitespace-nowrap">
                  <thead className="bg-[var(--primary)] text-[var(--white)]">
                    <tr>
                      <th className="py-2 px-4">
                        {t('author.storyManagementPage.table.thead.id')}
                      </th>
                      <th className="py-2 px-4">
                        {t('author.storyManagementPage.table.thead.coverImage')}
                      </th>
                      <th className="py-2 px-4">
                        {t('author.storyManagementPage.table.thead.type')}
                      </th>
                      <th className="py-2 px-4">
                        {t('author.storyManagementPage.table.thead.title')}
                      </th>
                      <th className="py-2 px-4">
                        {t('author.storyManagementPage.table.thead.status')}
                      </th>
                      <th className="py-2 px-4">
                        {t('author.storyManagementPage.table.thead.createdAt')}
                      </th>
                      <th className="py-2 px-4">
                        {t('author.storyManagementPage.table.thead.action')}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {getStoriesResData?.[0]?.map((row: any) => {
                      return (
                        <tr
                          key={row.id}
                          className="text-center border-b-[1px] border-solid border-[var(--gray)]"
                        >
                          <td className="py-4 align-middle">{row.id}</td>

                          <td className="py-4 align-middle">
                            <img
                              className={classNames(
                                'w-16 min-h-20 object-cover object-center rounded-[8px] mx-auto',
                                themeValue === 'light'
                                  ? 'light light__boxShadow'
                                  : 'dark dark__boxShadow'
                              )}
                              src={UrlUtils.generateUrl(row.coverImage)}
                              alt="Cover Image"
                            />
                          </td>

                          <td className="py-4 align-middle">
                            {row.type === StoryType.COMIC && (
                              <span className="bg-red-500 text-white px-4 py-2 rounded-[4px]">
                                {t(
                                  'author.storyManagementPage.table.tbody.type.comic'
                                )}
                              </span>
                            )}

                            {row.type === StoryType.NOVEL && (
                              <span className="bg-blue-500 text-white px-4 py-2 rounded-[4px]">
                                {t(
                                  'author.storyManagementPage.table.tbody.type.novel'
                                )}
                              </span>
                            )}
                          </td>

                          <td className="py-4 align-middle text-nowrap text-ellipsis overflow-hidden max-w-[320px]">
                            {row.title}
                          </td>

                          <td className="py-4 align-middle">
                            {row.status === StoryStatus.RELEASING && (
                              <span className="bg-green-500 text-white px-4 py-2 rounded-[4px]">
                                {t(
                                  'author.storyManagementPage.table.tbody.status.releasing'
                                )}
                              </span>
                            )}

                            {row.status === StoryStatus.PAUSED && (
                              <span className="bg-orange-500 text-white px-4 py-2 rounded-[4px]">
                                {t(
                                  'author.storyManagementPage.table.tbody.status.paused'
                                )}
                              </span>
                            )}

                            {row.status === StoryStatus.COMPLETED && (
                              <span className="bg-purple-500 text-white px-4 py-2 rounded-[4px]">
                                {t(
                                  'author.storyManagementPage.table.tbody.status.completed'
                                )}
                              </span>
                            )}
                          </td>

                          <td className="py-4 align-middle">
                            {moment(row.createdAt).format(
                              'DD/MM/YYYY HH:mm:ss'
                            )}
                          </td>

                          <td className="py-4 align-middle">
                            <div className="flex justify-center items-center">
                              <IconButton
                                icon={
                                  <i className="fa-solid fa-pen text-[1.2rem]"></i>
                                }
                                padding="8px"
                                color="blue"
                              />

                              <IconButton
                                icon={
                                  <i className="fa-solid fa-trash-can text-[1.2rem]"></i>
                                }
                                padding="8px"
                                color="red"
                                onClick={() =>
                                  setSoftDeleteStoryReq({
                                    params: {
                                      storyId: row.id,
                                    },
                                  })
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center items-center mt-6">
              <Pagination
                count={
                  getStoriesResData?.[1]
                    ? Math.ceil(
                        getStoriesResData[1] / getStoriesReq.queries.limit
                      )
                    : 0
                }
                page={getStoriesReq.queries.page}
                onChange={(_e, page) =>
                  setGetStoriesReq({
                    queries: {
                      ...getStoriesReq.queries,
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
      </LoadingWrapper>

      {isSoftDeletingStory && (
        <Loading
          level="page"
          backgroundVisible="frog"
          message={t('loading.softDeleteStory')}
        />
      )}
    </div>
  );
}

export default StoryManagementSection;
