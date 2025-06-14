import { RequestInit } from '@apis/api.type';
import { ChapterWithInvoiceRelation } from '@apis/chapter';
import apis from '@apis/index';
import Button from '@components/Button';
import MenuItem from '@components/MenuItem';
import Select from '@components/Select';
import useFetch from '@hooks/fetch.hook';
import PaymentRemindPopup from '@pages/ReaderStoryInfoPage/components/ChapterSection/components/PaymentRemindPopup';
import paths from '@routers/router.path';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

function Navigator() {
  const { storyId, chapterId, chapterTransId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [getChaptersReq] = useState<RequestInit>({
    queries: {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      storyId,
      orderBy: JSON.stringify([['order', 'DESC']]),
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
  const [getCurrentPriceReq] = useState<RequestInit>({
    queries: {
      storyId,
    },
  });
  const { data: currentPrice, isLoading: isGettingCurrentPrice } = useFetch(
    apis.priceApi.getCurrentPrice,
    getCurrentPriceReq
  );
  const [seletedChapter, setSeletedChapter] =
    useState<ChapterWithInvoiceRelation | null>(null);
  const [navigator, setNavigator] = useState<{
    previousIndex: number;
    nextIndex: number;
  }>({
    previousIndex: -1,
    nextIndex: -1,
  });

  useEffect(() => {
    if (getCurrentPriceReq) {
      setReGetChapters({
        value: true,
      });
    }
  }, [getCurrentPriceReq]);

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
        const currentChapterIndex = chaptersData[0].findIndex(
          (chapter) => chapter.id === Number(chapterId)
        );
        setNavigator({
          previousIndex: currentChapterIndex + 1,
          nextIndex: currentChapterIndex - 1,
        });
        setSeletedChapter(chaptersData[0][currentChapterIndex]);
      }
    }
  }, [isGettingChapters]);

  return (
    <div>
      <div className="flex justify-center space-x-2">
        <div>
          <Button
            disabled={
              chaptersData?.[0]
                ? navigator.previousIndex > chaptersData[0].length - 1
                : true
            }
            width={48}
            padding="8px"
            onClick={() => {
              if (chaptersData) {
                setSeletedChapter(chaptersData[0][navigator.previousIndex]);
                if (
                  (
                    chaptersData[0][
                      navigator.previousIndex
                    ] as ChapterWithInvoiceRelation
                  ).invoices.length > 0 ||
                  currentPrice <= 0
                ) {
                  navigate(
                    paths.readerChapterContentPage(
                      chaptersData?.[0][navigator.previousIndex].storyId,
                      chaptersData?.[0][navigator.previousIndex].id,
                      chaptersData?.[0][
                        navigator.previousIndex
                      ].chapterTranslations.findIndex(
                        (e) => e.id === Number(chapterTransId)
                      ) != -1
                        ? Number(chapterTransId)
                        : chaptersData?.[0][navigator.previousIndex]
                            .chapterTranslations[0].id
                    )
                  );
                  window.location.reload();
                }
              }
            }}
          >
            <div className="space-x-2 flex items-center">
              <span className="text-[1.4rem]">
                <i className="fa-solid fa-angle-left"></i>
              </span>

              {/* <span>{t('reader.chapterContentPage.btn.chapterPrevious')}</span> */}
            </div>
          </Button>
        </div>

        <div className="max-w-[184px] space-y-2">
          <Select value={chapterId}>
            {chaptersData?.[0].map((chapter) => {
              return (
                <MenuItem
                  key={chapter.id}
                  value={chapter.id}
                  onClick={() => {
                    setSeletedChapter(chapter);
                    if (chapter.invoices.length > 0 || currentPrice <= 0) {
                      window.location.href = paths.readerChapterContentPage(
                        chapter.storyId,
                        chapter.id,
                        chapter.chapterTranslations.findIndex(
                          (e) => e.id === Number(chapterTransId)
                        ) != -1
                          ? Number(chapterTransId)
                          : chapter.chapterTranslations[0].id
                      );
                    }
                  }}
                >
                  <div className="w-full flex justify-between items-center space-x-4">
                    <div className="line-clamp-1">{chapter.name}</div>

                    {chapter.invoices.length > 0 || currentPrice <= 0 ? (
                      <div>
                        <i className="fa-solid fa-lock-open"></i>
                      </div>
                    ) : (
                      <div>
                        <i className="fa-solid fa-lock"></i>
                      </div>
                    )}
                  </div>
                </MenuItem>
              );
            })}
          </Select>

          <Select value={chapterTransId}>
            {seletedChapter?.chapterTranslations?.map((chapterTrans) => {
              return (
                <MenuItem
                  key={chapterTrans.id}
                  value={chapterTrans.id}
                  onClick={() => {
                    if (chaptersData) {
                      const index = chaptersData[0].findIndex(
                        (chapter) => chapter.id === Number(chapterId)
                      );
                      if (
                        chaptersData[0][index].invoices.length > 0 ||
                        currentPrice <= 0
                      ) {
                        navigate(
                          paths.readerChapterContentPage(
                            chaptersData[0][index].storyId,
                            chaptersData[0][index].id,
                            chapterTrans.id
                          )
                        );
                        window.location.reload();
                      }
                    }
                  }}
                >
                  <div className="w-full flex justify-between items-center space-x-4">
                    <div className="line-clamp-1">
                      {chapterTrans.country.name}
                    </div>
                    {chapterTrans.translatorId ??
                      `(${t('reader.storyInfoPage.chapterListSection.chapterTransListPopup.original')})`}
                  </div>
                </MenuItem>
              );
            })}
          </Select>
        </div>

        <div>
          <Button
            width={48}
            padding="8px"
            disabled={navigator.nextIndex < 0}
            onClick={() => {
              if (chaptersData) {
                setSeletedChapter(chaptersData[0][navigator.nextIndex]);
                if (
                  (
                    chaptersData[0][
                      navigator.nextIndex
                    ] as ChapterWithInvoiceRelation
                  ).invoices.length > 0 ||
                  currentPrice <= 0
                ) {
                  navigate(
                    paths.readerChapterContentPage(
                      chaptersData?.[0][navigator.nextIndex].storyId,
                      chaptersData?.[0][navigator.nextIndex].id,
                      chaptersData?.[0][
                        navigator.nextIndex
                      ].chapterTranslations.findIndex(
                        (e) => e.id === Number(chapterTransId)
                      ) != -1
                        ? Number(chapterTransId)
                        : chaptersData?.[0][navigator.nextIndex]
                            .chapterTranslations[0].id
                    )
                  );
                  window.location.reload();
                }
              }
            }}
          >
            <div className="space-x-2 flex items-center">
              {/* <span>{t('reader.chapterContentPage.btn.chapterNext')}</span> */}

              <span className="text-[1.4rem]">
                <i className="fa-solid fa-angle-right"></i>
              </span>
            </div>
          </Button>
        </div>
      </div>

      {seletedChapter &&
        seletedChapter.invoices.length <= 0 &&
        currentPrice > 0 && (
          <PaymentRemindPopup
            chapter={seletedChapter}
            price={currentPrice}
            selectChapterTransId={seletedChapter.chapterTranslations[0].id}
            onClose={() => setSeletedChapter(null)}
          />
        )}
    </div>
  );
}

export default memo(Navigator);
