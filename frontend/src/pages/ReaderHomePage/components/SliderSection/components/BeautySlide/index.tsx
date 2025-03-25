import Slide from '@components/Slider/components/Slide';
import themeFeature from '@features/theme';
import { useAppSelector } from '@hooks/redux.hook';
import { Rating } from '@mui/material';
import classNames from 'classnames';
import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StarBorderRounded, StarRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Button from '@components/Button';
import CoinIcon from '@assets/icons/static/coin.png';
import { BeautySlideProps } from './BeautySlide.type';
import useFetchAll from '@hooks/fetchAll.hook';
import apis from '@apis/index';
import UrlUtils from '@utilities/url.util';
import { StoryType } from '@constants/story.constants';
import NumberUtils from '@utilities/number.util';
import paths from '@routers/router.path';

function BeautySlide({ data }: BeautySlideProps) {
  const navigate = useNavigate();
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
          limit: 1,
        },
      },
    ],
  ]);

  if (isLoading || responsesData === null) {
    return null;
  }

  return (
    <Slide>
      <div
        className={classNames(
          'min-h-[260px] flex flex-col justify-between m-2 p-4 rounded-[4px] overflow-hidden',
          themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow'
        )}
      >
        <div className="grow flex space-x-4">
          <div className="relative shrink-0">
            <img
              className={classNames(
                'w-[132px] h-[198px] object-cover object-center rounded-[4px]',
                themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow'
              )}
              src={UrlUtils.generateUrl(data.coverImage)}
              alt="Cover Image"
            />

            <span className="animate-blink absolute top-2 right-2 bg-red-500 rounded-[4px] text-[0.8rem] py-1 px-2 text-[var(--white)] font-semibold">
              {data.type === StoryType.COMIC
                ? t('reader.homePage.topViewSlider.storyType.comic')
                : t('reader.homePage.topViewSlider.storyType.novel')}
            </span>
          </div>

          <div className="grow flex flex-col justify-between space-y-2">
            <div className="grow">
              <Link
                className="grow hover:text-[var(--primary)]"
                to={paths.readerStoryInfoPage(String(data.id))}
                state={data}
              >
                <h3 className="font-semibold text-[1.2rem] line-clamp-1">
                  {data.title}
                </h3>
              </Link>

              <p
                dangerouslySetInnerHTML={{
                  __html: data.description,
                }}
                className="w-full text-[var(--dark-gray)] line-clamp-6"
              />
            </div>

            <div className="desktop:flex tablet:hidden mobile:hidden justify-between items-center">
              <div className="flex items-center leading-7">
                <div className="bg-[var(--primary)] text-[var(--white)] px-4 py-1 rounded-[4px] font-semibold">
                  {responsesData[4].ratingCount === 0
                    ? (0).toFixed(1)
                    : (
                        responsesData[4].starCount /
                        responsesData[4].ratingCount
                      ).toFixed(1)}
                </div>

                <div className="flex items-center">
                  <Rating
                    defaultValue={0}
                    value={NumberUtils.roundToDecimal(
                      responsesData[4].ratingCount === 0
                        ? 0
                        : responsesData[4].starCount /
                            responsesData[4].ratingCount,
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
                      fontSize: '2.2rem',
                      padding: 0,
                      '& .MuiRating-icon': {
                        width: '1.8rem',
                      },
                    }}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <Button
                  width={72}
                  height={28}
                  borderRadius="4px"
                  bgColor="#48b528"
                  onClick={() => navigate('#')}
                >
                  {t('reader.homePage.topViewSlider.btn.readBtn')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 desktop:hidden tablet:flex mobile:flex justify-between items-center">
          <div className="flex items-center leading-7">
            <div className="bg-[var(--primary)] text-[var(--white)] px-4 py-1 rounded-[4px] font-semibold">
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
                    : responsesData[4].starCount / responsesData[4].ratingCount,
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
                  fontSize: '2.2rem',
                  padding: 0,
                  '& .MuiRating-icon': {
                    width: '1.8rem',
                  },
                }}
                readOnly
              />
            </div>
          </div>

          <div>
            <Button
              width={72}
              height={28}
              borderRadius="4px"
              bgColor="#48b528"
              onClick={() => navigate('#')}
            >
              {t('reader.homePage.topViewSlider.btn.readBtn')}
            </Button>
          </div>
        </div>

        <div className="mt-4 flex justify-center items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span>
              <img className="w-8" src={CoinIcon} alt="Coin Icon" />
            </span>

            <span className="text-[0.9rem]">
              {t('reader.homePage.topViewSlider.ortherInfo.priceCount', {
                value: NumberUtils.formatNumber(responsesData[0]),
              })}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[1.6rem]">
              <i className="fa-regular fa-eye"></i>
            </span>

            <span className="text-[0.9rem]">
              {t('reader.homePage.topViewSlider.ortherInfo.viewCount', {
                value: NumberUtils.formatNumber(responsesData[1]),
              })}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-red-500 text-[1.6rem]">
              <i className="fa-regular fa-heart"></i>
            </span>

            <span className="text-[0.9rem]">
              {t('reader.homePage.topViewSlider.ortherInfo.followerCount', {
                value: NumberUtils.formatNumber(responsesData[2]),
              })}
            </span>
          </div>
        </div>
      </div>
    </Slide>
  );
}

export default memo(BeautySlide);
