import type { LinksFunction } from "remix";
import { Form, useNavigate } from "remix";

import FeedbackFormListbox, {
  links as FeedbackFormListboxLinks,
} from "~/components/FeedbackFormListbox";

import LeftArrowIcon from "~/assets/shared/IconArrowLeft";
import NewFeedbackIcon from "~/assets/shared/IconNewFeedback";

import newFeedbackFormStylesUrl from "~/styles/feedback-form.css";

export const links: LinksFunction = () => {
  return [
    ...FeedbackFormListboxLinks(),
    { rel: "stylesheet", href: newFeedbackFormStylesUrl },
  ];
};

const options: Record<string, string> = {
  feature: "Feature",
  ui: "UI",
  ux: "UX",
  enhancement: "Enhancement",
  bug: "Bug",
};

export default function FeedbackNew() {
  const navigate = useNavigate();

  return (
    <>
      <header className="feedback-form-header">
        <button
          className="button go-back-button"
          type="button"
          onClick={() => navigate(-1)}
        >
          <LeftArrowIcon className="left-arrow-icon" />
          <span className="go-back-button__label">Go Back</span>
        </button>
      </header>
      <div className="feedback-form-container">
        <div className="feedback-form-image">
          <NewFeedbackIcon className="feedback-form-icon" />
        </div>
        <h1 className="h1 feedback-form-title">Create New Feedback</h1>
        <Form
          method="post"
          className="new-feedback-form feedback-form"
          autoComplete="off"
        >
          <div className="form-control">
            <label htmlFor="feedbackTitle" className="form-label">
              Feedback Title
            </label>
            <div id="feedbackTitleHelpBlock">
              Add a short, descriptive headline
            </div>
            <input
              type="text"
              name="feedbackTitle"
              id="feedbackTitle"
              className="input"
              aria-describedby="feedbackTitleHelpBlock"
              required
            />
            <div className="invalid-input">Can&rsquo;t be empty</div>
          </div>
          <div className="form-control">
            <span className="form-label" id="feedbackCategoryLabel">
              Category
            </span>
            <div className="form-text" id="feedbackCategoryHelpBlock">
              Choose a category for your feedback
            </div>
            <FeedbackFormListbox
              name="feedbackCategory"
              value="feature"
              labelledby="feedbackCategoryLabel"
              describedby="feedbackCategoryHelpBlock"
              options={options}
              required={true}
            />
          </div>
          <div className="form-control">
            <label htmlFor="feedbackDetail" className="form-label">
              Feedback Detail
            </label>
            <div className="form-text" id="feedbackDetailHelpBlock">
              Include any specific comments on what should be improved, added,
              etc.
            </div>
            <textarea
              name="feedbackDetail"
              id="feedbackDetail"
              cols={30}
              rows={4}
              className="input"
              aria-describedby="feedbackDetailHelpBlock"
              required
            />
            <div className="invalid-input">Can&rsquo;t be empty</div>
          </div>
          <div className="form-control-group">
            <button type="submit" className="button button-primary">
              Add Feedback
            </button>
            <button type="reset" className="button button-secondary">
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
