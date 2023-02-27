import { useEffect, useRef } from "react";

import { useFetcher } from "@remix-run/react";

interface CommentReplyFormProps {
  replyToCommentId: number;
  replyingToUsername: string;
  productRequestId: number | undefined;
}

function CommentReplyForm(props: CommentReplyFormProps) {
  const replyForm = useFetcher();

  const isCommentReply =
    replyForm.state === "submitting" &&
    replyForm.submission.formData.get("_action") === "comment_reply";

  const commentReplyFormRef = useRef<HTMLFormElement>(null);

  // Clear the form on successful save.
  useEffect(
    function handleCommentReplyUpdates() {
      if (!isCommentReply) {
        commentReplyFormRef.current?.reset();
      }
    },
    [isCommentReply]
  );

  // TODO: Must use client side validation! Don't allow submission if invalid!
  // Because this submits to the parent page, the useFetcher on this component
  // does not get the server side validation errors.
  return (
    <>
      <replyForm.Form
        ref={commentReplyFormRef}
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
          defaultValue={
            replyForm.type === "done"
              ? replyForm.data?.errors
                ? replyForm.data.formData?._action === "new_comment"
                  ? replyForm.data.formData?.description
                  : ""
                : ""
              : ""
          }
          className={`input ${
            replyForm.type === "done"
              ? replyForm.data?.errors
                ? replyForm.data.formData?._action === "new_comment"
                  ? replyForm.data.errors?.fieldErrors?.content
                    ? "is-invalid"
                    : ""
                  : ""
                : ""
              : ""
          }`}
          aria-invalid={
            replyForm.type === "done"
              ? replyForm.data?.errors
                ? replyForm.data.formData?._action === "new_comment"
                  ? replyForm.data.errors?.fieldErrors?.content
                    ? true
                    : undefined
                  : undefined
                : undefined
              : undefined
          }
          aria-errormessage={
            replyForm.type === "done"
              ? replyForm.data?.errors
                ? replyForm.data.formData?._action === "new_comment"
                  ? replyForm.data.errors?.fieldErrors?.content
                    ? `description-error-${props.replyToCommentId}`
                    : undefined
                  : undefined
                : undefined
              : undefined
          }
        />
        {replyForm.type === "done" ? (
          replyForm.data?.errors ? (
            replyForm.data.formData?._action === "new_comment" ? (
              replyForm.data.errors?.fieldErrors?.content &&
              replyForm.data.errors.fieldErrors.content.length > 0 ? (
                <div
                  role="alert"
                  aria-live="polite"
                  id={`description-error-${props.replyToCommentId}`}
                  className="invalid-input"
                >
                  {replyForm.data.errors.fieldErrors.content}
                </div>
              ) : null
            ) : null
          ) : null
        ) : null}
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
      </replyForm.Form>
    </>
  );
}

export default CommentReplyForm;
