import * as React from "react";
import { useState } from "react";
import CommentReply, { IComments } from "~/components/CommentReply";
import CommentReplyForm from "~/components/CommentReplyForm";

export default function FeedbackComment({ comment }: { comment: IComments }) {
  const [isReplyFormOpen, setReplyFormOpen] = useState(false);

  const onReplyButtonClick = () => {
    setReplyFormOpen((currentState) => !currentState);
  };

  const { user, replies } = comment;
  const replyList = replies ? replies : [];

  return (
    <>
      <div className="feedback-detail-comment" data-comment-id={comment.id}>
        <div className="feedback-detail-comment-heading">
          <div className="commenter-image">
            <img src={user.image} alt={`Avatar of ${user.name}`} />
          </div>
          <div className="commenter-names">
            <h2 className="h4 commenter-name">{user.name}</h2>
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
        <p className="comment-text">{comment.content}</p>
        {isReplyFormOpen ? <CommentReplyForm /> : null}
        {replyList.map((reply) => (
          <CommentReply comment={reply} key={reply.id} />
        ))}
      </div>
    </>
  );
}
