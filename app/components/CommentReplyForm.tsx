import { Form } from "remix";

export default function CommentReplyForm() {
  return (
    <>
      <Form className="comment-reply-form" autoComplete="off">
        <label htmlFor="addCommentReply" className="sr-only">
          Add comment reply
        </label>
        <textarea
          name="addCommentReply"
          id="addCommentReply"
          cols={30}
          rows={3}
          className="input"
          placeholder="Type your reply here"
        />
        <div className="form-control-group">
          <button type="submit" className="button button-primary">
            Post Reply
          </button>
        </div>
      </Form>
    </>
  );
}
