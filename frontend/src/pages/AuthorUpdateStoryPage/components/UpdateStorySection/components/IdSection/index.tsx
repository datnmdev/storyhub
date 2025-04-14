import Input from '@components/Input';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Story } from '@pages/ReaderHomePage/components/NewUpdateStorySection/NewUpdateStorySection.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { IdSectionProps } from './IdSection.type';
import IconButton from '@components/IconButton';

function IdSection({ storyId }: IdSectionProps) {
  const { t } = useTranslation();
  const { data: storyData, setRefetch: setReGetStory } = useFetch<
    [Story[], number]
  >(apis.storyApi.getStoryWithFilter, {
    queries: {
      id: storyId,
      page: 1,
      limit: 1,
    },
  });

  useEffect(() => {
    setReGetStory({
      value: true,
    });
  }, []);

  return (
    <div>
      <div className="grow space-y-1">
        <div>
          {t('author.storyManagementPage.uploadStoryPopup.form.id.title')}
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
                'author.storyManagementPage.uploadStoryPopup.form.id.placeholder'
              )}
              value={String(storyData?.[0]?.[0]?.id)}
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

export default memo(IdSection);
