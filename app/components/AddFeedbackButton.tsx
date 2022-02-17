import { Link } from "remix";

import IconPlus from "~/assets/shared/IconPlus";

function AddFeedbackButton() {
  return (
    <Link to="/feedback/new" className="button button-primary">
      <IconPlus className="plus-icon" /> Add Feedback
    </Link>
  );
}

export default AddFeedbackButton;
