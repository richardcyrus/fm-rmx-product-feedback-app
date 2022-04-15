import * as React from "react";

import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import UpVoteIcon from "~/assets/shared/IconArrowUp";
import CommentIcon from "~/assets/shared/IconComments";
import { useLocalStorage } from "~/hooks/use-local-storage";
import { useMounted } from "~/hooks/use-mounted";
import suggestionCardStylesUrl from "~/styles/suggestion-card.css";
import { toTitleCase } from "~/utils/string-utils";

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

function SuggestionCard(props: SuggestionCardProps) {
  const { hasMounted } = useMounted();
  const [myUpvotes, setMyUpvotes] = useLocalStorage(
    String(props.id),
    props.upvotes
  );

  const handleUpvoteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const button = event.currentTarget;
    button.classList.toggle("active");

    if (button.classList.contains("active")) {
      setMyUpvotes((current: number) => current + 1);
    } else {
      setMyUpvotes((current: number) => current - 1);
    }
  };

  return (
    <>
      <div className="suggestion-card">
        <div className="suggestion-summary">
          <Link to={`/feedback/view/${props.id}`}>
            <h2
              className="h3 suggestion-title"
              aria-label={`Feedback title: ${props.title}`}
            >
              {props.title}
            </h2>
          </Link>
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
            className={`button vote-button ${
              hasMounted && myUpvotes > props.upvotes ? "active" : ""
            }`}
            data-upvotes={hasMounted ? myUpvotes : props.upvotes}
          >
            <UpVoteIcon aria-hidden="true" className="upvote-icon" />
            <p className="vote-count">
              {hasMounted ? myUpvotes : props.upvotes}
            </p>
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

export default SuggestionCard;
