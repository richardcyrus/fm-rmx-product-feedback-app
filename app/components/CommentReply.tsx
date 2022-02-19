import * as React from "react";

import CommentReplyForm from "~/components/CommentReplyForm";

export interface IComments {
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
  replies?: IComments[];
}

export default function CommentReply({ comment }: { comment: IComments }) {
  const [isReplyFormOpen, setReplyFormOpen] = React.useState(false);

  const onReplyButtonClick = () => {
    setReplyFormOpen((currentState) => !currentState);
  };

  return (
    <>
      <div className="feedback-detail-comment-reply">
        <div className="feedback-detail-comment-heading">
          <div className="commenter-image">
            <img
              src={comment.user.image}
              alt={`Avatar of ${comment.user.name}`}
            />
          </div>
          <div className="commenter-names">
            <h2 className="h4 commenter-name">{comment.user.name}</h2>
            <p className="commenter-username">@{comment.user.username}</p>
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
          <span className="replying-to">@{comment.replyingTo}</span>
          &nbsp;&nbsp;
          {comment.content}
        </p>
        {isReplyFormOpen ? <CommentReplyForm /> : null}
      </div>
    </>
  );
}
