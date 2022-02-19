import type { LinksFunction, LoaderFunction } from "remix";
import { Form, useLoaderData } from "remix";
import { IComments } from "~/components/CommentReply";
import FeedbackComment from "~/components/FeedbackComment";

import FeedbackDetailHeader from "~/components/FeedbackDetailHeader";
import SuggestionCard, {
  links as SuggestionCardLinks,
} from "~/components/SuggestionCard";

import feedbackViewStylesUrl from "~/styles/feedback-view.css";

import { db } from "~/utils/db.server";

export const links: LinksFunction = () => {
  return [
    ...SuggestionCardLinks(),
    { rel: "stylesheet", href: feedbackViewStylesUrl },
  ];
};

type Suggestion = {
  id: number;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  comments?: number;
};

interface IFeedbackDetail {
  comments: IComments[];
  suggestion: Suggestion;
}

export const loader: LoaderFunction = async ({ params }) => {
  // TODO: Handle missing ID or ID of wrong type
  const id = params.id;
  const feedbackId = parseInt(id, 10);

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

  // TODO: Handle no data returned.
  return {
    comments: data?.comments,
    suggestion: {
      id: data?.id,
      title: data?.title,
      category: data?.category,
      upvotes: data?.upvotes,
      status: data?.status,
      description: data?.description,
      comments: data?._count.comments,
    },
  };
};

export default function FeedbackDetail() {
  const data = useLoaderData<IFeedbackDetail>();

  return (
    <>
      <FeedbackDetailHeader id={data.suggestion.id} />
      <div className="feedback-detail-wrapper">
        <SuggestionCard suggestion={data.suggestion} />
        <div className="feedback-detail-comments">
          <h3 className="h3 feedback-detail-comment-title">
            {data.suggestion.comments} Comments
          </h3>
          {data.comments.map((comment) => (
            <FeedbackComment comment={comment} key={comment.id} />
          ))}
        </div>
        <div className="feedback-detail-add-comment">
          <h3 className="h3 feedback-detail-add-comment-title">Add Comment</h3>
          <Form
            className="feedback-detail-add-comment-form"
            autoComplete="off"
            method="post"
          >
            <label htmlFor="addComment" className="sr-only">
              Add comment
            </label>
            <textarea
              name="addComment"
              id="addComment"
              cols={30}
              rows={3}
              placeholder="Type your comment here"
              aria-describedby="feedbackAddCommentHelpBlock"
              className="input"
            />
            <div className="form-control-group">
              <div className="form-text" id="feedbackAddCommentHelpBlock">
                250 Characters left
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
