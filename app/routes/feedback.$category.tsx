import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";

import NoSuggestionsCard, {
  links as NoSuggestionsCardLinks,
} from "~/components/NoSuggestionsCard";
import type { SuggestionCardProps } from "~/components/SuggestionCard";
import SuggestionCard, {
  links as SuggestionCardLinks,
} from "~/components/SuggestionCard";
import SuggestionsHeader, {
  links as SuggestionsHeaderLinks,
} from "~/components/SuggestionsHeader";
import { getSortedProductRequestByCategory } from "~/models/productRequest.server";
import type { SortByOptions } from "~/models/productRequest.server";

type LoaderData = {
  sort: string;
  suggestionsData: Array<SuggestionCardProps>;
};

export const links: LinksFunction = () => [
  ...SuggestionsHeaderLinks(),
  ...SuggestionCardLinks(),
  ...NoSuggestionsCardLinks(),
];

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  let sort = url.searchParams.get("sort");

  if (!sort) {
    sort = "mostUpvotes";
  }

  invariant(params.category, "Expected params.category");

  const productRequests = await getSortedProductRequestByCategory(
    params.category,
    sort as SortByOptions
  );

  const suggestionsData = productRequests.map((productRequest) => ({
    comments: productRequest._count.comments,
    ...productRequest,
  }));

  return json<LoaderData>({ sort, suggestionsData });
};

function FilteredCategory() {
  const { sort, suggestionsData } = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const onSortOptionsChange = (value: string) => {
    submit({ sort: value }, { method: "get" });
  };

  const onSuggestionCardClick = (id: number) => {
    navigate(`/feedback/view/${id}`);
  };

  return (
    <>
      <Form id="sortForm" method="get">
        <SuggestionsHeader
          count={suggestionsData.length}
          sortCriteria={sort}
          onSortOptionsChange={onSortOptionsChange}
        />
      </Form>
      {suggestionsData.length > 0 ? (
        suggestionsData.map((suggestion) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <div
            className="suggestion-card-wrapper"
            key={suggestion.id}
            /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
            tabIndex={0}
            onClick={() => onSuggestionCardClick(suggestion.id)}
          >
            <SuggestionCard
              id={suggestion.id}
              title={suggestion.title}
              category={suggestion.category}
              upvotes={suggestion.upvotes}
              status={suggestion.status}
              description={suggestion.description}
              comments={suggestion.comments}
            />
          </div>
        ))
      ) : (
        <NoSuggestionsCard />
      )}
    </>
  );
}

export default FilteredCategory;
