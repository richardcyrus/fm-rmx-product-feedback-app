import * as React from "react";
import { useRef, useState, useEffect } from "react";

import type { LinksFunction, LoaderFunction, ActionFunction } from "remix";
import { Form, redirect, useLoaderData, useTransition } from "remix";
import invariant from "tiny-invariant";

import { CommentReplyProps } from "~/components/CommentReply";
import FeedbackComment from "~/components/FeedbackComment";
import FeedbackDetailHeader from "~/components/FeedbackDetailHeader";
import SuggestionCard, {
  links as SuggestionCardLinks,
  SuggestionCardProps,
} from "~/components/SuggestionCard";
import { createComment, createCommentReply } from "~/models/comment.server";
import { getProductRequestWithCommentsById } from "~/models/productRequest.server";
import feedbackViewStylesUrl from "~/styles/feedback-view.css";

export const links: LinksFunction = () => {
  return [
    ...SuggestionCardLinks(),
    { rel: "stylesheet", href: feedbackViewStylesUrl },
  ];
};

type LoaderData = {
  comments: Array<CommentReplyProps>;
  suggestion: SuggestionCardProps;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // TODO: Properly handle errors with the form data.
  // TODO: Properly validate the data received in the form.

  // Handle a new comment
  if (formData.get("_action") === "new_comment") {
    const content = formData.get("commentContent");
    const productId = formData.get("productRequestId");

    if (typeof content !== "string") {
      throw new Error("The comment content is not of the correct format");
    }

    if (typeof productId !== "string") {
      throw new Error("The product request ID is not of the correct format");
    }

    const productRequestId = parseInt(productId, 10);

    await createComment(content, productRequestId);

    // TODO: Do we add to navigation history?
    return redirect(request.url);
  }

  // Handle a comment reply
  if (formData.get("_action") === "comment_reply") {
    const content = formData.get("commentReplyContent");
    const productId = formData.get("productRequestId");
    const replyingToUsername = formData.get("replyingToUsername");
    const replyToCommentId = formData.get("replyToCommentId");

    if (typeof content !== "string") {
      throw new Error("The comment content is not of the correct format");
    }

    if (typeof productId !== "string") {
      throw new Error("The product request ID is not of the correct format");
    }

    if (typeof replyingToUsername !== "string") {
      throw new Error(
        "The username for the comment reply is not of the correct format."
      );
    }

    if (typeof replyToCommentId !== "string") {
      throw new Error(
        "The parent comment for the comment reply is not of the correct format."
      );
    }

    const productRequestId = parseInt(productId, 10);
    const parentId = parseInt(replyToCommentId, 10);

    await createCommentReply(
      content,
      productRequestId,
      replyingToUsername,
      parentId
    );

    // TODO: Do we add to navigation history?
    return redirect(request.url);
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Expected params.id");

  const feedbackId = parseInt(params.id, 10);

  return getProductRequestWithCommentsById(feedbackId);
};

function FeedbackDetail() {
  const data = useLoaderData<LoaderData>();
  const transition = useTransition();
  const isNewComment =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "new_comment";
  const isCommentReply =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "comment_reply";

  const [remainingCharacters, setRemainingCharacters] = useState(250);

  const onTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // This check is done, so that the `ts-ignore` rule is safe to use.
    if (event.target.hasAttribute("maxlength")) {
      let currentLength = event.target.value.length;
      // @ts-ignore
      let maxLength: string = event.target.getAttribute("maxlength");
      let maxCharCount = parseInt(maxLength, 10);
      let charLeft = maxCharCount - currentLength;
      setRemainingCharacters(charLeft);
    }
  };

  const addCommentFormRef = useRef<HTMLFormElement>(null);
  const commentReplyFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isNewComment) {
      addCommentFormRef.current?.reset();
      setRemainingCharacters(250);
    }
  }, [isNewComment]);

  useEffect(() => {
    if (!isCommentReply) {
      commentReplyFormRef.current?.reset();
    }
  }, [isCommentReply]);

  return (
    <>
      <FeedbackDetailHeader id={data.suggestion.id} />
      <div className="feedback-detail-wrapper">
        <SuggestionCard
          id={data.suggestion.id}
          title={data.suggestion.title}
          category={data.suggestion.category}
          upvotes={data.suggestion.upvotes}
          status={data.suggestion.status}
          description={data.suggestion.description}
          comments={data.suggestion.comments}
        />
        <div className="feedback-detail-comments">
          <h3 className="h3 feedback-detail-comment-title">
            {data.suggestion.comments} Comments
          </h3>
          {data.comments.map((comment) => (
            <FeedbackComment
              ref={commentReplyFormRef}
              key={comment.id}
              id={comment.id}
              content={comment.content}
              isReply={comment.isReply}
              replyingTo={comment.replyingTo}
              parentId={comment.parentId}
              userId={comment.userId}
              productRequestId={comment.productRequestId}
              user={comment.user}
              replies={comment.replies}
            />
          ))}
        </div>
        <div className="feedback-detail-add-comment">
          <h3 className="h3 feedback-detail-add-comment-title">Add Comment</h3>
          <Form
            className="feedback-detail-add-comment-form"
            autoComplete="off"
            method="post"
            ref={addCommentFormRef}
          >
            <input
              type="hidden"
              name="productRequestId"
              value={data.suggestion.id}
            />
            <label htmlFor="addComment" className="sr-only">
              Add comment
            </label>
            <textarea
              name="commentContent"
              id="addComment"
              cols={30}
              rows={3}
              maxLength={250}
              placeholder="Type your comment here"
              aria-describedby="feedbackAddCommentHelpBlock"
              className="input"
              onChange={(e) => onTextareaChange(e)}
            />
            <div className="form-control-group">
              <div className="form-text" id="feedbackAddCommentHelpBlock">
                {remainingCharacters} Characters left
              </div>
              <button
                type="submit"
                className="button button-primary"
                name="_action"
                value="new_comment"
                disabled={isNewComment}
              >
                {isNewComment ? "Saving..." : "Post Comment"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default FeedbackDetail;
