import { Link } from "remix";

import LeftArrowIcon from "~/assets/shared/IconArrowLeft";
import AddFeedbackButton from "~/components/AddFeedbackButton";

export default function RoadmapHeader() {
  return (
    <>
      <header className="roadmap-header">
        <div className="roadmap-header__wrapper">
          <Link to="/" className="button go-back-button">
            <LeftArrowIcon className="left-arrow-icon" />
            <span className="go-back-button__label">Go Back</span>
          </Link>
          <h1 className="h1 roadmap-header__title">Roadmap</h1>
        </div>
        <AddFeedbackButton />
      </header>
    </>
  );
}
