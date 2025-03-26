import Popup from '@components/Popup';
import { memo } from 'react';
import { ChapterTransListPopupProps } from './ChapterTransListPopup.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import Loading from '@components/Loading';
import { useTranslation } from 'react-i18next';

function ChapterTransListPopup({
  selectedChapter,
  onClose,
  onChange,
}: ChapterTransListPopupProps) {
  const { t } = useTranslation();
  const { data: chapterTransData, isLoading: isGettingChapterTrans } = useFetch(
    apis.chapterApi.getChapterTranslation,
    {
      params: {
        chapterId: selectedChapter.id,
      },
    }
  );

  if (isGettingChapterTrans) {
    return <Loading />;
  }

  if (chapterTransData) {
    return (
      <Popup
        title={t(
          'reader.storyInfoPage.chapterListSection.chapterTransListPopup.title'
        )}
        onClose={onClose}
      >
        {chapterTransData.chapterTranslations.map((chapterTrans: any) => {
          return (
            <div
              key={chapterTrans.id}
              className="py-2 px-4 border-b-[1px] border-solid border-[var(--gray)] hover:text-[var(--primary)] cursor-pointer select-none"
              onClick={() => {
                onChange(chapterTrans.id);
              }}
            >
              {chapterTrans.country.name} (
              {t(
                'reader.storyInfoPage.chapterListSection.chapterTransListPopup.original'
              )}
              )
            </div>
          );
        })}
      </Popup>
    );
  }
}

export default memo(ChapterTransListPopup);
