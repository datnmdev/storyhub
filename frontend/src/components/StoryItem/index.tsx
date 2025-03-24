import { memo } from 'react';
import { StoryItemProps } from './StoryItem.type';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';
import CoinIcon from '@assets/icons/static/coin.png';
import { Rating } from '@mui/material';
import StarRounded from '@mui/icons-material/StarRounded';
import StarBorderRounded from '@mui/icons-material/StarBorderRounded';
import { Link } from 'react-router-dom';
import UrlUtils from '@utilities/url.util';
import { StoryType } from '@constants/story.constants';
import { timeAgo } from '@utilities/date.util';
import useFetchAll from '@hooks/fetchAll.hook';
import apis from '@apis/index';
import NumberUtils from '@utilities/number.util';
import { Chapter } from '@apis/chapter';

function StoryItem({ data }: StoryItemProps) {
  const { t } = useTranslation();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const { data: responsesData, isLoading } = useFetchAll([
    [
      apis.priceApi.getCurrentPrice,
      {
        queries: {
          storyId: data.id,
        },
      },
    ],
    [
      apis.viewApi.getViewCountOfStory,
      {
        params: {
          storyId: data.id,
        },
      },
    ],
    [
      apis.followApi.getFollowerCount,
      {
        queries: {
          storyId: data.id,
        },
      },
    ],
    [
      apis.ratingApi.getRatingCount,
      {
        queries: {
          storyId: data.id,
        },
      },
    ],
    [
      apis.ratingApi.getRatingSummary,
      {
        queries: {
          storyId: data.id,
        },
      },
    ],
    [
      apis.chapterApi.getChapterWithFilter,
      {
        queries: {
          storyId: data.id,
          page: 1,
          limit: 3,
        },
      },
    ],
  ]);

  const currTime = new Date();

  if (isLoading || responsesData === null) {
    return null;
  }

  return (
    <div
      className={classNames(
        'w-full rounded-[4px] overflow-hidden',
        themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow'
      )}
    >
      <div className="relative">
        <div>
          <Link className="block h-[270px] overflow-hidden" to="#">
            <img
              className="w-full h-full object-cover object-center transition-transform duration-300 ease-in hover:scale-150"
              src={UrlUtils.generateUrl(data.coverImage)}
              alt="Cover Image"
            />
          </Link>
        </div>

        <div className="animate-blink absolute top-2 left-2 bg-red-500 rounded-[4px] text-[0.8rem] py-1 px-2 text-[var(--white)] font-semibold">
          {t(
            data.type === StoryType.COMIC
              ? 'reader.homePage.newUpdatedSection.storyType.comic'
              : 'reader.homePage.newUpdatedSection.storyType.novel'
          )}
        </div>

        <div className="desktop:max-w-max tablet:max-w-max mobile:max-w-[92px] line-clamp-1 absolute top-2 right-2 bg-[var(--primary)] rounded-[4px] text-[0.8rem] py-1 px-2 text-[var(--white)] font-semibold">
          {t(
            `reader.homePage.newUpdatedSection.timestamps.${timeAgo(new Date(data.updatedAt), currTime).type}`,
            { value: timeAgo(new Date(data.updatedAt), currTime).value }
          )}
        </div>
      </div>

      <div className="p-2 space-y-2">
        <div>
          <div className="flex justify-between items-center">
            <div className="w-[calc(100%/3)] flex items-center justify-center space-x-0.5">
              <span>
                <img className="w-6 inline" src={CoinIcon} alt="Coin Icon" />
              </span>

              <span className="text-[0.8rem]">
                {t('reader.homePage.newUpdatedSection.ortherInfo.priceCount', {
                  value: NumberUtils.formatNumber(responsesData[0]),
                })}
              </span>
            </div>

            <div className="w-[calc(100%/3)] flex items-center justify-center space-x-0.5">
              <span className="text-[1.12rem]">
                <i className="fa-regular fa-eye"></i>
              </span>

              <span className="text-[0.8rem]">
                {t('reader.homePage.newUpdatedSection.ortherInfo.viewCount', {
                  value: NumberUtils.formatNumber(responsesData[1]),
                })}
              </span>
            </div>

            <div className="w-[calc(100%/3)] flex items-center justify-center space-x-0.5">
              <span className="text-red-500 text-[1.12rem]">
                <i className="fa-regular fa-heart"></i>
              </span>

              <span className="text-[0.8rem]">
                {t(
                  'reader.homePage.newUpdatedSection.ortherInfo.followerCount',
                  { value: NumberUtils.formatNumber(responsesData[2]) }
                )}
              </span>
            </div>
          </div>
        </div>

        <div>
          <Link className="hover:text-[var(--primary)]" to="#">
            <h3 className="text-[1.2rem] font-[450] line-clamp-1">
              {data.title}
            </h3>
          </Link>
        </div>

        <div className="flex items-center">
          <div className="flex items-center leading-4">
            <div className="bg-[var(--primary)] text-[var(--white)] px-2 py-1 rounded-[12px] text-[0.9rem] font-semibold">
              {responsesData[4].ratingCount === 0
                ? (0).toFixed(1)
                : (
                    responsesData[4].starCount / responsesData[4].ratingCount
                  ).toFixed(1)}
            </div>

            <div className="flex items-center">
              <Rating
                defaultValue={0}
                value={NumberUtils.roundToDecimal(
                  responsesData[4].ratingCount === 0
                    ? 0
                    : (responsesData[4].starCount /
                        (responsesData[4].ratingCount * 5)) *
                        5,
                  1
                )}
                precision={0.1}
                icon={<StarRounded fontSize="inherit" />}
                emptyIcon={
                  <StarBorderRounded
                    fontSize="inherit"
                    sx={{
                      color: 'var(--gray)',
                    }}
                  />
                }
                sx={{
                  fontSize: '1.8rem',
                  padding: 0,
                  '& .MuiRating-icon': {
                    width: '1.4rem',
                  },
                }}
                readOnly
              />
            </div>
          </div>

          <div className="desktop:block tablet:block mobile:hidden ml-2 text-[0.75rem]">
            (
            {t('reader.homePage.newUpdatedSection.ortherInfo.ratingCountText', {
              value: NumberUtils.formatNumber(responsesData[3]),
            })}
            )
          </div>

          <div className="desktop:hidden tablet:hidden mobile:block ml-2 text-[0.75rem]">
            ({NumberUtils.formatNumber(responsesData[3])})
          </div>
        </div>

        <ul className="mt-1">
          {responsesData[5][0].map((chapter: Chapter) => {
            return (
              <li key={chapter.id}>
                <Link
                  className="w-full flex justify-between items-center space-x-2 py-1 group"
                  to="#"
                >
                  <div className="line-clamp-1 grow font-[400] group-hover:text-[var(--primary)]">
                    {chapter.name}
                  </div>

                  <div className="desktop:max-w-[100px] tablet:max-w-[100px] mobile:max-w-[72px] text-right italic text-[0.8rem] text-[var(--dark-gray)] group-hover:text-[var(--primary)] shrink-0">
                    {t(
                      `reader.homePage.newUpdatedSection.timestamps.${timeAgo(new Date(chapter.updatedAt), currTime).type}`,
                      {
                        value: timeAgo(new Date(chapter.updatedAt), currTime)
                          .value,
                      }
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default memo(StoryItem);
