import * as React from "react";
import { ForwardedRef, useState } from "react";

import CommentReplyForm from "~/components/CommentReplyForm";

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

/**
 * I'd prefer if this were a traditional function declaration. I think it makes it
 * easier to read and eliminates the need to set the `displayName` property.
 *
 * Intentionally left as an arrow function. Attempting to convert it to a standard
 * function declaration caused TypeScript to complain about the `ref` property
 * when using the component in a recursive manner,
 *
 * May re-visit in the future for a fix, just don't know how to fix it at the moment.
 */
const CommentReply = React.forwardRef(
  (props: CommentReplyProps, ref: ForwardedRef<HTMLFormElement>) => {
    const [isReplyFormOpen, setReplyFormOpen] = useState(false);

    const onReplyButtonClick = () => {
      setReplyFormOpen((currentState) => !currentState);
    };

    return (
      <>
        <div className="feedback-detail-comment-reply">
          <div className="feedback-detail-comment-heading">
            <div className="commenter-image">
              <img
                src={props.user.image}
                alt={`Avatar of ${props.user.name}`}
              />
            </div>
            <div className="commenter-names">
              <h5
                className="h4 commenter-name"
                aria-label={`Reply from ${props.user.name}`}
              >
                {props.user.name}
              </h5>
              <p className="commenter-username">@{props.user.username}</p>
            </div>
            <button
              type="button"
              className="button button-reply"
              onClick={onReplyButtonClick}
            >
              Reply
            </button>
          </div>
          <p className="comment-text">
            <span className="replying-to">@{props.replyingTo}</span>
            &nbsp;&nbsp;
            {props.content}
          </p>
          {isReplyFormOpen ? (
            <CommentReplyForm
              ref={ref}
              replyToCommentId={props.id}
              replyingToUsername={props.user.username}
              productRequestId={props.productRequestId}
            />
          ) : null}
          {(props.replies || []).map((reply) => (
            <CommentReply
              id={reply.id}
              content={reply.content}
              isReply={reply.isReply}
              replyingTo={reply.replyingTo}
              parentId={reply.parentId}
              userId={reply.userId}
              productRequestId={reply.productRequestId}
              user={reply.user}
              replies={reply.replies}
              ref={ref}
              key={reply.id}
            />
          ))}
        </div>
      </>
    );
  }
);
CommentReply.displayName = "CommentReply";

export default CommentReply;
