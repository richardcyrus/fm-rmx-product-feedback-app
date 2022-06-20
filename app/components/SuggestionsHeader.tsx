import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from "@reach/listbox";
import type { LinksFunction } from "@remix-run/node";

import ListboxArrowIcon from "~/assets/shared/IconArrowDown";
import SuggestionsIcon from "~/assets/suggestions/IconSuggestions";
import AddFeedbackButton from "~/components/AddFeedbackButton";
import componentCustomStyles from "~/styles/suggestions-header.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: componentCustomStyles }];
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

function SuggestionsHeader(props: ListHeaderProps) {
  return (
    <>
      <div className="suggestion-list__header">
        <div className="suggestions-count">
          <SuggestionsIcon aria-hidden="true" />
          <h2 className="h3">{props.count} Suggestions</h2>
        </div>
        <div className="filter-control">
          <span id="filter-label" className="filter-label">
            Sort by :
          </span>
          <ListboxInput
            name="sort"
            defaultValue={props.sortCriteria}
            value={props.sortCriteria}
            onChange={props.onSortOptionsChange}
            required={true}
          >
            <ListboxButton
              aria-labelledby="filter-label"
              arrow={<ListboxArrowIcon />}
            >
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

export default SuggestionsHeader;
