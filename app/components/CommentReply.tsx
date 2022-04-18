import type { ForwardedRef } from "react";
import { forwardRef } from "react";

import CommentReplyEntry from "~/components/CommentReplyEntry";

export interface CommentReplyProps {
  id: number;
  content: string;
  isReply: boolean;
  replyingTo?: string | null;
  parentId?: number | null;
  userId: number;
  productRequestId: number;
  user: {
    id: number;
    name: string;
    username: string;
    image: string;
  };
  replies: Array<CommentReplyProps>;
}

function CommentReply(
  props: CommentReplyProps,
  ref: ForwardedRef<HTMLFormElement>
) {
  return (
    <>
      <div className="feedback-detail-comment-reply">
        <CommentReplyEntry
          id={props.id}
          content={props.content}
          isReply={props.isReply}
          replyingTo={props.replyingTo}
          parentId={props.parentId}
          userId={props.userId}
          productRequestId={props.productRequestId}
          user={props.user}
          ref={ref}
          key={props.id}
        />
        {(props.replies || []).map((reply) => (
          <div
            key={reply.id}
            className="feedback-detail-comment-reply nested-comment-reply nested-level-one"
          >
            <CommentReplyEntry
              id={reply.id}
              content={reply.content}
              isReply={reply.isReply}
              replyingTo={reply.replyingTo}
              parentId={reply.parentId}
              userId={reply.userId}
              productRequestId={reply.productRequestId}
              user={reply.user}
              ref={ref}
              key={reply.id}
            />
            {(reply.replies || []).map((entry) => (
              <div
                key={entry.id}
                className="feedback-detail-comment-reply nested-comment-reply nested-level-two"
              >
                <CommentReplyEntry
                  id={entry.id}
                  content={entry.content}
                  isReply={entry.isReply}
                  replyingTo={entry.replyingTo}
                  parentId={entry.parentId}
                  userId={entry.userId}
                  productRequestId={entry.productRequestId}
                  user={entry.user}
                  ref={ref}
                  key={entry.id}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default forwardRef(CommentReply);
