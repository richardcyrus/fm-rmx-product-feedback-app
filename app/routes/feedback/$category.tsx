import * as React from "react";

import { Form, useLoaderData, useNavigate, useSubmit } from "remix";
import type { LinksFunction, LoaderFunction } from "remix";
import invariant from "tiny-invariant";

import NoSuggestionsCard, {
  links as NoSuggestionsCardLinks,
} from "~/components/NoSuggestionsCard";
import SuggestionCard, {
  links as SuggestionCardLinks,
  SuggestionCardProps,
} from "~/components/SuggestionCard";
import SuggestionsHeader, {
  links as SuggestionsHeaderLinks,
} from "~/components/SuggestionsHeader";
import { getSortedProductRequestByCategory } from "~/models/productRequest.server";
import type { SortByOptions } from "~/models/productRequest.server";

type LoaderData = {
  sort: string;
  suggestionsData: SuggestionCardProps[];
};

export const links: LinksFunction = () => [
  ...SuggestionsHeaderLinks(),
  ...SuggestionCardLinks(),
  ...NoSuggestionsCardLinks(),
];

export const loader: LoaderFunction = async ({ params, request }) => {
  let url = new URL(request.url);
  let sort = url.searchParams.get("sort");

  if (!sort) {
    sort = "mostUpvotes";
  }

  invariant(params.category, "Expected params.category");

  const suggestionsData = await getSortedProductRequestByCategory(
    params.category,
    sort as SortByOptions
  );

  return { sort, suggestionsData };
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

  const onSuggestionCardKeypress = (
    id: number,
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    // Handle <Enter> or <Space>
    if (event.key === "Enter" || event.key === " ") {
      navigate(`/feedback/view/${id}`);
    }
  };

  return (
    <>
      <Form id="sortForm" method="post" action=".">
        <SuggestionsHeader
          count={suggestionsData.length}
          sortCriteria={sort}
          onSortOptionsChange={onSortOptionsChange}
        />
      </Form>
      {suggestionsData.length > 0 ? (
        suggestionsData.map((suggestion) => (
          <div
            className="suggestion-card-wrapper"
            key={suggestion.id}
            role="button"
            tabIndex={0}
            onClick={() => onSuggestionCardClick(suggestion.id)}
            onKeyDown={(e) => onSuggestionCardKeypress(suggestion.id, e)}
          >
            <SuggestionCard {...suggestion} />
          </div>
        ))
      ) : (
        <NoSuggestionsCard />
      )}
    </>
  );
}

export default FilteredCategory;
