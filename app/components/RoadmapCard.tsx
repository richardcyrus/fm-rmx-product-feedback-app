import * as React from "react";
import { Link } from "remix";

import UpVoteIcon from "~/assets/shared/IconArrowUp";
import CommentIcon from "~/assets/shared/IconComments";

import { toTitleCase } from "~/utils/stringUtils";

export default function RoadmapCard() {
  const handleUpvoteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const button = event.currentTarget;
    button.classList.toggle("active");
  };

  return (
    <>
      <div className="roadmap-card roadmap-card__planned">
        <div className="roadmap-summary">
          <div className="roadmap-summary__category">
            <div className="bullet bullet__planned" />
            <p className="body1">Planned</p>
          </div>
          <Link to={`/feedback/view/7`}>
            <h3 className="h3 roadmap-title">More comprehensive reports</h3>
          </Link>
          <p className="body1 roadmap-description">
            It would be great to see a more detailed breakdown of solutions,
          </p>
          <p className="roadmap-category">Feature</p>
        </div>
        <div className="vote-container">
          <button
            type="button"
            className="button vote-button"
            onClick={(e) => handleUpvoteClick(e)}
          >
            <UpVoteIcon className="upvote-icon" />
            <p className="vote-count">123</p>
          </button>
        </div>
        <div className="comment-info">
          <CommentIcon className="comment-icon" />
          <span className="comment-count">2</span>
        </div>
      </div>
    </>
  );
}
