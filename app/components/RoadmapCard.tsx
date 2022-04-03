import * as React from "react";

import { Link } from "remix";

import UpVoteIcon from "~/assets/shared/IconArrowUp";
import CommentIcon from "~/assets/shared/IconComments";
import { useLocalStorage } from "~/hooks/use-local-storage";
import { useMounted } from "~/hooks/use-mounted";
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
            className={`button vote-button ${
              hasMounted && myUpvotes > props.upvotes ? "active" : ""
            }`}
            onClick={(e) => handleUpvoteClick(e)}
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
