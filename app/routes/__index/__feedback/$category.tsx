import { Form, useLoaderData, useSubmit } from "remix";
import type { LinksFunction, LoaderFunction } from "remix";

import { db } from "~/utils/db.server";

import SuggestionCard from "~/components/SuggestionCard";
import NoSuggestionsCard from "~/components/NoSuggestionsCard";
import SuggestionListHeader, {
  links as SuggestionListHeaderLinks,
} from "~/components/SuggestionListHeader";

type QueryResult = {
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
  suggestionsData: QueryResult[];
};

export const links: LinksFunction = () => [...SuggestionListHeaderLinks()];

export let loader: LoaderFunction = async ({ params, request }) => {
  let url = new URL(request.url);
  let sort = url.searchParams.get("sort");

  let sortCriteria: any;
  let filter: any;
  let cat: string | unknown = null;

  if (!sort) {
    sort = "mostUpvotes";
  }

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

  const queryData = data.map((item: QueryResult) => {
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

  const onSortOptionsChange = (value: string) => {
    submit({ sort: value }, { method: "get" });
  };

  return (
    <>
      <Form id="sortForm" method="post" action=".">
        <SuggestionListHeader
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
            tabIndex={-1}
          >
            <SuggestionCard suggestion={suggestion} />
          </div>
        ))
      ) : (
        <NoSuggestionsCard />
      )}
    </>
  );
}
