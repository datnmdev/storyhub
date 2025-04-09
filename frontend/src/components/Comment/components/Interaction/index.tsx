import apis from '@apis/index';
import useFetch from '@hooks/fetch.hook';
import { memo, useEffect, useState } from 'react';
import { InteractionProps } from './Interaction.type';
import { CommentInteractionCountResponse } from '@apis/commentInteraction';
import { InteractionType } from '@constants/interactionComment.constants';
import { RequestInit } from '@apis/api.type';
import Protected from '@components/Protected';
import { Role } from '@constants/user.constants';
import { useAppSelector } from '@hooks/redux.hook';
import authFeature from '@features/auth';

function Interaction({ comment }: InteractionProps) {
  const profile = useAppSelector(authFeature.authSelector.selectUser);
  const [enableProtected, setEnableProtected] = useState(false);
  const {
    data: commentInteractionCountRes,
    setRefetch: setReGetCommentInteractionCount,
  } = useFetch<CommentInteractionCountResponse>(
    apis.commentInteractionApi.getCommentInteractionCount,
    {
      queries: {
        commentId: comment.id,
      },
    }
  );
  const { data: commentInteractionRes, setRefetch: setReGetInteraction } =
    useFetch(
      apis.commentInteractionApi.getCommentInteraction,
      {
        queries: {
          commentId: comment.id,
        },
      },
      false
    );
  const [createCommentInteractionReq, setCreateCommentInteractionReq] =
    useState<RequestInit>({
      body: {
        commentId: comment.id,
      },
    });
  const {
    data: createCommentInteractionRes,
    isLoading: isCreatingCommentInteraction,
    setRefetch: setReCreateCommentInteraction,
  } = useFetch(
    apis.commentInteractionApi.createCommentInteraction,
    createCommentInteractionReq,
    false
  );
  const {
    data: deleteCommentInteractionRes,
    isLoading: isDeletingCommentInteraction,
    setRefetch: setReDeleteCommentInteraction,
  } = useFetch(
    apis.commentInteractionApi.deleteCommentInteraction,
    {
      queries: {
        commentId: comment.id,
      },
    },
    false
  );

  useEffect(() => {
    if (profile) {
      setReGetInteraction({
        value: true,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (createCommentInteractionReq.body?.interactionType) {
      setReCreateCommentInteraction({
        value: true,
      });
    }
  }, [createCommentInteractionReq]);

  useEffect(() => {
    if (!isCreatingCommentInteraction) {
      if (createCommentInteractionRes) {
        setReGetCommentInteractionCount({
          value: true,
        });
        setReGetInteraction({
          value: true,
        });
      }
    }
  }, [isCreatingCommentInteraction]);

  useEffect(() => {
    if (!isDeletingCommentInteraction) {
      if (
        deleteCommentInteractionRes &&
        deleteCommentInteractionRes.affected > 0
      ) {
        setReGetCommentInteractionCount({
          value: true,
        });
        setReGetInteraction({
          value: true,
        });
      }
    }
  }, [isDeletingCommentInteraction]);

  return (
    <div className="flex space-x-2 text-[#91908e] py-1">
      <div className="space-x-1 flex items-center">
        <Protected role={Role.READER} enable={enableProtected}>
          <span
            className="text-[1.2rem] hover:text-[var(--primary)] cursor-pointer"
            style={{
              color:
                commentInteractionRes?.interactionType === InteractionType.LIKE
                  ? 'var(--primary)'
                  : '#91908e',
            }}
            onClick={() => {
              setEnableProtected(true);
              if (
                commentInteractionRes.interactionType === InteractionType.LIKE
              ) {
                setReDeleteCommentInteraction({
                  value: true,
                });
              } else {
                setCreateCommentInteractionReq({
                  body: {
                    ...createCommentInteractionReq.body,
                    interactionType: InteractionType.LIKE,
                  },
                });
              }
            }}
          >
            <i className="fa-solid fa-thumbs-up"></i>
          </span>
        </Protected>

        <span className="select-none">
          {commentInteractionCountRes
            ? commentInteractionCountRes.likeCount
            : ' '}
        </span>
      </div>

      <div className="space-x-1 flex items-center">
        <Protected role={Role.READER} enable={enableProtected}>
          <span
            className="text-[1.2rem] hover:text-[var(--primary)] cursor-pointer"
            style={{
              color:
                commentInteractionRes?.interactionType ===
                InteractionType.DISLIKE
                  ? 'var(--primary)'
                  : '#91908e',
            }}
            onClick={() => {
              setEnableProtected(true);
              if (
                commentInteractionRes.interactionType ===
                InteractionType.DISLIKE
              ) {
                setReDeleteCommentInteraction({
                  value: true,
                });
              } else {
                setCreateCommentInteractionReq({
                  body: {
                    ...createCommentInteractionReq.body,
                    interactionType: InteractionType.DISLIKE,
                  },
                });
              }
            }}
          >
            <i className="fa-solid fa-thumbs-down"></i>
          </span>
        </Protected>

        <span className="select-none">
          {commentInteractionCountRes
            ? commentInteractionCountRes.dislikeCount
            : ' '}
        </span>
      </div>
    </div>
  );
}

export default memo(Interaction);
