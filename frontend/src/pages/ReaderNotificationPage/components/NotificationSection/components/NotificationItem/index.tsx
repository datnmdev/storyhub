import { memo, useEffect, useRef, useState } from 'react';
import { NotificationItemProps } from './NotificationItem.type';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import paths from '@routers/router.path';
import classNames from 'classnames';
import LoadingWrapper from '@components/LoadingWrapper';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import themeFeature from '@features/theme';
import {
  NotificationStatus,
  NotificationType,
} from '@constants/notification.constants';
import Logo from '@assets/icons/logo.png';
import NumberUtils from '@utilities/number.util';
import { timeAgo } from '@utilities/date.util';
import { CommentType } from '@constants/comment.constants';
import { StoryType } from '@constants/story.constants';
import UrlUtils from '@utilities/url.util';
import AvatarDefault from '@assets/avatars/user-default.png';
import notificationFeature from '@features/notification';

function NotificationItem({ data }: NotificationItemProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const [isOpenOptionBox, setOpenOptionBox] = useState(false);
  const optionBoxRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      optionBoxRef.current &&
      !optionBoxRef.current.contains(e.target as Node)
    ) {
      setOpenOptionBox(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <LoadingWrapper
      isLoading={false}
      message={t(
        'reader.notificationPage.notificationSection.loading.handlingReqMessage'
      )}
    >
      <div
        className={classNames(
          'relative grow flex justify-between rounded-[4px] items-center',
          themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow'
        )}
      >
        <div className="grow flex justify-between p-3 space-x-3">
          <div className="self-stretch shrink-0">
            {data.notification.type ===
              NotificationType.DEPOSITE_NOTIFICATION && (
              <img
                className="w-16 h-16 object-cover object-center rounded-full border-[2px] border-solid border-[#ccc]"
                src={Logo}
                alt="Logo"
              />
            )}
            {data.notification.type ===
              NotificationType.COMMENT_NOTIFICATION && (
              <img
                className="w-16 h-16 object-cover object-center rounded-full border-[2px] border-solid border-[#ccc]"
                src={
                  data.notification.reference.reader.userProfile.avatar
                    ? UrlUtils.generateUrl(
                        data.notification.reference.reader.userProfile.avatar
                      )
                    : AvatarDefault
                }
                alt="Logo"
              />
            )}
          </div>

          <div className="grow">
            {data.notification.type ===
              NotificationType.DEPOSITE_NOTIFICATION && (
              <div
                className="cursor-pointer select-none active:text-[var(--primary)] hover:text-[var(--primary)]"
                onClick={() => {
                  dispatch(
                    notificationFeature.notificationThunk.updateNotification({
                      notificationId: data.notificationId,
                      status: NotificationStatus.VIEWED,
                    })
                  );
                  navigate(paths.readerDepositeTransHistoryPage());
                }}
              >
                <div className="h-16 flex items-center">
                  <div
                    className="line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: t(
                        'reader.notificationPage.notificationSection.items.depositeTransactionNotification.content',
                        {
                          value: NumberUtils.formatNumberWithSeparator(
                            String(
                              Math.floor(
                                Number(data.notification.reference.amount) / 100
                              )
                            )
                          ),
                        }
                      ),
                    }}
                  />
                </div>
              </div>
            )}

            {data.notification.type ===
              NotificationType.COMMENT_NOTIFICATION && (
              <div
                className="cursor-pointer select-none active:text-[var(--primary)] hover:text-[var(--primary)]"
                onClick={() => {
                  dispatch(
                    notificationFeature.notificationThunk.updateNotification({
                      notificationId: data.notificationId,
                      status: NotificationStatus.VIEWED,
                    })
                  );
                  navigate(
                    data.notification.reference.type ===
                      CommentType.STORY_COMMENT
                      ? paths.readerStoryInfoPage(
                          data.notification.reference.storyId
                        )
                      : paths.readerChapterContentPage(
                          data.notification.reference.chapter.storyId,
                          data.notification.reference.chapterId,
                          data.notification.reference.chapter
                            .chapterTranslations[0].id
                        )
                  );
                }}
              >
                <div className="h-16 flex items-center">
                  {data.notification.reference.type ===
                    CommentType.STORY_COMMENT && (
                    <div
                      className="line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: t(
                          'reader.notificationPage.notificationSection.items.commentNotification.content1',
                          {
                            responserName:
                              data.notification.reference.reader.userProfile
                                .name,
                            storyType:
                              data.notification.reference.story.type ===
                              StoryType.COMIC
                                ? t(
                                    'reader.notificationPage.notificationSection.items.commentNotification.storyType.comic'
                                  )
                                : t(
                                    'reader.notificationPage.notificationSection.items.commentNotification.storyType.novel'
                                  ),
                            storyTitle: data.notification.reference.story.title,
                          }
                        ),
                      }}
                    />
                  )}

                  {data.notification.reference.type ===
                    CommentType.CHAPTER_COMMENT && (
                    <div
                      className="line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: t(
                          'reader.notificationPage.notificationSection.items.commentNotification.content2',
                          {
                            responserName:
                              data.notification.reference.reader.userProfile
                                .name,
                            storyType:
                              data.notification.reference.chapter.story.type ===
                              StoryType.COMIC
                                ? t(
                                    'reader.notificationPage.notificationSection.items.commentNotification.storyType.comic'
                                  )
                                : t(
                                    'reader.notificationPage.notificationSection.items.commentNotification.storyType.novel'
                                  ),
                            storyTitle:
                              data.notification.reference.chapter.story.title,
                            chapterName:
                              data.notification.reference.chapter.name,
                          }
                        ),
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="shrink-0">
              <span className="font-normal text-[var(--primary)] text-[0.95rem]">
                {t(`timestamps.${timeAgo(new Date(data.createdAt)).type}`, {
                  value: timeAgo(new Date(data.createdAt)).value,
                })}
              </span>
            </div>
          </div>
        </div>

        <div ref={optionBoxRef} className="relative">
          <span
            onClick={() => setOpenOptionBox(!isOpenOptionBox)}
            className="text-[1.6rem] font-semibold py-3 px-4 cursor-pointer hover:opacity-60"
          >
            <i className="fa-solid fa-ellipsis"></i>
          </span>

          <ul
            className={classNames(
              'animate-fadeIn absolute right-0 top-full min-w-[180px] z-[1] rounded-[4px] p-2',
              themeValue === 'light'
                ? 'light light__boxShadow'
                : 'dark dark__boxShadow'
            )}
            style={{
              display: isOpenOptionBox ? 'block' : 'none',
            }}
          >
            <li
              className="rounded-[4px] transition-colors duration-300 px-4 py-3 hover:bg-[var(--primary)] hover:text-[--white] cursor-pointer"
              onClick={() => {
                dispatch(
                  notificationFeature.notificationThunk.deleteNotificationById(
                    data.notificationId
                  )
                );
                setOpenOptionBox(false);
              }}
            >
              {t(
                'reader.notificationPage.notificationSection.items.options.delete'
              )}
            </li>
          </ul>
        </div>

        {data.status === NotificationStatus.SENT && (
          <span className="absolute right-2 top-2 w-[12px] h-[12px] bg-[var(--primary)] rounded-full"></span>
        )}
      </div>
    </LoadingWrapper>
  );
}

export default memo(NotificationItem);
