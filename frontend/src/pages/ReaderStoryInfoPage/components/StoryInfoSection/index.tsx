import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import WhiteCoinIcon from '@assets/icons/static/white-coin.png';
import { useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Rating } from '@mui/material';
import { StarBorderRounded, StarRounded } from '@mui/icons-material';
import IconButton from '@components/IconButton';
import SpeakerIcon from '@assets/icons/static/speaker.png';
import useFetchAll from '@hooks/fetchAll.hook';
import apis from '@apis/index';
import UrlUtils from '@utilities/url.util';
import { StoryStatus, StoryType } from '@constants/story.constants';
import NumberUtils from '@utilities/number.util';
import useFetch from '@hooks/fetch.hook';
import { Story } from '@pages/ReaderHomePage/components/NewUpdateStorySection/NewUpdateStorySection.type';
import { useDispatch } from 'react-redux';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import { RatingSummary } from '@apis/rating';
import Protected from '@components/Protected';
import { Role } from '@constants/user.constants';
import paths from '@routers/router.path';

function StoryInfoSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { storyId } = useParams();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const { data: storyData } = useFetch<[Story[], number]>(
    apis.storyApi.getStoryWithFilter,
    {
      queries: {
        page: 1,
        limit: 1,
        id: storyId,
      },
    }
  );
  const { data, setRefetch } = useFetchAll(
    [
      [
        apis.storyApi.getStoryWithFilter,
        {
          queries: {
            page: 1,
            limit: 1,
            id: storyId,
          },
        },
      ],
      [
        apis.priceApi.getCurrentPrice,
        {
          queries: {
            storyId,
          },
        },
      ],
      [
        apis.aliasApi.getAliasByStoryId,
        {
          queries: {
            storyId,
          },
        },
      ],
      [
        apis.userApi.getUserProfileInfo,
        {
          params: {
            id: storyData?.[0][0].authorId,
          },
        },
      ],
      [
        apis.followApi.getFollowerCount,
        {
          queries: {
            storyId,
          },
        },
      ],
      [
        apis.viewApi.getViewCountOfStory,
        {
          params: {
            storyId,
          },
        },
      ],
      [
        apis.countryApi.getCountries,
        {
          queries: {
            id: storyData?.[0][0].countryId,
            page: 1,
            limit: 1,
          },
        },
      ],
      [
        apis.ratingApi.getRatingSummary,
        {
          queries: {
            storyId,
          },
        },
      ],
      [
        apis.storyApi.getGenres,
        {
          queries: {
            storyId,
          },
        },
      ],
      [
        apis.chapterApi.getChapterWithFilter,
        {
          queries: {
            page: 1,
            limit: 1,
            storyId,
            orderBy: JSON.stringify([
              ['order', 'ASC'],
              ['id', 'ASC'],
            ]),
          },
        },
      ],
    ],
    false
  );
  const [stars, setStars] = useState<number | null>(null);
  const [isEnableProtected, setEnableProtected] = useState<boolean>(false);
  const {
    data: isEvoluated,
    error: createRatingError,
    setRefetch: setReCreateRating,
  } = useFetch(
    apis.ratingApi.createRating,
    {
      body: {
        storyId: Number(storyId),
        stars,
      },
    },
    false
  );
  const {
    data: isUpdatedRating,
    error: updateRatingError,
    setRefetch: setReUpdateRating,
  } = useFetch(
    apis.ratingApi.updateRating,
    {
      body: {
        storyId: Number(storyId),
        stars,
      },
    },
    false
  );
  const { data: ratingSumaryData, setRefetch: setReGetRatingSummary } =
    useFetch<RatingSummary>(
      apis.ratingApi.getRatingSummary,
      {
        queries: {
          storyId,
        },
      },
      false
    );
  const { data: ratingData, setRefetch: setReGetRating } = useFetch(
    apis.ratingApi.getRating,
    {
      queries: {
        storyId,
      },
    },
    true
  );
  const [isFollow, setFollow] = useState<boolean>(false);
  const { data: createfollowData, setRefetch: setReCreateFollow } = useFetch(
    apis.followApi.follow,
    {
      body: {
        storyId: Number(storyId),
      },
    },
    false
  );
  const { data: isUnfollow, setRefetch: setReUnfollow } = useFetch(
    apis.followApi.unfollow,
    {
      queries: {
        storyId,
      },
    },
    false
  );
  const { data: followCount, setRefetch: setReGetFollowCount } = useFetch(
    apis.followApi.getFollowerCount,
    {
      queries: {
        storyId,
      },
    },
    false
  );
  const { data: followData, isLoading: isGettingFollow } = useFetch(
    apis.followApi.getFollow,
    {
      queries: {
        storyId,
      },
    }
  );

  useEffect(() => {
    if (storyData) {
      setRefetch({
        value: true,
      });
    }
  }, [storyData]);

  useEffect(() => {
    if (stars) {
      if (ratingData) {
        setReUpdateRating({
          value: true,
        });
      } else {
        setReCreateRating({
          value: true,
        });
      }
    }
  }, [stars]);

  useEffect(() => {
    if (isEvoluated || isUpdatedRating) {
      setReGetRating({
        value: true,
      });
      setReGetRatingSummary({
        value: true,
      });
    }
  }, [isEvoluated, isUpdatedRating]);

  useEffect(() => {
    if (isEvoluated) {
      dispatch(
        toastFeature.toastAction.add({
          type: ToastType.SUCCESS,
          title: t('notification.createRatingSuccess'),
        })
      );
    } else {
      if (createRatingError) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.ERROR,
            title: t('notification.createRatingFailed'),
          })
        );
      }
    }
  }, [isEvoluated, createRatingError]);

  useEffect(() => {
    if (isUpdatedRating) {
      dispatch(
        toastFeature.toastAction.add({
          type: ToastType.SUCCESS,
          title: t('notification.updateRatingSuccess'),
        })
      );
    } else {
      if (updateRatingError) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.ERROR,
            title: t('notification.updateRatingFailed'),
          })
        );
      }
    }
  }, [isUpdatedRating, updateRatingError]);

  useEffect(() => {
    if (createfollowData) {
      dispatch(
        toastFeature.toastAction.add({
          type: ToastType.SUCCESS,
          title: t('notification.followSuccess'),
        })
      );
      setFollow(true);
    }
  }, [createfollowData]);

  useEffect(() => {
    if (isUnfollow) {
      dispatch(
        toastFeature.toastAction.add({
          type: ToastType.SUCCESS,
          title: t('notification.unfollowSuccess'),
        })
      );
      setFollow(false);
    }
  }, [isUnfollow]);

  useEffect(() => {
    if (!isGettingFollow) {
      if (followData) {
        setFollow(true);
      }
    }
  }, [isGettingFollow]);

  useEffect(() => {
    setReGetFollowCount({
      value: true,
    });
  }, [isFollow]);

  if (data) {
    return (
      <div className="space-y-6">
        <div className="flex desktop:flex-row tablet:flex-row mobile:flex-col desktop:justify-between tablet:justify-between mobile:justify-start desktop:items-start tablet:items-start mobile:stretch desktop:space-x-4 tablet:space-x-4 mobile:space-x-0">
          <div className="desktop:block tablet:block mobile:flex mobile:justify-center">
            <img
              className={classNames(
                'w-[220px] h-[344px] object-cover object-center rounded-[4px]',
                themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow'
              )}
              src={UrlUtils.generateUrl(data[0][0][0].coverImage)}
              alt="Cover Image"
            />
          </div>

          <div className="grow desktop:mt-0 tablet:mt-0 mobile:mt-4 desktop:block tablet:block mobile:flex mobile:flex-col mobile:items-center">
            <div>
              <h3 className="text-[1.4rem] font-[450]">
                {data[0][0][0].title}
              </h3>
            </div>

            <div className="flex items-stretch mt-2 space-x-2">
              <div className="bg-red-500 px-3 py-1.5 text-[var(--white)] rounded-[8px] border-[1px] border-solid border-red-500">
                {data[0][0][0].type === StoryType.COMIC
                  ? t('reader.storyInfoPage.storyInfoSection.storyType.comic')
                  : t('reader.storyInfoPage.storyInfoSection.storyType.novel')}
              </div>

              <div
                className={classNames(
                  'bg-black px-3 py-1.5 text-[var(--white)] rounded-[8px] flex items-center space-x-1 border-[1px] border-solid',
                  themeValue === 'light' ? 'border-black' : 'border-white'
                )}
              >
                <span>
                  <img className="w-6" src={WhiteCoinIcon} alt="Coin Icon" />
                </span>

                <span>
                  {t(
                    'reader.storyInfoPage.storyInfoSection.ortherInfo.priceCount',
                    {
                      value: NumberUtils.formatNumberWithSeparator(
                        String(data[1])
                      ),
                    }
                  )}
                </span>
              </div>
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center">
                <div className="min-w-40 space-x-2">
                  <span className="text-[1.2rem]">
                    <i className="fa-solid fa-plus"></i>
                  </span>

                  <span>
                    {t('reader.storyInfoPage.storyInfoSection.alias.label')}
                  </span>
                </div>

                <div>
                  {data[2].length > 0
                    ? data[2].map((alias: any) => alias.name).join('')
                    : t('reader.storyInfoPage.storyInfoSection.alias.notData')}
                </div>
              </div>

              <div className="flex items-center">
                <div className="min-w-40 space-x-2">
                  <span className="text-[1.2rem]">
                    <i className="fa-solid fa-user"></i>
                  </span>

                  <span>
                    {t('reader.storyInfoPage.storyInfoSection.author')}
                  </span>
                </div>

                <div>
                  <Link className="hover:text-[var(--primary)]" to="#">
                    {data[3].name}
                  </Link>
                </div>
              </div>

              <div className="flex items-center">
                <div className="min-w-40 space-x-2">
                  <span className="text-[1.2rem]">
                    <i className="fa-solid fa-repeat"></i>
                  </span>

                  <span>
                    {t('reader.storyInfoPage.storyInfoSection.status.label')}
                  </span>
                </div>

                <div>
                  {data[0][0][0].status === StoryStatus.RELEASING
                    ? t(
                        'reader.storyInfoPage.storyInfoSection.status.publishing'
                      )
                    : t(
                        'reader.storyInfoPage.storyInfoSection.status.finished'
                      )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="min-w-40 space-x-2">
                  <span className="text-[1.2rem]">
                    <i className="fa-regular fa-heart"></i>
                  </span>

                  <span>
                    {t(
                      'reader.storyInfoPage.storyInfoSection.followerCount.label'
                    )}
                  </span>
                </div>

                <div>
                  {t(
                    'reader.storyInfoPage.storyInfoSection.followerCount.content',
                    {
                      value: NumberUtils.formatNumberWithSeparator(
                        String(followCount !== null ? followCount : data[4])
                      ),
                    }
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="min-w-40 space-x-2">
                  <span className="text-[1.2rem]">
                    <i className="fa-regular fa-eye"></i>
                  </span>

                  <span>
                    {t('reader.storyInfoPage.storyInfoSection.viewCount.label')}
                  </span>
                </div>

                <div>
                  {t(
                    'reader.storyInfoPage.storyInfoSection.viewCount.content',
                    {
                      value: NumberUtils.formatNumberWithSeparator(
                        String(data[5])
                      ),
                    }
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="min-w-40 space-x-2">
                  <span className="text-[1.2rem]">
                    <i className="fa-solid fa-globe"></i>
                  </span>

                  <span>
                    {t('reader.storyInfoPage.storyInfoSection.country')}
                  </span>
                </div>

                <div>{data[6][0][0].name}</div>
              </div>

              <div className="flex items-center">
                <div className="min-w-40 space-x-2">
                  <span className="text-[1.2rem]">
                    <i className="fa-regular fa-star"></i>
                  </span>

                  <span>
                    {t('reader.storyInfoPage.storyInfoSection.rating.label')}
                  </span>
                </div>

                <div className="space-x-2">
                  <span className="px-4 py-2 bg-[var(--primary)] rounded-[4px] text-[var(--white)] font-bold">
                    {ratingSumaryData
                      ? ratingSumaryData.ratingCount === 0
                        ? (0).toFixed(1)
                        : (
                            ratingSumaryData.starCount /
                            ratingSumaryData.ratingCount
                          ).toFixed(1)
                      : data[7].ratingCount === 0
                        ? (0).toFixed(1)
                        : (data[7].starCount / data[7].ratingCount).toFixed(1)}
                  </span>

                  <span className="text-[1.2rem]">-</span>

                  <span>
                    {t('reader.storyInfoPage.storyInfoSection.rating.content', {
                      value: NumberUtils.formatNumberWithSeparator(
                        String(
                          ratingSumaryData?.ratingCount || data[7].ratingCount
                        )
                      ),
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center">
              <div className="mr-2">
                <Protected role={Role.READER} enable={isEnableProtected}>
                  <Rating
                    defaultValue={0}
                    value={ratingData?.stars ? ratingData.stars : 0}
                    precision={1}
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
                      fontSize: '2.8rem',
                      padding: 0,
                      '& .MuiRating-icon': {
                        width: '2.2rem',
                      },
                      marginLeft: -1,
                    }}
                    onChange={(_e, value) => {
                      setEnableProtected(true);
                      setStars(value);
                    }}
                  />
                </Protected>
              </div>

              <div>
                (
                {ratingData?.stars
                  ? t(
                      'reader.storyInfoPage.storyInfoSection.rating.status.evaluated',
                      { value: ratingData.stars }
                    )
                  : t(
                      'reader.storyInfoPage.storyInfoSection.rating.status.notEvaluated'
                    )}
                )
              </div>
            </div>

            <div className="flex flex-wrap desktop:justify-start tablet:justify-start mobile:justify-center items-center -ml-2 -mt-2">
              {data[8].map((genre: any) => {
                return (
                  <Link
                    key={genre.id}
                    className="ml-2 mt-2 border-[2px] border-solid border-[var(--primary)] px-4 py-2 rounded-[4px] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--white)] transition-colors duration-200 ease-in-out"
                    to="#"
                  >
                    {genre.name}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 flex items-center space-x-2">
              <IconButton
                icon={<i className="fa-solid fa-book-open text-[1.4rem]"></i>}
                bgColor="#8bc24a"
                width={130}
                height={42}
                borderRadius="4px"
                color="var(--white)"
                onClick={() =>
                  navigate(
                    paths.readerChapterContentPage(
                      data[9][0][0].storyId,
                      data[9][0][0].id,
                      data[9][0][0].chapterTranslations[0].id
                    )
                  )
                }
              >
                {t(
                  'reader.storyInfoPage.storyInfoSection.btn.readFromBeginning'
                )}
              </IconButton>

              <Protected role={Role.READER} enable={isEnableProtected}>
                <IconButton
                  icon={
                    isFollow ? (
                      <i className="fa-solid fa-heart text-[1.4rem]"></i>
                    ) : (
                      <i className="fa-regular fa-heart text-[1.4rem]"></i>
                    )
                  }
                  bgColor="#ff3860"
                  width={130}
                  height={42}
                  borderRadius="4px"
                  color="var(--white)"
                  onClick={() => {
                    setEnableProtected(true);
                    if (isFollow) {
                      setReUnfollow({
                        value: true,
                      });
                    } else {
                      setReCreateFollow({
                        value: true,
                      });
                    }
                  }}
                >
                  {isFollow
                    ? t('reader.storyInfoPage.storyInfoSection.btn.unfollow')
                    : t('reader.storyInfoPage.storyInfoSection.btn.follow')}
                </IconButton>
              </Protected>
            </div>
          </div>
        </div>

        <div className="bg-[#eee2fe] rounded-[4px] p-4">
          <div className="flex items-center">
            <span>
              <img className="w-12" src={SpeakerIcon} alt="Speaker Icon" />
            </span>

            <span className="font-[450] text-red-500 text-[1.2rem]">
              {t('reader.storyInfoPage.storyInfoSection.note.label')}
            </span>
          </div>

          <div
            className="mt-2 text-[var(--black)] text-justify"
            dangerouslySetInnerHTML={{
              __html:
                data[0][0][0].note ??
                t('reader.storyInfoPage.storyInfoSection.note.notData'),
            }}
          />
        </div>

        <div>
          <div className="flex items-center text-[var(--primary)] font-[450] space-x-2">
            <span className="text-[1.8rem]">
              <i className="fa-solid fa-circle-info"></i>
            </span>

            <span className="text-[1.2rem]">
              {t(
                'reader.storyInfoPage.storyInfoSection.contentIntroduction.label'
              )}
            </span>
          </div>

          <div
            className="mt-2 text-justify"
            dangerouslySetInnerHTML={{
              __html: data[0][0][0].description
                ? data[0][0][0].description
                : t(
                    'reader.storyInfoPage.storyInfoSection.contentIntroduction.notData'
                  ),
            }}
          />
        </div>
      </div>
    );
  }

  return null;
}

export default memo(StoryInfoSection);
