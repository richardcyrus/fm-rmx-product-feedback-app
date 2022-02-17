import NoSuggestionIcon from "~/assets/suggestions/IllustrationEmpty";
import AddFeedbackButton from "~/components/AddFeedbackButton";

export default function NoSuggestionsCard() {
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
