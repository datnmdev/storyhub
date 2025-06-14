import Popup from '@components/Popup';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReviewDetailHistoryPopupProps } from './ReviewDetailHistoryPopup.type';
import Button from '@components/Button';
import paths from '@routers/router.path';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import IconButton from '@components/IconButton';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';
import { RequestInit } from '@apis/api.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';

function ReviewDetailHistoryPopup({
  data,
  onClose,
  setReGetHistory,
}: ReviewDetailHistoryPopupProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [
    deleteHistoryByChapterTranslationIdReq,
    setDeleteHistoryByChapterTranslationIdReq,
  ] = useState<RequestInit>();
  const {
    data: isDeletedHistoryByChapterId,
    isLoading: isDeletingHistoryByChapterId,
    error: deleteHistoryByChapterIdError,
    setRefetch: setReDeleteHistoryByChapterId,
  } = useFetch(
    apis.historyApi.deleteHistoryByChapterTranslationId,
    deleteHistoryByChapterTranslationIdReq,
    false
  );

  useEffect(() => {
    if (deleteHistoryByChapterTranslationIdReq) {
      setReDeleteHistoryByChapterId({
        value: true,
      });
    }
  }, [deleteHistoryByChapterTranslationIdReq]);

  useEffect(() => {
    if (!isDeletingHistoryByChapterId) {
      if (isDeletedHistoryByChapterId) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.deleteReadingHistoryByChapterIdSuccess'),
          })
        );
        setReGetHistory({
          value: true,
        });
      } else {
        if (deleteHistoryByChapterIdError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.undefinedError'),
            })
          );
        }
      }
    }
  }, [isDeletingHistoryByChapterId]);

  return (
    <Popup
      title={t(
        'reader.readingHistoryPage.readingHistorySection.reviewDetailReadingHistoryPopup.title'
      )}
      maxHeight={420}
      onClose={onClose}
    >
      {data.histories.map((history: any) => {
        return (
          <div
            key={history.id}
            className={classNames(
              'flex justify-between items-center rounded-[4px] p-4 m-2',
              themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow'
            )}
          >
            <div className="grow">
              <div>
                <h3 className="font-[450] text-[1.05rem] line-clamp-1">
                  {history.chapterTranslation.chapter.name}
                </h3>

                <div className="mt-0.5 text-[0.9rem] italic text-[var(--dark-gray)] font-[450]">
                  {t(
                    'reader.readingHistoryPage.readingHistorySection.reviewDetailReadingHistoryPopup.mostRecentlyReadingTimeAt',
                    {
                      value: moment(history.updatedAt).format(
                        'HH:mm:ss DD/MM/YYYY'
                      ),
                    }
                  )}
                </div>

                <div className="mt-0.5 text-[0.9rem] italic text-[var(--dark-gray)] font-[450]">
                  {t(
                    'reader.readingHistoryPage.readingHistorySection.reviewDetailReadingHistoryPopup.firstReadingTimeAt',
                    {
                      value: moment(history.createdAt).format(
                        'HH:mm:ss DD/MM/YYYY'
                      ),
                    }
                  )}
                </div>
              </div>

              <div className="mt-0.5 text-[0.92rem]">
                <Button
                  width={64}
                  height={28}
                  bgColor="#48b528"
                  onClick={() =>
                    navigate(
                      paths.readerChapterContentPage(
                        data.id,
                        history.chapterTranslation.chapterId,
                        history.chapterTranslationId
                      ),
                      {
                        state: history,
                      }
                    )
                  }
                >
                  {t(
                    'reader.readingHistoryPage.readingHistorySection.btn.continueReadingBtn'
                  )}
                </Button>
              </div>
            </div>

            <div className="shrink-0 flex items-center justify-center">
              <IconButton
                icon={
                  <i className="fa-solid fa-trash text-red-500 text-[1.6rem] px-4"></i>
                }
                onClick={() =>
                  setDeleteHistoryByChapterTranslationIdReq({
                    queries: {
                      chapterTranslationId: history.chapterTranslationId,
                    },
                  })
                }
              />
            </div>
          </div>
        );
      })}
    </Popup>
  );
}

export default memo(ReviewDetailHistoryPopup);
