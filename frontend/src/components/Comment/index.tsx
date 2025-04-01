import themeFeature from '@features/theme';
import { useAppDispatch, useAppSelector } from '@hooks/redux.hook';
import classNames from 'classnames';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Interaction from './components/Interaction';
import CommentEditor from '@components/CommentEditor';
import { CommentProps } from './Comment.type';
import { timeAgo } from '@utilities/date.util';
import UrlUtils from '@utilities/url.util';
import DefaultAvatar from '@assets/avatars/user-default.png';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { RequestInit } from '@apis/api.type';
import Replies from './components/Replies';
import scrollIntoView from 'scroll-into-view-if-needed';
import authFeature from '@features/auth';
import Protected from '@components/Protected';
import { Role } from '@constants/user.constants';
import IconPicker from '@components/IconPicker';
import ActivityIcon from '@assets/comment-content/emojis/activities.json';
import AnimalIcon from '@assets/comment-content/emojis/animals.json';
import CuisineIcon from '@assets/comment-content/emojis/cuisines.json';
import FlagIcon from '@assets/comment-content/emojis/flags.json';
import ObjectIcon from '@assets/comment-content/emojis/objects.json';
import PlaceIcon from '@assets/comment-content/emojis/places.json';
import SmileIcon from '@assets/comment-content/emojis/smiles.json';
import SymbolIcon from '@assets/comment-content/emojis/symbols.json';
import BabySoldierGifs from '@assets/comment-content/gifs/baby-soldiers.json';
import CheekyRabbitGifs from '@assets/comment-content/gifs/cheeky-rabbits.json';
import EmoGifs from '@assets/comment-content/gifs/emo-gifs.json';
import OnionGifs from '@assets/comment-content/gifs/onions.json';
import PandaGifs from '@assets/comment-content/gifs/pandas.json';
import TozokiRabbitGifs from '@assets/comment-content/gifs/tozoki-rabbits.json';
import TrollFaceGifs from '@assets/comment-content/gifs/troll-faces.json';
import YoyoMonkeyGifs from '@assets/comment-content/gifs/yoyo-monkeys.json';
import Loading from '@assets/icons/gifs/loading.gif';
import Button from '@components/Button';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';

