import { useState } from "react";
import type { LinksFunction } from "remix";
import { Form, useNavigate } from "remix";

import LeftArrowIcon from "~/assets/shared/IconArrowLeft";
import EditFeedbackIcon from "~/assets/shared/IconEditFeedback";

import FeedbackFormListbox, {
  links as FeedbackFormListboxLinks,
} from "~/components/FeedbackFormListbox";

import newFeedbackFormStylesUrl from "~/styles/feedback-form.css";

export const links: LinksFunction = () => {
  return [
    ...FeedbackFormListboxLinks(),
    { rel: "stylesheet", href: newFeedbackFormStylesUrl },
  ];
};

const categoryOptions: Record<string, string> = {
  feature: "Feature",
  ui: "UI",
  ux: "UX",
  enhancement: "Enhancement",
  bug: "Bug",
};

const statusOptions: Record<string, string> = {
  suggestion: "Suggestion",
  planned: "Planned",
  "in-progress": "In-Progress",
  live: "Live",
};

export default function FeedbackEdit() {
  const navigate = useNavigate();

  const [categoryValue, setCategoryValue] = useState("feature");
  const [statusValue, setStatusValue] = useState("suggestion");

  const onCategoryOptionChange = (value: string) => {
    setCategoryValue(value);
  };

  const onStatusOptionChange = (value: string) => {
    setStatusValue(value);
  };

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
          <EditFeedbackIcon className="feedback-form-icon" />
        </div>
        <h1 className="h1 feedback-form-title">
          Editing &lsquo;Feedback&rsquo;
        </h1>
        <Form
          method="post"
          className="edit-feedback-form feedback-form"
          autoComplete="off"
        >
          <input type="hidden" name="feedbackId" />
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
              value={categoryValue}
              labelledby="feedbackCategoryLabel"
              describedby="feedbackCategoryHelpBlock"
              options={categoryOptions}
              onOptionChange={onCategoryOptionChange}
            />
          </div>
          <div className="form-control">
            <span className="form-label" id="feedbackStatusLabel">
              Update Status
            </span>
            <div className="form-text" id="feedbackStatusHelpBlock">
              Change feedback state
            </div>
            <FeedbackFormListbox
              name="feedbackStatus"
              value={statusValue}
              labelledby="feedbackStatusLabel"
              describedby="feedbackStatusHelpBlock"
              options={statusOptions}
              onOptionChange={onStatusOptionChange}
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
            <button type="button" className="button button-danger">
              Delete
            </button>
            <button type="submit" className="button button-primary">
              Save Changes
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
