import * as React from "react";
import { useState } from "react";
import type { LinksFunction, LoaderFunction } from "remix";
import { Form, useLoaderData } from "remix";
import invariant from "tiny-invariant";

import { CommentReplyProps } from "~/components/CommentReply";
import FeedbackComment from "~/components/FeedbackComment";
import FeedbackDetailHeader from "~/components/FeedbackDetailHeader";
import SuggestionCard, {
  links as SuggestionCardLinks,
  SuggestionCardProps,
} from "~/components/SuggestionCard";

import feedbackViewStylesUrl from "~/styles/feedback-view.css";

import { db } from "~/utils/db.server";

export const links: LinksFunction = () => {
  return [
    ...SuggestionCardLinks(),
    { rel: "stylesheet", href: feedbackViewStylesUrl },
  ];
};

type LoaderData = {
  comments: CommentReplyProps[];
  suggestion: SuggestionCardProps;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Expected params.id");

  const feedbackId = parseInt(params.id, 10);

  const data = await db.productRequest.findUnique({
    where: { id: feedbackId },
    include: {
      comments: {
        where: { isReply: false },
        include: {
          user: true,
          replies: {
            include: {
              user: true,
            },
          },
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  if (!data) {
    throw new Error("Feedback record not found");
  }

  return {
    comments: data.comments,
    suggestion: {
      id: data.id,
      title: data.title,
      category: data.category,
      upvotes: data.upvotes,
      status: data.status,
      description: data.description,
      comments: data._count.comments,
    },
  };
};

export default function FeedbackDetail() {
  const data = useLoaderData<LoaderData>();
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

  return (
    <>
      <FeedbackDetailHeader id={data.suggestion.id} />
      <div className="feedback-detail-wrapper">
        <SuggestionCard {...data.suggestion} />
        <div className="feedback-detail-comments">
          <h3 className="h3 feedback-detail-comment-title">
            {data.suggestion.comments} Comments
          </h3>
          {data.comments.map((comment) => (
            <FeedbackComment {...comment} key={comment.id} />
          ))}
        </div>
        <div className="feedback-detail-add-comment">
          <h3 className="h3 feedback-detail-add-comment-title">Add Comment</h3>
          <Form
            className="feedback-detail-add-comment-form"
            autoComplete="off"
            method="post"
          >
            <input type="hidden" name="feedbackId" value={data.suggestion.id} />
            <label htmlFor="addComment" className="sr-only">
              Add comment
            </label>
            <textarea
              name="addComment"
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
              <button type="submit" className="button button-primary">
                Post Comment
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
