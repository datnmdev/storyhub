import { memo, useEffect, useState } from 'react';
import { FollowStoryItemProps } from './FollowStoryItem.type';
import UrlUtils from '@utilities/url.util';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import paths from '@routers/router.path';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';
import Button from '@components/Button';
import IconButton from '@components/IconButton';
import UnfollowIcon from '@assets/icons/static/unfollow.png';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import LoadingWrapper from '@components/LoadingWrapper';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';

function FollowStoryItem({ data, setReGetFollowList }: FollowStoryItemProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [unfollowRequest, setUnfollowRequest] = useState<RequestInit>();
  const {
    data: isUnfollowed,
    isLoading: isUnfollowing,
    error: unfollowError,
    setRefetch: setReUnfollow,
  } = useFetch(apis.followApi.unfollow, unfollowRequest, false);

  useEffect(() => {
    if (unfollowRequest) {
      setReUnfollow({
        value: true,
      });
    }
  }, [unfollowRequest]);

  useEffect(() => {
    if (!isUnfollowing) {
      if (isUnfollowed) {
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.unfollowSuccess'),
          })
        );
        setReGetFollowList({
          value: true,
        });
      } else {
        if (unfollowError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.undefinedError'),
            })
          );
        }
      }
    }
  }, [isUnfollowing]);

  return (
    <LoadingWrapper
      isLoading={isUnfollowing}
      message={t(
        'reader.followManagementPage.followManagementSection.loading.handlingReqMessage'
      )}
    >
      <div
        className={classNames(
          'flex justify-between p-3 space-x-3 rounded-[4px]',
          themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow'
        )}
      >
        <div className="self-stretch shrink-0">
          <img
            className="w-[72px] h-[100px] object-cover object-center rounded-[4px]"
            src={UrlUtils.generateUrl(data.story.coverImage)}
            alt={data.story.title}
          />
        </div>

        <div className="grow flex justify-between space-x-3">
          <div className="grow flex flex-col justify-between">
            <h3 className="line-clamp-1 font-[450] text-[1.2rem]">
              {data.story.title}
            </h3>

            <div className="mt-0.5">
              {t(
                'reader.followManagementPage.followManagementSection.item.followedAt',
                { value: moment(data.createdAt).format('HH:mm:ss DD/MM/YYYY') }
              )}
            </div>

            <div className="space-x-1 mt-0.5">
              <span>
                {t(
                  'reader.followManagementPage.followManagementSection.item.newestChapter'
                )}
              </span>

              <Link
                className="font-semibold text-[var(--primary)] hover:opacity-60"
                to={paths.readerChapterContentPage(
                  data.story.id,
                  data.story.chapters[0].id
                )}
              >
                {data.story.chapters[0].name}
              </Link>
            </div>

            <div className="mt-1.5">
              <Button
                width={100}
                height={32}
                bgColor="#48b528"
                onClick={() =>
                  navigate(
                    paths.readerChapterContentPage(
                      data.story.id,
                      data.story.chapters[0].id
                    )
                  )
                }
              >
                {t(
                  'reader.followManagementPage.followManagementSection.btn.readingBtn'
                )}
              </Button>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <IconButton
              icon={
                <img
                  className="w-8 h-8 object-cover object-center"
                  src={UnfollowIcon}
                  alt="Unfollow Icon"
                />
              }
              onClick={() =>
                setUnfollowRequest({
                  queries: {
                    storyId: data.story.id,
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </LoadingWrapper>
  );
}

export default memo(FollowStoryItem);
