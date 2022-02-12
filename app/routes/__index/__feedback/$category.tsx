import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";

import NoSuggestionIcon from "~/assets/suggestions/IllustrationEmpty";
import AddFeedbackButton from "~/components/AddFeedbackButton";

export let loader: LoaderFunction = async ({ params }) => {
  console.log(params);
  return params.category;
};

export default function FilteredCategory() {
  let category = useLoaderData();

  return (
    <div className="no-feedback-container">
      <NoSuggestionIcon className="no-feedback-icon" />
      <h2 className="h1 no-feedback-title">There is no feedback yet.</h2>
      <p className="body1 no-feedback-text">
        Got a suggestion? Found a bug that needs to be squashed? We love hearing
        about new ideas to improve our app.
      </p>
      <AddFeedbackButton />
    </div>
  );
}
