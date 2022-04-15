import { Link, useNavigate } from "@remix-run/react";

import LeftArrowIcon from "~/assets/shared/IconArrowLeft";

type HeaderProps = {
  id: number;
  title: string;
};

function FeedbackDetailHeader(props: HeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <header className="feedback-detail-header" role="banner">
        <button
          type="button"
          className="button go-back-button"
          onClick={() => navigate(-1)}
        >
          <LeftArrowIcon aria-hidden="true" className="left-arrow-icon" />
          <span className="go-back-button__label">Go Back</span>
        </button>
        <Link to={`/feedback/edit/${props.id}`} className="button button-edit">
          Edit Feedback
        </Link>
        <h1 className="h1 feedback-view-title sr-only">
          Viewing feedback detail for &lsquo;{props.title}&rsquo;
        </h1>
      </header>
    </>
  );
}

export default FeedbackDetailHeader;
