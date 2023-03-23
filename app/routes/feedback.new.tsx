import { useState } from "react";

import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import { z } from "zod";

import LeftArrowIcon from "~/assets/shared/IconArrowLeft";
import NewFeedbackIcon from "~/assets/shared/IconNewFeedback";
import FeedbackFormListbox from "~/components/FeedbackFormListbox";
import { createProductRequest } from "~/models/productRequest.server";
import newFeedbackFormStylesUrl from "~/styles/feedback-form.css";

const options: Record<string, string> = {
  feature: "Feature",
  ui: "UI",
  ux: "UX",
  enhancement: "Enhancement",
  bug: "Bug",
};

const FormDataValidator = z.object({
  title: z.string().min(1, { message: "Can't be empty" }),
  description: z
    .string()
    .min(1, { message: "Can't be empty" })
    .max(250, { message: "Too many characters" }),
  category: z.enum(["feature", "ui", "ux", "enhancement", "bug"]),
  _action: z.enum(["cancel", "save"]),
});

type FormDataErrors = z.inferFlattenedErrors<typeof FormDataValidator>;
type FormData = z.TypeOf<typeof FormDataValidator>;

type ActionData = {
  errors: FormDataErrors;
  formData: FormData;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: newFeedbackFormStylesUrl }];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData()) as FormData;

  const actionType = formData._action;

  switch (actionType) {
    case "cancel": {
      return redirect("/");
    }
    case "save": {
      const result = FormDataValidator.safeParse(formData);
      if (!result.success) {
        const errors: FormDataErrors = result.error.flatten();

        return json<ActionData>({ errors, formData }, { status: 400 });
      }

      const record = await createProductRequest(
        result.data.title,
        result.data.category,
        result.data.description
      );

      if (!record) {
        throw new Response("An error occurred saving the new request.", {
          status: 400,
        });
      }

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

  if (actionData && "formData" in actionData) {
    category = actionData.formData.category;
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
            <label htmlFor="title" className="form-label">
              Feedback Title
            </label>
            <div id="title-help-block">Add a short, descriptive headline</div>
            <input
              type="text"
              name="title"
              id="title"
              className={`input ${
                actionData?.errors?.fieldErrors?.title ? "is-invalid" : ""
              }`}
              aria-describedby="title-help-block"
              defaultValue={actionData?.formData?.title}
              aria-invalid={
                actionData?.errors?.fieldErrors?.title ? true : undefined
              }
              aria-errormessage={
                actionData?.errors?.fieldErrors?.title
                  ? "title-error"
                  : undefined
              }
            />
            {actionData?.errors?.fieldErrors?.title ? (
              <div
                role="alert"
                aria-live="polite"
                id="title-error"
                className="invalid-input"
              >
                {actionData.errors.fieldErrors.title[0]}
              </div>
            ) : null}
          </div>
          <div className="form-control">
            <span className="form-label" id="category-label">
              Category
            </span>
            <div className="form-text" id="category-help-block">
              Choose a category for your feedback
            </div>
            <FeedbackFormListbox
              name="category"
              value={categoryValue}
              labelledby="category-label"
              describedby="category-help-block"
              options={options}
              onOptionChange={onCategoryOptionChange}
            />
            {actionData?.errors?.fieldErrors?.category ? (
              <div role="alert" aria-live="polite" className="invalid-input">
                {actionData.errors.fieldErrors.category[0]}
              </div>
            ) : null}
          </div>
          <div className="form-control">
            <label htmlFor="description" className="form-label">
              Feedback Detail
            </label>
            <div className="form-text" id="description-help-block">
              Include any specific comments on what should be improved, added,
              etc.
            </div>
            <textarea
              name="description"
              id="description"
              cols={30}
              rows={4}
              maxLength={250}
              className={`input ${
                actionData?.errors?.fieldErrors?.description ? "is-invalid" : ""
              }`}
              aria-describedby="description-help-block"
              defaultValue={actionData?.formData?.description}
              aria-invalid={
                actionData?.errors?.fieldErrors?.description ? true : undefined
              }
              aria-errormessage={
                actionData?.errors?.fieldErrors?.description
                  ? "description-error"
                  : undefined
              }
            />
            {actionData?.errors?.fieldErrors?.description ? (
              <div
                role="alert"
                aria-live="polite"
                id="description-error"
                className="invalid-input"
              >
                {actionData.errors.fieldErrors.description[0]}
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
