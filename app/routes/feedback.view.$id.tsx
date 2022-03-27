import * as React from "react";
import { useRef, useState, useEffect } from "react";

import type { LinksFunction, LoaderFunction, ActionFunction } from "remix";
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import invariant from "tiny-invariant";
import { z } from "zod";

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

const NewCommentFormValidator = z.object({
  productId: z.string({
    required_error: "productId is required",
    invalid_type_error: "productId must be a string",
  }),
  content: z
    .string()
    .min(1, { message: "Can't be empty" })
    .max(250, { message: "Too many characters" }),
  _action: z.enum(["new_comment", "comment_reply"]),
});

const CommentReplyFormValidator = NewCommentFormValidator.extend({
  replyToCommentId: z.string({
    required_error: "replyToCommentId is required",
    invalid_type_error: "replyToCommentId must be a string",
  }),
  replyingToUsername: z.string({
    required_error: "replyingToUsername is required",
    invalid_type_error: "replyingToUsername must be a string",
  }),
});

type NewCommentFormDataErrors = z.inferFlattenedErrors<
  typeof NewCommentFormValidator
>;
type CommentReplyFormDataErrors = z.inferFlattenedErrors<
  typeof CommentReplyFormValidator
>;

type ActionData = {
  errors: CommentReplyFormDataErrors | NewCommentFormDataErrors;
  formData: Record<string, string>;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData()) as Record<
    string,
    string
  >;

  const actionType = formData._action;

  switch (actionType) {
    case "new_comment": {
      // Handle a new comment
      const result = NewCommentFormValidator.safeParse(formData);
      if (!result.success) {
        const errors: NewCommentFormDataErrors = result.error.flatten();

        return json<ActionData>({ errors, formData }, { status: 400 });
      }

      const content = result.data.content;
      const productId = result.data.productId;

      const productRequestId = parseInt(productId, 10);

      await createComment(content, productRequestId);

      return redirect(request.url);
    }
    case "comment_reply": {
      // Handle a comment reply
      const result = CommentReplyFormValidator.safeParse(formData);
      if (!result.success) {
        const errors: NewCommentFormDataErrors = result.error.flatten();

        return json<ActionData>({ errors, formData }, { status: 400 });
      }

      const content = result.data.content;
      const productId = result.data.productId;
      const replyingToUsername = result.data.replyingToUsername;
      const replyToCommentId = result.data.replyToCommentId;

      const productRequestId = parseInt(productId, 10);
      const parentId = parseInt(replyToCommentId, 10);

      await createCommentReply(
        content,
        productRequestId,
        replyingToUsername,
        parentId
      );

      return redirect(request.url);
    }
    default: {
      throw new Response("Invalid action", { status: 400 });
    }
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Expected params.id");

  const feedbackId = parseInt(params.id, 10);

  const productRequest = await getProductRequestWithCommentsById(feedbackId);

  return json<LoaderData>({
    comments: productRequest.comments,
    suggestion: {
      id: productRequest.id,
      title: productRequest.title,
      category: productRequest.category,
      upvotes: productRequest.upvotes,
      status: productRequest.status,
      description: productRequest.description,
      comments: productRequest._count.comments,
    },
  });
};

function FeedbackDetail() {
  const actionData = useActionData() as ActionData;
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
    // This check is done, so that the `ts-ignore` rule is safer to use.
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
      <FeedbackDetailHeader
        id={data.suggestion.id}
        title={data.suggestion.title}
      />
      <main role="main" className="feedback-detail-wrapper">
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
            <input type="hidden" name="productId" value={data.suggestion.id} />
            <label htmlFor="add-comment" className="sr-only">
              Add comment
            </label>
            <textarea
              name="content"
              id="add-comment"
              cols={30}
              rows={3}
              maxLength={250}
              placeholder="Type your comment here"
              defaultValue={
                actionData?.formData?._action === "new_comment"
                  ? actionData?.formData?.description
                  : ""
              }
              aria-describedby="add-comment-help-block"
              className={`input ${
                actionData?.formData?._action === "new_comment"
                  ? actionData?.errors?.fieldErrors?.content
                    ? "is-invalid"
                    : ""
                  : ""
              }`}
              onChange={(e) => onTextareaChange(e)}
              aria-invalid={
                actionData?.formData?._action === "new_comment"
                  ? actionData?.errors?.fieldErrors?.content
                    ? true
                    : undefined
                  : undefined
              }
              aria-errormessage={
                actionData?.formData?._action === "new_comment"
                  ? actionData?.errors?.fieldErrors?.content
                    ? "description-error"
                    : undefined
                  : undefined
              }
            />
            {actionData?.formData?._action === "new_comment" ? (
              actionData?.errors?.fieldErrors?.content &&
              actionData.errors.fieldErrors.content.length > 0 ? (
                <div id="description-error" className="invalid-input">
                  {actionData.errors.fieldErrors.content}
                </div>
              ) : null
            ) : null}
            <div className="form-control-group">
              <div className="form-text" id="add-comment-help-block">
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
      </main>
    </>
  );
}

export default FeedbackDetail;
