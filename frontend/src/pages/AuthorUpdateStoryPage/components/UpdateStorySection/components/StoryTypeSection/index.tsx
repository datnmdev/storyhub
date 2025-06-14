import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Story } from '@pages/ReaderHomePage/components/NewUpdateStorySection/NewUpdateStorySection.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { StoryTypeSectionProps } from './StoryTypeSection.type';
import IconButton from '@components/IconButton';
import Select from '@components/Select';
import MenuItem from '@components/MenuItem';
import { StoryType } from '@constants/story.constants';

function StoryTypeSection({ storyId }: StoryTypeSectionProps) {
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
          {t('author.storyManagementPage.uploadStoryPopup.form.type.title')}
        </div>
        <div className="flex items-center justify-between">
          <div className="grow">
            <Select
              name="type"
              value={storyData?.[0]?.[0].type ?? '-1'}
              readOnly
            >
              <MenuItem value="-1" disabled>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.type.title'
                )}
              </MenuItem>
              <MenuItem value={String(StoryType.NOVEL)}>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.type.values.novel'
                )}
              </MenuItem>
              <MenuItem value={String(StoryType.COMIC)}>
                {t(
                  'author.storyManagementPage.uploadStoryPopup.form.type.values.comic'
                )}
              </MenuItem>
            </Select>
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

export default memo(StoryTypeSection);
