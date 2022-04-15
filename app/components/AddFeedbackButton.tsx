import { Link } from "@remix-run/react";

import IconPlus from "~/assets/shared/IconPlus";

function AddFeedbackButton() {
  return (
    <Link to="/feedback/new" className="button button-primary">
      <IconPlus aria-hidden="true" className="plus-icon" /> Add Feedback
    </Link>
  );
}

export default AddFeedbackButton;
