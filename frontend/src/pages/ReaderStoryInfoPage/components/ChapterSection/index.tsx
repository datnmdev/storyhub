import { ChapterWithInvoiceRelation } from '@apis/chapter';
import apis from '@apis/index';
import Pagination from '@components/Pagination';
import authFeature from '@features/auth';
import useFetch from '@hooks/fetch.hook';
import useFetchAll, { ApiFuncArray } from '@hooks/fetchAll.hook';
import { useAppSelector } from '@hooks/redux.hook';
import NumberUtils from '@utilities/number.util';
import classNames from 'classnames';
import moment from 'moment';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentRemindPopup from './components/PaymentRemindPopup';
import paths from '@routers/router.path';
import { RequestInit } from '@apis/api.type';
import Protected from '@components/Protected';
import { Role } from '@constants/user.constants';
import NoData from '@components/NoData';
import ChapterTransListPopup from './components/ChapterTransListPopup';

function ChaperSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthentication = useAppSelector(
    authFeature.authSelector.selectAuthenticated
  );
  const { storyId } = useParams();
  const [isRender, setRender] = useState<boolean>(false);
  const [getCurrentPriceReq] = useState<RequestInit>({
    queries: {
      storyId,
    },
  });

  const {
    data: currentPrice,
    isLoading: isGettingCurrentPrice,
    setRefetch: setReGetCurrentPrice,
  } = useFetch(apis.priceApi.getCurrentPrice, getCurrentPriceReq);
  const [getChaptersReq, setGetChapterReq] = useState<RequestInit>({
    queries: {
      page: 1,
      limit: 20,
      storyId,
      orderBy: JSON.stringify([
        ['order', 'DESC'],
        ['updatedAt', 'DESC'],
        ['id', 'DESC'],
      ]),
    },
  });
  const {
    data: chaptersData,
    isLoading: isGettingChapters,
    setRefetch: setReGetChapters,
  } = useFetch<[ChapterWithInvoiceRelation[], number]>(
    apis.chapterApi.getChapterWithInvoiceRelation,
    getChaptersReq,
    false
  );
  const [viewCountApis, setViewCountApi] = useState<ApiFuncArray | null>(null);
  const {
    data: viewCountsData,
    isLoading: isGettingViewCounts,
    setRefetch: setReGetViewCounts,
  } = useFetchAll(viewCountApis as ApiFuncArray, false);
  const [selectedChapter, setSelectChapter] =
    useState<ChapterWithInvoiceRelation | null>(null);
  const [selectChapterTransId, setSelectChapterTransId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (getCurrentPriceReq) {
      setReGetCurrentPrice({
        value: true,
      });
    }
  }, [getCurrentPriceReq]);

  useEffect(() => {
    if (getChaptersReq) {
      setReGetChapters({
        value: true,
      });
    }
  }, [getChaptersReq]);

  useEffect(() => {
    if (!isGettingCurrentPrice) {
      if (currentPrice !== null) {
        setReGetChapters({
          value: true,
        });
      }
    }
  }, [isGettingCurrentPrice]);

  useEffect(() => {
    if (!isGettingChapters) {
      if (chaptersData) {
        setViewCountApi(() =>
          chaptersData[0].map((chapter) => {
            return [
              apis.viewApi.getViewCountOfChapter,
              {
                params: {
                  chapterId: chapter.id,
                },
              },
            ];
          })
        );
        setReGetViewCounts({
          value: true,
        });
      }
    }
  }, [isGettingChapters]);

  useEffect(() => {
    if (!isGettingViewCounts) {
      if (viewCountsData) {
        setRender(true);
      }
    }
  }, [isGettingViewCounts]);

  useEffect(() => {
    if (selectChapterTransId !== null && selectedChapter) {
      if (selectedChapter.invoices.length > 0 || currentPrice <= 0) {
        navigate(
          paths.readerChapterContentPage(
            selectedChapter.storyId,
            selectedChapter.id,
            selectChapterTransId
          )
        );
      }
    }
  }, [selectChapterTransId]);

  if (!isRender) {
    return false;
  }

  return (
    <div>
      <div className="flex items-center text-[var(--primary)] font-[450] space-x-2">
        <span className="text-[1.8rem]">
          <i className="fa-solid fa-database"></i>
        </span>

        <span className="text-[1.2rem]">
          {t('reader.storyInfoPage.chapterListSection.title')}
        </span>
      </div>

      <div className="mt-2">
        {chaptersData && chaptersData?.[1] > 0 ? (
          <div className="w-full p-2 border-[2px] border-solid border-[var(--gray)]">
            <div>
              <div className="flex justify-between items-center border-b-[1px] border-solid border-[var(--gray)] pb-2 font-[450]">
                <div className="w-1/4 line-clamp-1">
                  {t(
                    'reader.storyInfoPage.chapterListSection.header.chapterName'
                  )}
                </div>
                <div className="w-1/4 text-center line-clamp-1">
                  {t(
                    'reader.storyInfoPage.chapterListSection.header.status.label'
                  )}
                </div>
                <div className="desktop:block tablet:block mobile:hidden w-1/4 text-center line-clamp-1">
                  {t(
                    'reader.storyInfoPage.chapterListSection.header.updatedTime'
                  )}
                </div>
                <div className="w-1/4 text-center line-clamp-1">
                  {t(
                    'reader.storyInfoPage.chapterListSection.header.viewCount'
                  )}
                </div>
              </div>
            </div>

            <div>
              {chaptersData?.[0].map((chapter, index) => {
                return (
                  <div
                    key={chapter.id}
                    className="flex justify-between items-center border-b-[1px] border-solid border-[var(--gray)] py-2 hover:text-[var(--primary)] hover:cursor-pointer gap-x-2"
                    onClick={() => setSelectChapter(chapter)}
                  >
                    <div className="w-1/4 line-clamp-1">{chapter.name}</div>
                    <div className="desktop:block tablet:block mobile:hidden w-1/4 text-center line-clamp-1">
                      <span
                        className={classNames(
                          'min-w-[98px] inline-block text-[var(--white)] px-2 py-1 rounded-[4px] text-[0.8rem]',
                          chapter.invoices.length > 0 || currentPrice <= 0
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        )}
                      >
                        {chapter.invoices.length > 0 || currentPrice <= 0
                          ? t(
                              'reader.storyInfoPage.chapterListSection.header.status.paid'
                            )
                          : t(
                              'reader.storyInfoPage.chapterListSection.header.status.unpaid'
                            )}
                      </span>
                    </div>
                    <div className="desktop:hidden tablet:hidden mobile:block w-1/4 text-center line-clamp-1">
                      {chapter.invoices.length > 0 || currentPrice <= 0 ? (
                        <i className="fa-solid fa-lock-open"></i>
                      ) : (
                        <i className="fa-solid fa-lock"></i>
                      )}
                    </div>
                    <div className="desktop:block tablet:block mobile:hidden w-1/4 text-center line-clamp-1">
                      {moment(chapter.updatedAt).format('DD/MM/YYYY HH:MM:SS')}
                    </div>
                    <div className="w-1/4 text-center line-clamp-1">
                      {NumberUtils.formatNumberWithSeparator(
                        String(viewCountsData?.[index])
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-4">
              <Pagination
                page={getChaptersReq.queries.page}
                count={
                  chaptersData?.[1]
                    ? Math.ceil(chaptersData[1] / getChaptersReq.queries.limit)
                    : 1
                }
                onChange={(_e, page) =>
                  setGetChapterReq({
                    queries: {
                      ...getChaptersReq.queries,
                      page,
                    },
                  })
                }
              />
            </div>
          </div>
        ) : (
          <div className="h-[120px]">
            <NoData />
          </div>
        )}
      </div>

      {selectedChapter && (
        <ChapterTransListPopup
          selectedChapter={selectedChapter}
          onClose={() => setSelectChapter(null)}
          onChange={(chapterTransId) => setSelectChapterTransId(chapterTransId)}
        />
      )}

      {selectChapterTransId !== null &&
        selectedChapter &&
        selectedChapter.invoices.length <= 0 &&
        currentPrice > 0 && (
          <Protected role={Role.READER} enable={!isAuthentication}>
            <PaymentRemindPopup
              chapter={selectedChapter}
              price={currentPrice}
              selectChapterTransId={selectChapterTransId}
              onClose={() => setSelectChapter(null)}
            />
          </Protected>
        )}
    </div>
  );
}

export default memo(ChaperSection);