function Comment({ data, onDeleted }: CommentProps) {
  const { t } = useTranslation();
  const themeValue = useAppSelector(themeFeature.themeSelector.selectValue);
  const profile = useAppSelector(authFeature.authSelector.selectUser);
  const [enableProtected, setEnableProtected] = useState(false);
  const dispatch = useAppDispatch();
  const [hiddenOption, setHiddenOption] = useState(true);
  const optionContainerRef = useRef<HTMLDivElement>(null);
  const replyBoxRef = useRef<HTMLDivElement>(null);
  const [isOpenReplyBox, setOpenReplyBox] = useState(false);
  const [isShowReplies, setShowReplies] = useState(false);
  const [isOpenCommentEdit, setOpenCommentEdit] = useState(false);
  const [hiddenPlaceholder, setHiddenPlaceholder] = useState(false);
  const [inputData, setInputData] = useState('');
  const inputRef = useRef<HTMLDivElement>(null);
  const [getRepliesReq] = useState<RequestInit>({
    queries: {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      storyId: data.storyId,
      chapterId: data.chapterId,
      parentId: data.id,
    },
  });
  const { data: repliesData } = useFetch(
    apis.commentApi.getCommentWithFilter,
    getRepliesReq
  );
  const [commentInputData, setCommentInputData] = useState('');
  const [resetInputData, setResetInputData] = useState({
    value: true,
  });
  const [createCommentReq, setCreateCommentReq] = useState<RequestInit>({
    body: {
      type: data.type,
      storyId: data.storyId,
      chapterId: data.chapterId,
      parentId: data.id,
    },
  });
  const {
    data: createCommentReqData,
    isLoading: isCreatingComment,
    setRefetch: setReCreateComment,
  } = useFetch(apis.commentApi.createComment, createCommentReq, false);
  const [refreshReplyList, setRefreshReplyList] = useState({
    value: false,
  });
  const {
    data: deleteResult,
    isLoading: isDeletingComment,
    setRefetch: setReDeleteComment,
  } = useFetch(
    apis.commentApi.deleteComment,
    { params: { id: data.id } },
    false
  );
  const [updateCommentReq, setUpdateCommentReq] = useState<RequestInit>({
    body: {
      id: data.id,
    },
  });
  const {
    data: updateCommentRes,
    isLoading: isUpdatingComment,
    setRefetch: setReUpdateComment,
  } = useFetch(apis.commentApi.updateComment, updateCommentReq, false);
  const { data: commentRes, setRefetch: setReGetComment } = useFetch(
    apis.commentApi.getCommentWithFilter,
    {
      queries: {
        id: data.id,
        parentId: data.parentId,
        page: 1,
        limit: 1,
      },
    },
    false
  );

  const timeStamps = useMemo(
    () =>
      timeAgo(new Date(commentRes?.[0]?.[0]?.updatedAt ?? data.updatedAt))
        .value,
    [commentRes, data]
  );

  useEffect(() => {
    setCreateCommentReq({
      body: {
        ...createCommentReq.body,
        content: commentInputData,
      },
    });
  }, [commentInputData]);

  useEffect(() => {
    if (!isCreatingComment) {
      if (createCommentReqData) {
        setRefreshReplyList({
          value: true,
        });
        setResetInputData({
          value: true,
        });
      }
    }
  }, [isCreatingComment]);

  useEffect(() => {
    function handleClickedOutside(this: Window, e: any) {
      if (
        optionContainerRef.current &&
        !optionContainerRef.current.contains(e.target)
      ) {
        setHiddenOption(true);
      }
    }
    window.addEventListener('click', handleClickedOutside);
    return () => {
      removeEventListener('click', handleClickedOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpenReplyBox && replyBoxRef.current) {
      scrollIntoView(replyBoxRef.current, {
        behavior: 'smooth',
        inline: 'center',
        block: 'center',
      });
    }
  }, [isOpenReplyBox]);

  useEffect(() => {
    if (!isDeletingComment) {
      if (deleteResult) {
        if (deleteResult.affected > 0) {
          if (onDeleted) {
            onDeleted(true);
          }
        } else {
          if (onDeleted) {
            onDeleted(false);
          }
        }
      }
    }
  }, [isDeletingComment]);

  useEffect(() => {
    if (inputData != '') {
      setHiddenPlaceholder(true);
    } else {
      setHiddenPlaceholder(false);
    }
    setUpdateCommentReq({
      body: {
        ...updateCommentReq.body,
        content: inputData,
      },
    });
  }, [inputData]);

  useEffect(() => {
    if (isOpenCommentEdit && inputRef.current) {
      inputRef.current.innerHTML =
        commentRes?.[0]?.[0]?.content ?? data.content;
      setInputData(commentRes?.[0]?.[0]?.content ?? data.content);
    }
  }, [isOpenCommentEdit]);

  useEffect(() => {
    if (!isUpdatingComment) {
      if (updateCommentRes) {
        if (updateCommentRes.affected > 0) {
          dispatch(
            toastFeature.toastAction.add({
              title: t('notification.updateCommentSuccess'),
              type: ToastType.SUCCESS,
            })
          );
          setReGetComment({
            value: true,
          });
          setOpenCommentEdit(false);
        } else {
          dispatch(
            toastFeature.toastAction.add({
              title: t('notification.updateCommentFailed'),
              type: ToastType.ERROR,
            })
          );
        }
      }
    }
  }, [isUpdatingComment]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutaionRecord) => {
        if (mutaionRecord.target === inputRef.current) {
          setInputData((mutaionRecord.target as HTMLDivElement).innerHTML);
        }
      });
    });
    function handleChangeInput(this: HTMLDivElement, e: Event) {
      const content = (e.target as HTMLDivElement).innerHTML;
      setInputData(content === '<br>' ? '' : content);
    }
    if (inputRef.current) {
      inputRef.current.addEventListener('input', handleChangeInput);
      observer.observe(inputRef.current, {
        childList: true,
      });
    }
    return () => {
      removeEventListener('input', handleChangeInput);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex justify-between space-x-4">
      <div className="shrink-0">
        <img
          className={classNames(
            'desktop:w-16 tablet:w-12 mobile:w-8 desktop:h-16 tablet:h-12 mobile:h-8 rounded-full object-cover object-center',
            themeValue === 'light' ? 'light__boxShadow' : 'dark__boxShadow'
          )}
          src={
            data.reader.userProfile.avatar !== null
              ? UrlUtils.generateUrl(data.reader.userProfile.avatar)
              : DefaultAvatar
          }
          alt="Avatar"
        />
      </div>

      <div className="grow">
        <div
          className={classNames(
            'min-h-[88px] p-4 rounded-[8px] space-x-4',
            themeValue === 'light'
              ? 'bg-[var(--light-gray)]'
              : 'bg-inherit border-[1px] border-solid border-[var(--white)]'
          )}
          style={{
            display: isOpenCommentEdit ? 'block' : 'none',
          }}
        >
          <div className="relative">
            <div
              ref={inputRef}
              className={classNames(
                'relative w-full min-h-[80px] outline-none bg-transparent z-[1] whitespace-pre-line break-all'
              )}
              contentEditable={true}
            />

            {!hiddenPlaceholder && (
              <div className="w-full h-full absolute top-0 left-0 z-[0] text-[var(--dark-gray)]">
                {t('comment.placeholder')}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <IconPicker
                  data={[
                    SmileIcon,
                    ActivityIcon,
                    AnimalIcon,
                    CuisineIcon,
                    FlagIcon,
                    ObjectIcon,
                    PlaceIcon,
                    SymbolIcon,
                  ]}
                  onClickedItem={(data) => inputRef.current?.appendChild(data)}
                />
              </div>

              <div>
                <IconPicker
                  activatedIcon={<i className="fa-solid fa-gift"></i>}
                  unactivatedIcon={<i className="fa-solid fa-gift"></i>}
                  fontSize={40}
                  data={[
                    TrollFaceGifs,
                    CheekyRabbitGifs,
                    YoyoMonkeyGifs,
                    BabySoldierGifs,
                    TozokiRabbitGifs,
                    EmoGifs,
                    OnionGifs,
                    PandaGifs,
                  ]}
                  onClickedItem={(data) => inputRef.current?.appendChild(data)}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                width={48}
                height={32}
                onClick={() => setOpenCommentEdit(false)}
              >
                {t('comment.exit')}
              </Button>

              <Button
                width={48}
                height={32}
                disabled={inputData === '' ? true : false}
                onClick={() =>
                  setReUpdateComment({
                    value: true,
                  })
                }
              >
                {isUpdatingComment ? (
                  <img src={Loading} alt="Loading" />
                ) : (
                  t('comment.save')
                )}
              </Button>
            </div>
          </div>
        </div>

        <div
          className={classNames(
            'min-h-[88px] p-4 rounded-[8px] flex justify-between space-x-4',
            themeValue === 'light'
              ? 'bg-[var(--light-gray)]'
              : 'bg-inherit border-[1px] border-solid border-[var(--white)]'
          )}
          style={{
            display: !isOpenCommentEdit ? 'flex' : 'none',
          }}
        >
          <div className="grow">
            <div className="space-x-2 flex items-center">
              <span className="font-[500] line-clamp-1">
                {data.reader.userProfile.name}
              </span>

              <span className="bg-[var(--primary)] text-[var(--white)] text-[0.8rem] px-2.5 py-0.2 space-x-1 flex items-center rounded-[12px]">
                <span className="text-[1.05rem]">
                  <i className="fa-regular fa-clock"></i>
                </span>

                <span className="line-clamp-1">
                  {t(
                    `timeAgo.${timeAgo(new Date(commentRes?.[0]?.[0]?.updatedAt ?? data.updatedAt)).type}`,
                    {
                      value: timeStamps,
                    }
                  )}
                </span>
              </span>
            </div>

            <div
              className="mt-2 whitespace-pre-line break-all"
              dangerouslySetInnerHTML={{
                __html: commentRes?.[0]?.[0]?.content ?? data.content,
              }}
            />
          </div>

          <div
            hidden={data?.readerId !== profile?.id}
            className="shrink-0 self-start"
          >
            <div
              ref={optionContainerRef}
              className="relative w-8 h-8 cursor-pointer rounded-full flex justify-center items-center"
              onClick={() => setHiddenOption(!hiddenOption)}
            >
              <span>
                <i className="fa-solid fa-ellipsis text-[1.6rem] font-[900] hover:text-[var(--primary)]"></i>
              </span>

              <ul
                className={classNames(
                  'animate-fadeIn absolute right-0 top-full min-w-[180px] z-[1] rounded-[4px] p-2',
                  themeValue === 'light'
                    ? 'light light__boxShadow'
                    : 'dark dark__boxShadow'
                )}
                style={{
                  display: !hiddenOption ? 'block' : 'none',
                }}
              >
                <li
                  className="rounded-[4px] transition-colors duration-300 px-4 py-3 hover:bg-[var(--primary)] hover:text-[--white]"
                  onClick={() => setOpenCommentEdit(true)}
                >
                  {t('comment.edit')}
                </li>

                <li
                  onClick={() =>
                    setReDeleteComment({
                      value: true,
                    })
                  }
                  className="rounded-[4px] transition-colors duration-300 px-4 py-3 hover:bg-[var(--primary)] hover:text-[--white]"
                >
                  {t('comment.delete')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Interaction comment={data} />

          <span
            className="text-[#91908e] py-1 font-[450] cursor-pointer hover:text-[var(--primary)] select-none"
            onClick={() => setOpenReplyBox(!isOpenReplyBox)}
          >
            {t('comment.reply')}
          </span>
        </div>

        {repliesData && repliesData[1] > 0 && !isShowReplies && (
          <div onClick={() => setShowReplies(true)}>
            <span className="space-x-2 text-[#91908e] py-1 font-[450] cursor-pointer hover:text-[var(--primary)] select-none">
              <span>
                <i className="fa-solid fa-reply"></i>
              </span>

              <span>
                {t('comment.reviewReplies', { value: repliesData[1] })}
              </span>
            </span>
          </div>
        )}

        {isShowReplies && (
          <div className="mt-4">
            <Replies parent={data} refresh={refreshReplyList} />
          </div>
        )}

        {isOpenReplyBox && (
          <Protected role={Role.READER} enable={enableProtected}>
            <div className="mt-4 animate-fadeIn">
              <CommentEditor
                ref={replyBoxRef}
                reset={resetInputData}
                isSubmitting={isCreatingComment}
                onChange={(value) => setCommentInputData(value)}
                onSubmit={() => {
                  setEnableProtected(true);
                  setShowReplies(true);
                  setReCreateComment({
                    value: true,
                  });
                }}
              />
            </div>
          </Protected>
        )}
      </div>
    </div>
  );
}

export default memo(Comment);
