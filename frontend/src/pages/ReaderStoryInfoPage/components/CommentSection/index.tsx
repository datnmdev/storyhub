import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CommentList from './components/CommentList';
import CommentEditor from '@components/CommentEditor';
import { RequestInit } from '@apis/api.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import { CommentSectionProps } from './CommentSection.type';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';
import Protected from '@components/Protected';
import { Role } from '@constants/user.constants';

function CommentSection({ type, storyId }: CommentSectionProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [enableProtected, setEnableProtected] = useState(false);
  const [totalComment, setTotalComment] = useState(0);
  const [commentInputData, setCommentInputData] = useState('');
  const [resetInputData, setResetInputData] = useState({
    value: true,
  });
  const [createCommentReq, setCreateCommentReq] = useState<RequestInit>({
    body: {
      type,
      storyId,
    },
  });
  const {
    data: createCommentReqData,
    isLoading: isCreatingComment,
    error: createCommentError,
    setRefetch: setReCreateComment,
  } = useFetch(apis.commentApi.createComment, createCommentReq, false);
  const [refreshCommentList, setRefreshCommentList] = useState({
    value: false,
  });

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
        dispatch(
          toastFeature.toastAction.add({
            type: ToastType.SUCCESS,
            title: t('notification.createCommentSuccess'),
          })
        );
        setRefreshCommentList({
          value: true,
        });
        setResetInputData({
          value: true,
        });
      } else {
        if (createCommentError) {
          dispatch(
            toastFeature.toastAction.add({
              type: ToastType.ERROR,
              title: t('notification.undefinedError'),
            })
          );
        }
      }
    }
  }, [isCreatingComment]);

  return (
    <div>
      <div className="flex items-center text-[var(--primary)] font-[450] space-x-2">
        <span className="text-[1.8rem]">
          <i className="fa-regular fa-comments"></i>
        </span>

        <span className="text-[1.2rem]">
          {t('comment.title', { value: totalComment })}
        </span>
      </div>

      <Protected role={Role.READER} enable={enableProtected}>
        <div className="mt-4">
          <CommentEditor
            reset={resetInputData}
            isSubmitting={isCreatingComment}
            onChange={(value) => setCommentInputData(value)}
            onSubmit={() => {
              setEnableProtected(true);
              setReCreateComment({
                value: true,
              });
            }}
          />
        </div>
      </Protected>

      <div className="mt-4">
        <CommentList
          type={type}
          storyId={storyId}
          setTotalComment={setTotalComment}
          refresh={refreshCommentList}
        />
      </div>
    </div>
  );
}

export default memo(CommentSection);
