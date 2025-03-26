import themeFeature from '@features/theme';
import classNames from 'classnames';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ItemProps } from './Item.type';
import UrlUtils from '@utilities/url.util';
import { StoryStatus, StoryType } from '@constants/story.constants';
import paths from '@routers/router.path';

function Item({ data }: ItemProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const themeValue = useSelector(themeFeature.themeSelector.selectValue);

  return (
    <div
      className="hover:cursor-pointer hover:bg-[var(--primary)] hover:text-[var(--white)] transition-colors duration-200 ease-in-out"
      onClick={() => {
        navigate(paths.readerStoryInfoPage(data.id));
        window.location.reload();
      }}
    >
      <div className="flex justify-between space-x-2 p-2 bg-inherit">
        <div className="h-full shrink-0">
          <img
            className={classNames(
              'w-16 h-full object-cover object-center rounded-[4px]',
              themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow'
            )}
            src={UrlUtils.generateUrl(data.coverImage)}
            alt="Cover Image"
          />
        </div>

        <div className="grow flex flex-col justify-start space-y-1.5 text-inherit">
          <h3 className="font-[450] line-clamp-1">{data.title}</h3>

          <div className="text-[0.9rem] space-y-1.5">
            <div className="space-x-2">
              <span>{t('reader.header.searchSection.item.type.label')}</span>
              <span className="bg-red-500 text-[var(--white)] text-[0.8rem] px-1 py-0.5 rounded-[4px]">
                {data.type === StoryType.COMIC &&
                  t('reader.header.searchSection.item.type.comic')}
                {data.type === StoryType.NOVEL &&
                  t('reader.header.searchSection.item.type.novel')}
              </span>
            </div>

            <div className="space-x-2">
              <span>{t('reader.header.searchSection.item.author')}</span>
              <span>{data.author.userProfile.name}</span>
            </div>

            <div className="space-x-2">
              <span>{t('reader.header.searchSection.item.country')}</span>
              <span>{data.country.name}</span>
            </div>

            <div className="space-x-2">
              <span>{t('reader.header.searchSection.item.status.label')}</span>
              <span
                className={classNames(
                  'text-[var(--white)] text-[0.8rem] px-1 py-0.5 rounded-[4px]',
                  data.status === StoryStatus.RELEASING
                    ? 'bg-green-500'
                    : 'bg-sky-500'
                )}
              >
                {data.status === StoryStatus.RELEASING &&
                  t('reader.header.searchSection.item.status.publishing')}
                {data.status === StoryStatus.COMPLETED &&
                  t('reader.header.searchSection.item.status.finished')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Item);
