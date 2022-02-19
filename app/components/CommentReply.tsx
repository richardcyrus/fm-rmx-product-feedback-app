import { useState } from "react";

import CommentReplyForm from "~/components/CommentReplyForm";

export interface CommentReplyProps {
  id: number;
  content: string;
  isReply?: boolean;
  replyingTo?: string | unknown;
  parentId?: number | unknown;
  userId: number;
  productRequestId?: number;
  user: {
    id: number;
    name: string;
    username: string;
    image: string;
  };
  replies?: CommentReplyProps[];
}

export default function CommentReply(props: CommentReplyProps) {
  const [isReplyFormOpen, setReplyFormOpen] = useState(false);

  const onReplyButtonClick = () => {
    setReplyFormOpen((currentState) => !currentState);
  };

  return (
    <>
      <div className="feedback-detail-comment-reply">
        <div className="feedback-detail-comment-heading">
          <div className="commenter-image">
            <img src={props.user.image} alt={`Avatar of ${props.user.name}`} />
          </div>
          <div className="commenter-names">
            <h2 className="h4 commenter-name">{props.user.name}</h2>
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
        {isReplyFormOpen ? <CommentReplyForm /> : null}
      </div>
    </>
  );
}
