import * as React from "react";
import { Form, useLoaderData, useNavigate, useSubmit } from "remix";
import type { LinksFunction, LoaderFunction } from "remix";
import invariant from "tiny-invariant";

import { db } from "~/utils/db.server";

import SuggestionCard, {
  links as SuggestionCardLinks,
  SuggestionCardProps,
} from "~/components/SuggestionCard";
import NoSuggestionsCard, {
  links as NoSuggestionsCardLinks,
} from "~/components/NoSuggestionsCard";
import SuggestionsHeader, {
  links as SuggestionsHeaderLinks,
} from "~/components/SuggestionsHeader";

type FeedbackDataQueryResult = {
  id: number;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  _count: Record<string, number>;
};

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

  let sortCriteria: any;
  let filter: any;
  let cat: string | unknown = null;

  if (!sort) {
    sort = "mostUpvotes";
  }

  invariant(params.category, "Expected params.category");
  if (params.category !== "all") {
    cat = params.category;
  }

  switch (sort) {
    case "mostUpvotes": {
      sortCriteria = { upvotes: "desc" };
      break;
    }
    case "leastUpvotes": {
      sortCriteria = { upvotes: "asc" };
      break;
    }
    case "mostComments": {
      sortCriteria = { comments: { _count: "desc" } };
      break;
    }
    case "leastComments": {
      sortCriteria = { comments: { _count: "asc" } };
      break;
    }
    default: {
      sortCriteria = { upvotes: "desc" };
    }
  }

  if (cat) {
    filter = {
      status: { equals: "suggestion" },
      category: { equals: cat, mode: "insensitive" },
    };
  } else {
    filter = { status: { equals: "suggestion" } };
  }

  const data = await db.productRequest.findMany({
    where: filter,
    orderBy: sortCriteria,
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  const queryData = data.map((item: FeedbackDataQueryResult) => {
    return {
      comments: item._count.comments,
      ...item,
    };
  });

  return { sort, suggestionsData: queryData };
};

export default function FilteredCategory() {
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
