import * as React from "react";

import type { LinksFunction } from "remix";

import UpVoteIcon from "~/assets/shared/IconArrowUp";
import CommentIcon from "~/assets/shared/IconComments";
import suggestionCardStylesUrl from "~/styles/suggestion-card.css";
import { toTitleCase } from "~/utils/stringUtils";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: suggestionCardStylesUrl }];
};

export interface SuggestionCardProps {
  id: number;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  comments: number;
}

export default function SuggestionCard(props: SuggestionCardProps) {
  const handleUpvoteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const button = event.currentTarget;
    button.classList.toggle("active");
  };

  return (
    <>
      <div className="suggestion-card">
        <div className="suggestion-summary">
          <h2
            className="h3 suggestion-title"
            aria-label={`Feedback title: ${props.title}`}
          >
            {props.title}
          </h2>
          <p className="body1 suggestion-description">{props.description}</p>
          <p className="suggestion-category">
            {props.category.length > 2
              ? toTitleCase(props.category)
              : props.category.toLocaleUpperCase()}
          </p>
        </div>
        <div className="vote-container">
          <button
            type="button"
            onClick={(e) => handleUpvoteClick(e)}
            className="button vote-button"
            data-upvotes={props.upvotes}
          >
            <UpVoteIcon className="upvote-icon" />
            <p className="vote-count">{props.upvotes}</p>
          </button>
        </div>
        <div className="comment-info">
          <CommentIcon className="comment-icon" />
          <span className="comment-count">{props.comments}</span>
        </div>
      </div>
    </>
  );
}
