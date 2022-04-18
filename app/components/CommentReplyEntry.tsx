import type { ForwardedRef } from "react";
import { useState, forwardRef } from "react";

import CommentReplyForm from "~/components/CommentReplyForm";

export interface CommentReplyEntryProps {
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
}

function CommentReplyEntry(
  props: CommentReplyEntryProps,
  ref: ForwardedRef<HTMLFormElement>
) {
  const [isReplyFormOpen, setReplyFormOpen] = useState(false);

  const onReplyButtonClick = () => {
    setReplyFormOpen((currentState) => !currentState);
  };

  return (
    <>
      <div className="feedback-detail-comment-heading">
        <div className="commenter-image">
          <img src={props.user.image} alt={`Avatar of ${props.user.name}`} />
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
    </>
  );
}

export default forwardRef(CommentReplyEntry);
