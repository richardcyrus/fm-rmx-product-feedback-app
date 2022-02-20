import { useState } from "react";
import type { LinksFunction, ActionFunction } from "remix";
import { Prisma } from "@prisma/client";
import {
  Form,
  useNavigate,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import invariant from "tiny-invariant";

import { db } from "~/utils/db.server";

import FeedbackFormListbox, {
  links as FeedbackFormListboxLinks,
} from "~/components/FeedbackFormListbox";

import LeftArrowIcon from "~/assets/shared/IconArrowLeft";
import NewFeedbackIcon from "~/assets/shared/IconNewFeedback";

import newFeedbackFormStylesUrl from "~/styles/feedback-form.css";

const options: Record<string, string> = {
  feature: "Feature",
  ui: "UI",
  ux: "UX",
  enhancement: "Enhancement",
  bug: "Bug",
};

type NewFeedbackFormError = {
  title?: boolean;
  category?: boolean;
  description?: boolean;
};

type NewFeedback = {
  title: string;
  category: string;
  description: string;
};

export const links: LinksFunction = () => {
  return [
    ...FeedbackFormListboxLinks(),
    { rel: "stylesheet", href: newFeedbackFormStylesUrl },
  ];
};

async function saveFeedback(params: NewFeedback) {
  let productRequest: Prisma.ProductRequestCreateInput;

  productRequest = {
    title: params.title,
    category: params.category,
    upvotes: 0,
    status: "suggestion",
    description: params.description,
  };

  return db.productRequest.create({ data: productRequest });
}

// TODO: Improve data validation.
// TODO: Improve error handling.
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  if (formData.get("_action") === "cancel") {
    return redirect("/");
  }

  if (formData.get("_action") === "save") {
    const title = formData.get("feedbackTitle");
    const category = formData.get("feedbackCategory");
    const description = formData.get("feedbackDetail");

    const errors: NewFeedbackFormError = {};
    if (!title) errors.title = true;
    if (!category) errors.category = true;
    if (!description) errors.description = true;

    if (Object.keys(errors).length) {
      return errors;
    }

    invariant(typeof title === "string");
    invariant(typeof category === "string");
    invariant(typeof description === "string");

    const record = await saveFeedback({ title, category, description });

    return redirect(`/feedback/view/${record.id}`);
  }
};

export default function FeedbackNew() {
  const navigate = useNavigate();
  const errors = useActionData();
  const transition = useTransition();

  const [categoryValue, setCategoryValue] = useState("feature");

  const onCategoryOptionChange = (value: string) => {
    setCategoryValue(value);
  };

  const isNewFeedback =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "save";

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
              className={`input ${errors?.title ? "is-invalid" : null}`}
              aria-describedby="feedbackTitleHelpBlock"
            />
            {errors?.title ? (
              <div className="invalid-input">Can&rsquo;t be empty</div>
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
              className={`input ${errors?.description ? "is-invalid" : null}`}
              aria-describedby="feedbackDetailHelpBlock"
            />
            {errors?.description ? (
              <div className="invalid-input">Can&rsquo;t be empty</div>
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
      </div>
    </>
  );
}
