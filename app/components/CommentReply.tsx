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

export interface CommentReplyActionProps extends CommentReplyProps {
  isReplyFormOpen: boolean;
  onReplyButtonClick: () => void;
  onReplyFormButtonClick: (index: number) => void;
  openReplyFormIndex: number;
}

function CommentReply(props: CommentReplyActionProps) {
  return (
    <>
      <div className="feedback-detail-comment-reply">
        <div className="feedback-detail-comment-heading">
          <div className="commenter-image">
            <img src={props.user.image} alt="" />
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
            onClick={props.onReplyButtonClick}
            key={props.id}
            id={`reply-button-for-comment-${props.id}`}
          >
            Reply
          </button>
        </div>
        <p className="comment-text">
          <span className="replying-to">@{props.replyingTo}</span>
          &nbsp;&nbsp;{props.content}
        </p>
        {props.isReplyFormOpen ? (
          <div className="comment-reply-form-display">
            <CommentReplyForm
              replyToCommentId={props.id}
              replyingToUsername={props.user.username}
              productRequestId={props.productRequestId}
            />
          </div>
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
            key={reply.id}
            isReplyFormOpen={props.openReplyFormIndex === reply.id}
            onReplyButtonClick={() => props.onReplyFormButtonClick(reply.id)}
            openReplyFormIndex={props.openReplyFormIndex}
            onReplyFormButtonClick={props.onReplyFormButtonClick}
          />
        ))}
      </div>
    </>
  );
}

export default CommentReply;
