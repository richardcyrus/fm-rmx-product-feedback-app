import { Form } from "@remix-run/react";

interface CommentReplyFormProps {
  replyToCommentId: number;
  replyingToUsername: string;
  productRequestId: number | undefined;
}

function CommentReplyForm(props: CommentReplyFormProps) {
  return (
    <>
      <Form
        reloadDocument
        className="comment-reply-form"
        autoComplete="off"
        method="post"
        id={`comment-reply-form-${props.replyToCommentId}`}
      >
        <input
          type="hidden"
          name="replyToCommentId"
          value={props.replyToCommentId}
        />
        <input
          type="hidden"
          name="replyingToUsername"
          value={props.replyingToUsername}
        />
        <input type="hidden" name="productId" value={props.productRequestId} />
        <label
          htmlFor={`add-comment-reply-${props.replyToCommentId}`}
          className="sr-only"
        >
          Add comment reply
        </label>
        <textarea
          name="content"
          id={`add-comment-reply-${props.replyToCommentId}`}
          cols={30}
          rows={3}
          maxLength={250}
          placeholder="Type your reply here"
        />
        <div className="form-control-group">
          <button
            type="submit"
            className="button button-primary"
            name="_action"
            value="comment_reply"
            id={`post-reply-${props.replyToCommentId}`}
          >
            Post Reply
          </button>
        </div>
      </Form>
    </>
  );
}

export default CommentReplyForm;
