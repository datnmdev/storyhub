import { RequestInit } from '@apis/api.type';
import { memo, useEffect, useState } from 'react';
import { RepliesProps } from './Replies.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import LoadingWrapper from '@components/LoadingWrapper';
import { useTranslation } from 'react-i18next';
import Comment from '@components/Comment';
import { Comment as IComment } from '@components/Comment/Comment.type';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';

function Replies({ parent, refresh }: RepliesProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [getRepliesReq] = useState<RequestInit>({
    queries: {
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      storyId: parent.storyId,
      chapterId: parent.chapterId,
      parentId: parent.id,
      orderBy: JSON.stringify([['createdAt', 'ASC']]),
    },
  });
  const {
    data: repliesData,
    isLoading: isGettingReplies,
    setRefetch: setReGetReplies,
  } = useFetch<[IComment[], number]>(
    apis.commentApi.getCommentWithFilter,
    getRepliesReq
  );

  useEffect(() => {
    if (refresh?.value) {
      setReGetReplies({
        value: true,
      });
    }
  }, [refresh]);

  useEffect(() => {
    if (getRepliesReq) {
      setReGetReplies({
        value: true,
      });
    }
  }, [getRepliesReq]);

  return (
    <div>
      <div>
        <LoadingWrapper
          isLoading={isGettingReplies}
          message={t('comment.loading.message')}
          level="component"
        >
          <div className="space-y-4">
            {repliesData?.[0].map((comment) => {
              return (
                <Comment
                  onDeleted={(value) => {
                    if (value) {
                      dispatch(
                        toastFeature.toastAction.add({
                          type: ToastType.SUCCESS,
                          title: t('notification.deleteCommentSuccess'),
                        })
                      );
                      setReGetReplies({
                        value: true,
                      });
                    } else {
                      dispatch(
                        toastFeature.toastAction.add({
                          type: ToastType.ERROR,
                          title: t('notification.deleteCommentFailed'),
                        })
                      );
                    }
                  }}
                  key={comment.id}
                  data={comment}
                />
              );
            })}
          </div>
        </LoadingWrapper>
      </div>
    </div>
  );
}

export default memo(Replies);
