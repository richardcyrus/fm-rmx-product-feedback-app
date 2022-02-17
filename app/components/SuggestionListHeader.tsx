import type { LinksFunction } from "remix";

import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from "@reach/listbox";

import listboxStyles from "@reach/listbox/styles.css";
import componentCustomStyles from "~/styles/suggestion-list-header.css";

import ListboxArrowIcon from "~/assets/shared/IconArrowDown";
import SuggestionsIcon from "~/assets/suggestions/IconSuggestions";

import AddFeedbackButton from "~/components/AddFeedbackButton";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: listboxStyles },
    { rel: "stylesheet", href: componentCustomStyles },
  ];
};

const options: Record<string, string> = {
  mostUpvotes: "Most Upvotes",
  leastUpvotes: "Least Upvotes",
  mostComments: "Most Comments",
  leastComments: "Least Comments",
};

type ListHeaderProps = {
  count: number;
  onSortOptionsChange: (value: string) => void;
  sortCriteria: string;
};

export default function SuggestionListHeader(props: ListHeaderProps) {
  return (
    <>
      <div className="suggestion-list__header">
        <div className="suggestions-count">
          <SuggestionsIcon />
          <h3 className="h3">{props.count} Suggestions</h3>
        </div>
        <div className="filter-control">
          <span id="filter-label" className="filter-label">
            Sort by :
          </span>
          <ListboxInput
            name="sort"
            aria-labelledby="filter-label"
            defaultValue={props.sortCriteria}
            value={props.sortCriteria}
            onChange={props.onSortOptionsChange}
            required={true}
          >
            <ListboxButton arrow={<ListboxArrowIcon />}>
              {options[props.sortCriteria]}
            </ListboxButton>
            <ListboxPopover>
              <ListboxList>
                {Object.keys(options).map((option) => (
                  <ListboxOption
                    key={option}
                    value={option}
                    label={options[option]}
                  >
                    {options[option]}
                  </ListboxOption>
                ))}
              </ListboxList>
            </ListboxPopover>
          </ListboxInput>
        </div>
        <AddFeedbackButton />
      </div>
    </>
  );
}
