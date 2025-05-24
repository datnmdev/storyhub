import Input from '@components/Input';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import IconButton from '@components/IconButton';
import { Chapter } from '@apis/chapter';
import { StatusSectionProps } from './StatusSection.type';

function StatusSection({ chapterId }: StatusSectionProps) {
  const { t } = useTranslation();
  const { data: chapterData, setRefetch: setReGetChapter } = useFetch<
    [Chapter[], number]
  >(apis.chapterApi.getChapterForAuthorWithFilter, {
    queries: {
      id: chapterId,
      page: 1,
      limit: 1,
    },
  });

  useEffect(() => {
    setReGetChapter({
      value: true,
    });
  }, []);

  return (
    <div>
      <div className="grow space-y-1">
        <div>
          {t(
            'author.updateStoryPage.chapterManagementSection.updateChapterPopup.status.title'
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="grow">
            <Input
              sx={{
                borderRadius: 4,
              }}
              readOnly={true}
              name="id"
              type="text"
              placeholder={t(
                'author.updateStoryPage.chapterManagementSection.updateChapterPopup.status.placeholder'
              )}
              value={t(`chapterStatus.${chapterData?.[0]?.[0]?.status}`)}
            />
          </div>

          <IconButton
            icon={<i className="fa-solid fa-pen text-[1.2rem] p-4"></i>}
            sx={{
              visibility: 'hidden',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(StatusSection);
