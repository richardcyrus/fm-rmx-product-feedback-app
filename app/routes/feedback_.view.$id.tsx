import * as React from "react";
import { useEffect, useRef, useState } from "react";

import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "react-router";
import {
  data,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "react-router";
import invariant from "tiny-invariant";
import { z } from "zod";

import type { CommentReplyProps } from "~/components/CommentReply";
import FeedbackComment from "~/components/FeedbackComment";
import FeedbackDetailHeader from "~/components/FeedbackDetailHeader";
import type { SuggestionCardProps } from "~/components/SuggestionCard";
import SuggestionCard, {
  links as SuggestionCardLinks,
} from "~/components/SuggestionCard";
import { createComment, createCommentReply } from "~/models/comment.server";
import { getProductRequestWithCommentsById } from "~/models/productRequest.server";
import feedbackViewStylesUrl from "~/styles/feedback-view.css?url";

export const links: LinksFunction = () => {
  return [
    ...SuggestionCardLinks(),
    { rel: "stylesheet", href: feedbackViewStylesUrl },
  ];
};

export const meta: MetaFunction = () => [
  {
    title: "Feedback Detail | Product Feedback App",
  },
];

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

type FormData =
  | z.TypeOf<typeof NewCommentFormValidator>
  | z.TypeOf<typeof CommentReplyFormValidator>;

type ActionData = {
  errors: CommentReplyFormDataErrors | NewCommentFormDataErrors;
  formData: FormData;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const formData = Object.fromEntries(form) as FormData;

  switch (formData._action) {
    case "new_comment": {
      // Handle a new comment
      const result = NewCommentFormValidator.safeParse(formData);
      if (!result.success) {
        const errors: NewCommentFormDataErrors = result.error.flatten();

        return data({ errors, formData }, { status: 400 });
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

        return data({ errors, formData }, { status: 400 });
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

  return {
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
  };
};

function FeedbackDetail() {
  const data = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const addComment = useFetcher<ActionData>();
  const isNewComment =
    addComment.state === "submitting" &&
    addComment.formData?.get("_action") === "new_comment";
  const isAddCommentDone =
    addComment.state === "idle" && addComment.data != null;
  const isCommentReply =
    navigation.state === "submitting" &&
    navigation.formData?.get("_action") === "comment_reply";

  const [remainingCharacters, setRemainingCharacters] = useState(250);
  const [isReplyFormOpen, setReplyFormOpen] = useState(0);
  const [openReplyFormIndex, setOpenReplyFormIndex] = useState(0);

  const onReplyButtonClick = (key: number) => {
    setReplyFormOpen((currentState) => {
      return currentState === 0 ? key : 0;
    });
  };

  const onReplyFormButtonClick = (key: number) => {
    setOpenReplyFormIndex((currentState) => {
      return currentState === 0 ? key : 0;
    });
  };

  const onTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // This check is done, so that the `ts-ignore` rule is safer to use.
    if (event.target.hasAttribute("maxlength")) {
      const currentLength = event.target.value.length;
      const maxLength = event.target.getAttribute("maxlength") as string;
      const maxCharCount = parseInt(maxLength, 10);
      const charLeft = maxCharCount - currentLength;
      setRemainingCharacters(charLeft);
    }
  };

  const addCommentFormRef = useRef<HTMLFormElement>(null);

  // Clear the add comment form on successful save.
  useEffect(
    function handleAddCommentUpdates() {
      if (!isNewComment) {
        addCommentFormRef.current?.reset();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRemainingCharacters(250);
      }
    },
    [isNewComment]
  );

  useEffect(
    function handleCommentReplyUpdates() {
      if (isCommentReply) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReplyFormOpen(0);
        setOpenReplyFormIndex(0);
      }
    },
    [isCommentReply]
  );

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
          <h3
            id="comments-section-title"
            className="h3 feedback-detail-comment-title"
          >
            {data.suggestion.comments} Comments
          </h3>
          {data.comments.map((comment) => (
            <FeedbackComment
              key={comment.id}
              id={comment.id}
              content={comment.content}
              isReply={comment.isReply}
              replyingTo={comment.replyingTo}
              parentId={comment.parentId}
              userId={comment.userId}
              productRequestId={comment.productRequestId}
              user={comment.user}
              isReplyFormOpen={isReplyFormOpen === comment.id}
              onReplyButtonClick={() => onReplyButtonClick(comment.id)}
              openReplyFormIndex={openReplyFormIndex}
              onReplyFormButtonClick={onReplyFormButtonClick}
              replies={comment.replies}
            />
          ))}
        </div>
        <div className="feedback-detail-add-comment">
          <h3
            id={`add-comment-title-${data.suggestion.id}`}
            className="h3 feedback-detail-add-comment-title"
          >
            Add Comment
          </h3>
          <addComment.Form
            className="feedback-detail-add-comment-form"
            autoComplete="off"
            method="post"
            ref={addCommentFormRef}
            id={`add-comment-form-${data.suggestion.id}`}
          >
            <input
              type="hidden"
              name="productId"
              data-testid="productId-input"
              value={data.suggestion.id}
            />
            <textarea
              name="content"
              id="add-comment"
              cols={30}
              rows={3}
              maxLength={250}
              placeholder="Type your comment here"
              defaultValue={
                isAddCommentDone
                  ? addComment.data?.errors
                    ? addComment.data.formData?._action === "new_comment"
                      ? addComment.data.formData?.content
                      : ""
                    : ""
                  : ""
              }
              aria-labelledby={`add-comment-title-${data.suggestion.id}`}
              className={`input ${
                isAddCommentDone
                  ? addComment.data?.errors
                    ? addComment.data.formData?._action === "new_comment"
                      ? addComment.data.errors?.fieldErrors?.content
                        ? "is-invalid"
                        : ""
                      : ""
                    : ""
                  : ""
              }`}
              onChange={(e) => onTextareaChange(e)}
              aria-invalid={
                isAddCommentDone
                  ? addComment.data?.errors
                    ? addComment.data.formData?._action === "new_comment"
                      ? addComment.data.errors?.fieldErrors?.content
                        ? true
                        : undefined
                      : undefined
                    : undefined
                  : undefined
              }
              aria-errormessage={
                isAddCommentDone
                  ? addComment.data?.errors
                    ? addComment.data.formData?._action === "new_comment"
                      ? addComment.data.errors?.fieldErrors?.content
                        ? `description-error-${data.suggestion.id}`
                        : undefined
                      : undefined
                    : undefined
                  : undefined
              }
            />
            {isAddCommentDone ? (
              addComment.data?.errors ? (
                addComment.data.formData?._action === "new_comment" ? (
                  addComment.data.errors?.fieldErrors?.content &&
                  addComment.data.errors.fieldErrors.content.length > 0 ? (
                    <div
                      role="alert"
                      aria-live="polite"
                      id={`description-error-${data.suggestion.id}`}
                      className="invalid-input"
                    >
                      {addComment.data.errors.fieldErrors.content}
                    </div>
                  ) : null
                ) : null
              ) : null
            ) : null}
            <div className="form-control-group">
              <div className="form-text" id="remaining-characters">
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
          </addComment.Form>
        </div>
      </main>
    </>
  );
}

export default FeedbackDetail;
