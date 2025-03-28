import { memo, useEffect, useState } from 'react';
import { HistoryItemProps } from './HistoryItem.type';
import UrlUtils from '@utilities/url.util';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import paths from '@routers/router.path';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';
import Button from '@components/Button';
import IconButton from '@components/IconButton';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import LoadingWrapper from '@components/LoadingWrapper';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import ReviewDetailHistoryPopup from './components/ReviewDetailHistoryPopup';

function HistoryItem({ data, setReGetHistory }: HistoryItemProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [deleteHistoryByStoryIdRequest, setDeleteHistoryByStoryIdRequest] =
    useState<RequestInit>();
  const {
    data: isDeletedHistoryByStoryId,
    isLoading: isDeletingHistoryByStoryId,
    error: deleteHistoryByStoryIdError,
    setRefetch: setReDeleteHistoryByStoryId,
  } = useFetch(
    apis.historyApi.deleteHistoryByStoryId,
    deleteHistoryByStoryIdRequest,
    false
  );
  const [hiddenReviewDetailHistory, setHiddenReviewDetailHistory] =
    useState(true);

  useEffect(() => {
    if (deleteHistoryByStoryIdRequest) {
      setReDeleteHistoryByStoryId({
        value: true,
      });
    }
  }, [deleteHistoryByStoryIdRequest]);

  useEffect(() => {
    if (!isDeletingHistoryByStoryId) {
      if (isDeletedHistoryByStoryId) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.deleteReadingHistoryByStoryIdSuccess'),
          })
        );
        setReGetHistory({
          value: true,
        });
      } else {
        if (deleteHistoryByStoryIdError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.undefinedError'),
            })
          );
        }
      }
    }
  }, [isDeletingHistoryByStoryId]);

  return (
    <LoadingWrapper
      isLoading={isDeletingHistoryByStoryId}
      message={t(
        'reader.readingHistoryPage.readingHistorySection.loading.handlingReqMessage'
      )}
    >
      <div
        className={classNames(
          'flex justify-between p-3 space-x-3 rounded-[4px]',
          themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow'
        )}
      >
        <div className="self-stretch shrink-0">
          <img
            className="w-[72px] h-[100px] object-cover object-center rounded-[4px]"
            src={UrlUtils.generateUrl(data.coverImage)}
            alt={data.title}
          />

          <div className="mt-4 desktop:hidden tablet:hidden mobile:flex shrink-0 items-center justify-center">
            <IconButton
              icon={
                <i className="fa-solid fa-trash text-red-500 text-[1.6rem] px-4"></i>
              }
              onClick={() =>
                setDeleteHistoryByStoryIdRequest({
                  queries: {
                    storyId: data.id,
                  },
                })
              }
            />
          </div>
        </div>

        <div className="grow flex justify-between space-x-3">
          <div className="grow flex flex-col justify-between">
            <h3 className="line-clamp-1 font-[450] text-[1.2rem]">
              {data.title}
            </h3>

            <div className="mt-0.5">
              {t(
                'reader.readingHistoryPage.readingHistorySection.item.mostRecentlyReadingTimeAt',
                {
                  value: moment(data.histories[0].updatedAt).format(
                    'HH:mm:ss DD/MM/YYYY'
                  ),
                }
              )}
            </div>

            <div className="space-x-1 mt-0.5">
              <span>
                {t(
                  'reader.readingHistoryPage.readingHistorySection.item.mostRecentlyReadedChapter'
                )}
              </span>

              <Link
                className="font-semibold text-[var(--primary)] hover:opacity-60"
                to={paths.readerChapterContentPage(
                  data.id,
                  data.histories[0].chapterTranslation.chapterId,
                  data.histories[0].chapterTranslationId
                )}
                state={data.histories[0]}
              >
                {data.histories[0].chapterTranslation.chapter.name}
              </Link>
            </div>

            <div className="mt-1.5 flex items-center space-x-2">
              <Button
                width={100}
                height={32}
                bgColor="#48b528"
                onClick={() =>
                  navigate(
                    paths.readerChapterContentPage(
                      data.id,
                      data.histories[0].chapterTranslation.chapterId,
                      data.histories[0].chapterTranslationId
                    ),
                    {
                      state: data.histories[0],
                    }
                  )
                }
              >
                {t(
                  'reader.readingHistoryPage.readingHistorySection.btn.continueReadingBtn'
                )}
              </Button>

              <Button
                width={100}
                height={32}
                bgColor="var(--primary)"
                onClick={() => setHiddenReviewDetailHistory(false)}
              >
                {t(
                  'reader.readingHistoryPage.readingHistorySection.btn.reviewDetailBtn'
                )}
              </Button>
            </div>
          </div>

          <div className="desktop:flex tablet:flex mobile:hidden shrink-0 items-center justify-center">
            <IconButton
              icon={
                <i className="fa-solid fa-trash text-red-500 text-[1.6rem] px-4"></i>
              }
              onClick={() =>
                setDeleteHistoryByStoryIdRequest({
                  queries: {
                    storyId: data.id,
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {!hiddenReviewDetailHistory && (
        <ReviewDetailHistoryPopup
          data={data}
          onClose={() => setHiddenReviewDetailHistory(true)}
          setReGetHistory={setReGetHistory}
        />
      )}
    </LoadingWrapper>
  );
}

export default memo(HistoryItem);
