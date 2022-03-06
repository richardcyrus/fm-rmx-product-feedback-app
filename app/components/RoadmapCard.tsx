import * as React from "react";

import { Link } from "remix";

import UpVoteIcon from "~/assets/shared/IconArrowUp";
import CommentIcon from "~/assets/shared/IconComments";
import { toTitleCase } from "~/utils/stringUtils";

export interface FeedbackData {
  id: number;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  comments: number;
}

export default function RoadmapCard(props: FeedbackData) {
  const handleUpvoteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const button = event.currentTarget;
    button.classList.toggle("active");
  };

  return (
    <>
      <div className={`roadmap-card roadmap-card__${props.status}`}>
        <div className="roadmap-summary">
          <div className="roadmap-summary__category">
            <div className={`bullet bullet__${props.status}`} />
            <p className="body1">{toTitleCase(props.status)}</p>
          </div>
          <Link to={`/feedback/view/${props.id}`}>
            <h3 className="h3 roadmap-title">{props.title}</h3>
          </Link>
          <p className="body1 roadmap-description">{props.description}</p>
          <p className="roadmap-category">
            {props.category.length > 2
              ? toTitleCase(props.category)
              : props.category.toLocaleUpperCase()}
          </p>
        </div>
        <div className="vote-container">
          <button
            type="button"
            className="button vote-button"
            onClick={(e) => handleUpvoteClick(e)}
          >
            <UpVoteIcon aria-hidden="true" className="upvote-icon" />
            <p className="vote-count">{props.upvotes}</p>
          </button>
        </div>
        <div className="comment-info">
          <CommentIcon aria-hidden="true" className="comment-icon" />
          <span className="comment-count">{props.comments}</span>
        </div>
      </div>
    </>
  );
}
