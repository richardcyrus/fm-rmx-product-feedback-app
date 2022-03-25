import { useState } from "react";

import type { LinksFunction, ActionFunction } from "remix";
import {
  Form,
  json,
  redirect,
  useNavigate,
  useActionData,
  useTransition,
} from "remix";
import invariant from "tiny-invariant";

import LeftArrowIcon from "~/assets/shared/IconArrowLeft";
import NewFeedbackIcon from "~/assets/shared/IconNewFeedback";
import FeedbackFormListbox, {
  links as FeedbackFormListboxLinks,
} from "~/components/FeedbackFormListbox";
import { createProductRequest } from "~/models/productRequest.server";
import newFeedbackFormStylesUrl from "~/styles/feedback-form.css";

const options: Record<string, string> = {
  feature: "Feature",
  ui: "UI",
  ux: "UX",
  enhancement: "Enhancement",
  bug: "Bug",
};

type FormErrors = {
  title?: string;
  category?: string;
  description?: string;
};

type ActionData = {
  errors: FormErrors;
  values: Record<string, string>;
};

export const links: LinksFunction = () => {
  return [
    ...FeedbackFormListboxLinks(),
    { rel: "stylesheet", href: newFeedbackFormStylesUrl },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  switch (actionType) {
    case "cancel": {
      return redirect("/");
    }
    case "save": {
      const validCategories = Object.keys(options);

      const title = formData.get("feedbackTitle");
      const category = formData.get("feedbackCategory");
      const description = formData.get("feedbackDetail");

      // TODO: Do better validation and type checking
      invariant(typeof title === "string");
      invariant(typeof category === "string");
      invariant(typeof description === "string");

      const errors: FormErrors = {};
      if (!title) {
        errors.title = "Can't be empty";
      }

      if (!category || !validCategories.includes(category)) {
        errors.category = "Please select a category";
      }

      if (!description) {
        errors.description = "Can't be empty";
      }

      if (Object.keys(errors).length) {
        const values = Object.fromEntries(formData) as Record<string, string>;

        return json<ActionData>({ errors, values }, { status: 400 });
      }

      const record = await createProductRequest(title, category, description);

      return redirect(`/feedback/view/${record.id}`);
    }
    default: {
      throw new Response("Invalid action", { status: 400 });
    }
  }
};

function FeedbackNew() {
  const navigate = useNavigate();
  const actionData = useActionData() as ActionData;
  const transition = useTransition();
  let category = "feature";

  if (actionData && "values" in actionData) {
    category = actionData.values.feedbackCategory;
  }

  const [categoryValue, setCategoryValue] = useState(category);

  const onCategoryOptionChange = (value: string) => {
    setCategoryValue(value);
  };

  const isNewFeedback =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "save";

  return (
    <>
      <header className="feedback-form-header" role="banner">
        <button
          className="button go-back-button"
          type="button"
          onClick={() => navigate(-1)}
        >
          <LeftArrowIcon aria-hidden="true" className="left-arrow-icon" />
          <span className="go-back-button__label">Go Back</span>
        </button>
      </header>
      <main role="main" className="feedback-form-container">
        <div className="feedback-form-image">
          <NewFeedbackIcon aria-hidden="true" className="feedback-form-icon" />
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
              className={`input ${
                actionData?.errors?.title ? "is-invalid" : null
              }`}
              aria-describedby="feedbackTitleHelpBlock"
              defaultValue={actionData?.values.feedbackTitle}
            />
            {actionData?.errors?.title ? (
              <div className="invalid-input">{actionData.errors.title}</div>
            ) : null}
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
              options={options}
              onOptionChange={onCategoryOptionChange}
            />
          </div>
          {actionData?.errors?.category ? (
            <div className="invalid-input">{actionData.errors.category}</div>
          ) : null}
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
              maxLength={250}
              className={`input ${
                actionData?.errors?.description ? "is-invalid" : null
              }`}
              aria-describedby="feedbackDetailHelpBlock"
              defaultValue={actionData?.values.feedbackDetail}
            />
            {actionData?.errors?.description ? (
              <div className="invalid-input">
                {actionData.errors.description}
              </div>
            ) : null}
          </div>
          <div className="form-control-group">
            <button
              type="submit"
              name="_action"
              value="save"
              className="button button-primary"
            >
              {isNewFeedback ? "Saving..." : "Add Feedback"}
            </button>
            <button
              type="submit"
              name="_action"
              value="cancel"
              className="button button-secondary"
            >
              Cancel
            </button>
          </div>
        </Form>
      </main>
    </>
  );
}

export default FeedbackNew;
