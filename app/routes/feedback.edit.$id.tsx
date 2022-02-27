import { useState } from "react";
import type { LinksFunction, LoaderFunction, ActionFunction } from "remix";
import {
  Form,
  useNavigate,
  useLoaderData,
  useActionData,
  redirect,
  json,
} from "remix";
import invariant from "tiny-invariant";
import type { ProductRequest } from "@prisma/client";

import LeftArrowIcon from "~/assets/shared/IconArrowLeft";
import EditFeedbackIcon from "~/assets/shared/IconEditFeedback";

import FeedbackFormListbox, {
  links as FeedbackFormListboxLinks,
} from "~/components/FeedbackFormListbox";
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
  return [
    ...FeedbackFormListboxLinks(),
    { rel: "stylesheet", href: editFeedbackFormStylesUrl },
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

interface ActionData {
  title?: string;
  category?: string;
  status?: string;
  description?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const feedbackId = formData.get("feedbackId");
  const actionType = formData.get("_action");

  if (typeof feedbackId !== "string") {
    throw new Response("feedbackId must be a string", { status: 400 });
  }
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
      const title = formData.get("feedbackTitle");
      const category = formData.get("feedbackCategory");
      const status = formData.get("feedbackStatus");
      const description = formData.get("feedbackDetail");

      invariant(typeof title === "string");
      invariant(typeof category === "string");
      invariant(typeof status === "string");
      invariant(typeof description === "string");

      let errors: ActionData = {};

      if (title.length === 0) {
        errors.title = "Can&rsquo;t be empty";
      }

      if (description.length === 0) {
        errors.description = "Can&rsquo;t be empty";
      }
      if (description.length > 250) {
        errors.description = "Too many characters";
      }

      if (!categoryOptions.hasOwnProperty(category)) {
        errors.category = "Invalid category option";
      }

      if (!statusOptions.hasOwnProperty(status)) {
        errors.status = "Invalid status option";
      }

      if (Object.keys(errors).length) {
        return json({ errors }, { status: 400 });
      }

      await updateProductRequest(
        productRequestId,
        title,
        category as CategoryOptions,
        status as StatusOptions,
        description
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
  return json(feedback);
};

function FeedbackEdit() {
  const navigate = useNavigate();
  const data = useLoaderData<ProductRequest>();
  const errors = useActionData<ActionData>();

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
          Editing &lsquo;{data.title}&rsquo;
        </h1>
        <Form
          method="post"
          className="edit-feedback-form feedback-form"
          autoComplete="off"
        >
          <input type="hidden" name="feedbackId" value={data.id} />
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
              defaultValue={data.title}
              aria-invalid={errors?.title ? true : undefined}
              aria-errormessage={errors?.title ? "title-error" : undefined}
            />
            {errors?.title && errors.title.length > 0 ? (
              <div id="title-error" className="invalid-input">
                {errors.title}
              </div>
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
              options={categoryOptions}
              onOptionChange={onCategoryOptionChange}
            />
            {errors?.category && errors.category.length > 0 ? (
              <div className="invalid-input">{errors.category}</div>
            ) : null}
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
            {errors?.status && errors.status.length > 0 ? (
              <div className="invalid-input">{errors.status}</div>
            ) : null}
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
              defaultValue={data.description}
              aria-invalid={errors?.description ? true : undefined}
              aria-errormessage={
                errors?.description ? "description-error" : undefined
              }
            />
            {errors?.description && errors.description.length > 0 ? (
              <div id="description-error" className="invalid-input">
                {errors.description}
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
      </div>
    </>
  );
}

export default FeedbackEdit;
