import { Link, useNavigate } from "remix";

import LeftArrowIcon from "~/assets/shared/IconArrowLeft";

type HeaderProps = {
  id: number;
};

export default function FeedbackDetailHeader(props: HeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <header className="feedback-detail-header">
        <button
          type="button"
          className="button go-back-button"
          onClick={() => navigate(-1)}
        >
          <LeftArrowIcon className="left-arrow-icon" />
          <span className="go-back-button__label">Go Back</span>
        </button>
        <Link to={`/feedback/edit/${props.id}`} className="button button-edit">
          Edit Feedback
        </Link>
      </header>
    </>
  );
}
