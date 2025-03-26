import { memo } from 'react';
import { TopStoryItemProps } from './TopStoryItemProps.type';
import UrlUtils from '@utilities/url.util';
import { useTranslation } from 'react-i18next';
import { StoryType } from '@constants/story.constants';
import NumberUtils from '@utilities/number.util';
import { Link } from 'react-router-dom';
import paths from '@routers/router.path';
import classNames from 'classnames';
import { useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';

function TopStoryItem({ index, data }: TopStoryItemProps) {
  const { t } = useTranslation();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);

  let strokeColor;
  switch (index) {
    case 0:
      strokeColor = '#4a90e2';
      break;

    case 1:
      strokeColor = '#25be9c';
      break;

    case 2:
      strokeColor = '#ff0000';
      break;

    default:
      strokeColor = themeValue === 'light' ? '#000' : '#FFF';
      break;
  }

  return (
    <Link
      className={classNames(
        'w-full flex justify-between items-center space-x-4 hover:bg-[var(--primary)] hover:text-[var(--white)] hover:cursor-pointer rounded-[4px] p-2 transition-all duration-200 ease-in-out overflow-hidden',
        themeValue === 'light'
          ? 'shadow-[0_0__8px_rgb(151,126,245,0.25)]'
          : 'dark__boxShadow'
      )}
      to={paths.readerStoryInfoPage(data.id)}
    >
      <div
        className="text-transparent font-[900] desktop:text-[2.6rem] tablet:text-[2.6rem] mobile:text-[2rem] desktop:w-[80px] tablet:w-[80px] mobile:w-[32px] flex justify-center items-center shrink-0"
        style={{
          WebkitTextStrokeWidth: '2px',
          WebkitTextStrokeColor: strokeColor,
        }}
      >
        {index + 1}
      </div>

      <div className="grow flex justify-between space-x-4 overflow-hidden">
        <div className="self-stretch desktop:block tablet:block mobile:flex items-center shrink-0">
          <img
            className="w-[60px] h-[84px] object-cover object-center"
            src={UrlUtils.generateUrl(data.coverImage)}
            alt="Cover Image"
          />
        </div>

        <div className="grow flex flex-col justify-between overflow-hidden">
          <h3 className="max-w-full text-[1.2rem] font-[500] line-clamp-1">
            {data.title}
          </h3>

          <div className="flex desktop:flex-row tablet:flex-row mobile:flex-col desktop:items-center tablet:items-center mobile:items-start">
            <div className="grow space-x-1">
              <span>
                {t(
                  'reader.rankPage.topViewSection.topStoryList.item.type.label'
                )}
              </span>
              <span className="font-[450]">
                {data.type === StoryType.COMIC
                  ? t(
                      'reader.rankPage.topViewSection.topStoryList.item.type.comic'
                    )
                  : t(
                      'reader.rankPage.topViewSection.topStoryList.item.type.novel'
                    )}
              </span>
            </div>

            <div className="grow space-x-1">
              <span>
                {t('reader.rankPage.topViewSection.topStoryList.item.author')}
              </span>
              <span className="font-[450]">{data.author.userProfile.name}</span>
            </div>
          </div>

          <div className="grow line-clamp-1 overflow-hidden">
            <span className="mr-1">
              {t('reader.rankPage.topViewSection.topStoryList.item.genre')}
            </span>
            <span className="font-[450]">
              {data.genres.map((genre: any) => genre.name).join(', ')}
            </span>
          </div>

          <div className="grow flex items-center space-x-1">
            <span>
              {t(
                'reader.rankPage.topFollowSection.topStoryList.item.followCount.label'
              )}
            </span>
            <span className="font-[450]">
              {t(
                'reader.rankPage.topFollowSection.topStoryList.item.followCount.content',
                {
                  value: NumberUtils.formatNumberWithSeparator(
                    String(data.followCount)
                  ),
                }
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(TopStoryItem);
