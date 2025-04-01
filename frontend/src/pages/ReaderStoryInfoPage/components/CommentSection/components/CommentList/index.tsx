import Comment from '@components/Comment';
import { memo, useEffect, useState } from 'react';
import { CommentListProps } from './CommentList.type';
import { RequestInit } from '@apis/api.type';
import useFetch from '@hooks/fetch.hook';
import apis from '@apis/index';
import LoadingWrapper from '@components/LoadingWrapper';
import { useTranslation } from 'react-i18next';
import { Comment as CommentType } from '@components/Comment/Comment.type';
import Pagination from '@components/Pagination';
import { useAppDispatch } from '@hooks/redux.hook';
import toastFeature from '@features/toast';
import { ToastType } from '@constants/toast.constants';

function CommentList({
  type,
  storyId,
  setTotalComment,
  refresh,
}: CommentListProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [getCommentListReq, setGetCommentListReq] = useState<RequestInit>({
    queries: {
      page: 1,
      limit: 10,
      type,
      storyId,
    },
  });
  const {
    data: commentList,
    isLoading: isGettingCommentList,
    setRefetch: setReGetCommentList,
  } = useFetch<[CommentType[], number]>(
    apis.commentApi.getCommentWithFilter,
    getCommentListReq
  );

  useEffect(() => {
    if (refresh?.value) {
      setReGetCommentList({
        value: true,
      });
    }
  }, [refresh]);

  useEffect(() => {
    if (!isGettingCommentList) {
      if (commentList) {
        setTotalComment(commentList[1]);
      }
    }
  }, [isGettingCommentList]);

  useEffect(() => {
    if (getCommentListReq) {
      setReGetCommentList({
        value: true,
      });
    }
  }, [getCommentListReq]);

  return (
    <div>
      <div>
        <LoadingWrapper
          isLoading={isGettingCommentList}
          message={t('comment.loading.message')}
          level="component"
        >
          <div className="space-y-4">
            {commentList?.[0].map((comment) => {
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
                      setReGetCommentList({
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

      <div className="flex justify-center mt-4">
        <Pagination
          count={
            commentList
              ? Math.ceil(commentList[1] / getCommentListReq.queries.limit)
              : 0
          }
          page={getCommentListReq.queries.page}
          onChange={(_e, page) =>
            setGetCommentListReq({
              queries: {
                ...getCommentListReq.queries,
                page,
              },
            })
          }
        />
      </div>
    </div>
  );
}

export default memo(CommentList);
