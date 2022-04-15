import type { ForwardedRef } from "react";
import * as React from "react";

import { Form } from "@remix-run/react";

interface CommentReplyFormProps {
  replyToCommentId: number;
  replyingToUsername: string;
  productRequestId: number | undefined;
}

function CommentReplyForm(
  props: CommentReplyFormProps,
  ref: ForwardedRef<HTMLFormElement>
) {
  return (
    <>
      <Form
        ref={ref}
        className="comment-reply-form"
        autoComplete="off"
        method="post"
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
        <label htmlFor="add-comment-reply" className="sr-only">
          Add comment reply
        </label>
        <textarea
          name="content"
          id="add-comment-reply"
          cols={30}
          rows={3}
          maxLength={250}
          className="input"
          placeholder="Type your reply here"
        />
        <div className="form-control-group">
          <button
            type="submit"
            className="button button-primary"
            name="_action"
            value="comment_reply"
          >
            Post Reply
          </button>
        </div>
      </Form>
    </>
  );
}

export default React.forwardRef(CommentReplyForm);
