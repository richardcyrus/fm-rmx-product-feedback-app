import * as React from "react";
import { ForwardedRef, useState } from "react";

import CommentReply, { CommentReplyProps } from "~/components/CommentReply";
import CommentReplyForm from "~/components/CommentReplyForm";

const FeedbackComment = React.forwardRef(
  (props: CommentReplyProps, ref: ForwardedRef<HTMLFormElement>) => {
    const [isReplyFormOpen, setReplyFormOpen] = useState(false);

    const onReplyButtonClick = () => {
      setReplyFormOpen((currentState) => !currentState);
    };

    const { user } = props;

    return (
      <>
        <div className="feedback-detail-comment" data-comment-id={props.id}>
          <div className="feedback-detail-comment-heading">
            <div className="commenter-image">
              <img src={user.image} alt={`Avatar of ${user.name}`} />
            </div>
            <div className="commenter-names">
              <h4
                className="h4 commenter-name"
                aria-label={`Comment from ${user.name}`}
              >
                {user.name}
              </h4>
              <p className="commenter-username">@{user.username}</p>
            </div>
            <button
              type="button"
              className="button button-reply"
              onClick={onReplyButtonClick}
            >
              Reply
            </button>
          </div>
          <p className="comment-text">{props.content}</p>
          {isReplyFormOpen ? (
            <CommentReplyForm
              ref={ref}
              replyToCommentId={props.id}
              replyingToUsername={user.username}
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

export default FeedbackComment;
