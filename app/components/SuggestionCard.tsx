import * as React from "react";
import UpVoteIcon from "~/assets/shared/IconArrowUp";
import CommentIcon from "~/assets/shared/IconComments";

import { toTitleCase } from "~/utils/stringUtils";

type Suggestion = {
  id: number;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  comments?: number;
};

export default function SuggestionCard({
  suggestion,
}: {
  suggestion: Suggestion;
}) {
  const handleUpvoteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const button = event.currentTarget;
    button.classList.toggle("active");
  };

  return (
    <>
      <div className="suggestion-card">
        <div className="suggestion-summary">
          <h3 className="suggestion-title">{suggestion.title}</h3>
          <p className="body1 suggestion-description">
            {suggestion.description}
          </p>
          <p className="suggestion-category">
            {toTitleCase(suggestion.category)}
          </p>
        </div>
        <div className="vote-container">
          <button
            type="button"
            onClick={(e) => handleUpvoteClick(e)}
            className="button vote-button"
            data-upvotes={suggestion.upvotes}
          >
            <UpVoteIcon className="upvote-icon" />
            <p className="vote-count">{suggestion.upvotes}</p>
          </button>
        </div>
        <div className="comment-info">
          <CommentIcon className="comment-icon" />
          <span className="comment-count">{suggestion.comments}</span>
        </div>
      </div>
    </>
  );
}
