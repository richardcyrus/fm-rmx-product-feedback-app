import { useState } from "react";

import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { z } from "zod";

import LeftArrowIcon from "~/assets/shared/IconArrowLeft";
import EditFeedbackIcon from "~/assets/shared/IconEditFeedback";
import FeedbackFormListbox from "~/components/FeedbackFormListbox";
import {
  deleteProductRequest,
  getProductRequestById,
  updateProductRequest,
} from "~/models/productRequest.server";
import type {
  CategoryOptions,
  StatusOptions,
} from "~/models/productRequest.server";

import editFeedbackFormStylesUrl from "~/styles/feedback-form.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: editFeedbackFormStylesUrl }];
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

const FormDataValidator = z.object({
  feedbackId: z.string({
    required_error: "feedbackId is required",
    invalid_type_error: "feedbackId must be a string",
  }),
  title: z.string().min(1, { message: "Can't be empty" }),
  description: z
    .string()
    .min(1, { message: "Can't be empty" })
    .max(250, { message: "Too many characters" }),
  category: z.enum(["feature", "ui", "ux", "enhancement", "bug"]),
  status: z.enum(["suggestion", "planned", "in-progress", "live"]),
  _action: z.enum(["cancel", "delete", "save"]),
});

type FormDataErrors = z.inferFlattenedErrors<typeof FormDataValidator>;

type ActionData = {
  errors: FormDataErrors;
};

type LoaderData = Awaited<ReturnType<typeof getProductRequestById>>;

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData()) as Record<
    string,
    string
  >;

  const result = FormDataValidator.safeParse(formData);
  if (!result.success) {
    const errors: FormDataErrors = result.error.flatten();

    return json<ActionData>({ errors }, { status: 400 });
  }

  const actionType = result.data._action;

  const feedbackId = result.data.feedbackId;

  const productRequestId = parseInt(feedbackId, 10);

  switch (actionType) {
    case "cancel": {
      return redirect(`/feedback/view/${feedbackId}`);
    }
    case "delete": {
      await deleteProductRequest(productRequestId);

      return redirect("/");
    }
    case "save": {
      await updateProductRequest(
        productRequestId,
        result.data.title,
        result.data.category as CategoryOptions,
        result.data.status as StatusOptions,
        result.data.description
      );

      return redirect(`/feedback/view/${feedbackId}`);
    }
    default: {
      throw new Response("Invalid action", { status: 400 });
    }
  }
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, "Expected params.id");

  const feedbackId = parseInt(params.id, 10);

  const feedback = await getProductRequestById(feedbackId);
  return json<LoaderData>(feedback);
};

function FeedbackEdit() {
  const navigate = useNavigate();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData() as ActionData;

  const [categoryValue, setCategoryValue] = useState(data.category);
  const [statusValue, setStatusValue] = useState(data.status);

  const onCategoryOptionChange = (value: string) => {
    setCategoryValue(value);
  };

  const onStatusOptionChange = (value: string) => {
    setStatusValue(value);
  };

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
          <EditFeedbackIcon aria-hidden="true" className="feedback-form-icon" />
        </div>
        <h1 className="h1 feedback-form-title">
          Editing &lsquo;{data.title}&rsquo;
        </h1>
        <Form
          method="post"
          className="edit-feedback-form feedback-form"
          autoComplete="off"
        >
          <input type="hidden" name="feedbackId" value={data.id} />
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
              defaultValue={data.title}
              aria-invalid={
                actionData?.errors?.fieldErrors?.title ? true : undefined
              }
              aria-errormessage={
                actionData?.errors?.fieldErrors?.title
                  ? "title-error"
                  : undefined
              }
            />
            {actionData?.errors?.fieldErrors?.title &&
            actionData.errors.fieldErrors.title.length > 0 ? (
              <div id="title-error" className="invalid-input">
                {actionData.errors.fieldErrors.title}
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
              options={categoryOptions}
              onOptionChange={onCategoryOptionChange}
            />
            {actionData?.errors?.fieldErrors?.category &&
            actionData.errors.fieldErrors.category.length > 0 ? (
              <div className="invalid-input">
                {actionData.errors.fieldErrors.category}
              </div>
            ) : null}
          </div>
          <div className="form-control">
            <span className="form-label" id="status-label">
              Update Status
            </span>
            <div className="form-text" id="status-help-block">
              Change feedback state
            </div>
            <FeedbackFormListbox
              name="status"
              value={statusValue}
              labelledby="status-label"
              describedby="status-help-block"
              options={statusOptions}
              onOptionChange={onStatusOptionChange}
            />
            {actionData?.errors?.fieldErrors?.status &&
            actionData.errors.fieldErrors.status.length > 0 ? (
              <div className="invalid-input">
                {actionData.errors.fieldErrors.status}
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
              defaultValue={data.description}
              aria-invalid={
                actionData?.errors?.fieldErrors?.description ? true : undefined
              }
              aria-errormessage={
                actionData?.errors?.fieldErrors?.description
                  ? "description-error"
                  : undefined
              }
            />
            {actionData?.errors?.fieldErrors?.description &&
            actionData.errors.fieldErrors.description.length > 0 ? (
              <div id="description-error" className="invalid-input">
                {actionData.errors.fieldErrors.description}
              </div>
            ) : null}
          </div>
          <div className="form-control-group">
            <button
              type="submit"
              name="_action"
              value="delete"
              className="button button-danger"
            >
              Delete
            </button>
            <button
              type="submit"
              name="_action"
              value="save"
              className="button button-primary"
            >
              Save Changes
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

export default FeedbackEdit;
