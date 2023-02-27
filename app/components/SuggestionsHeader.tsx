import { Label as RadixLabel } from "@radix-ui/react-label";
import * as RadixSelect from "@radix-ui/react-select";
import type { LinksFunction } from "@remix-run/node";

import IconArrowDown from "~/assets/shared/IconArrowDown";
import IconCheck from "~/assets/shared/IconCheck";
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
          <RadixLabel htmlFor="sort" id="filter-label" className="filter-label">
            Sort by :
          </RadixLabel>
          <RadixSelect.Root
            name="sort"
            defaultValue={props.sortCriteria}
            value={props.sortCriteria}
            onValueChange={props.onSortOptionsChange}
            required={true}
          >
            <RadixSelect.Trigger
              aria-labelledby="filter-label"
              className="select-trigger"
            >
              <RadixSelect.Value>
                {options[props.sortCriteria]}
              </RadixSelect.Value>
              <RadixSelect.Icon className="select-arrow">
                <IconArrowDown />
              </RadixSelect.Icon>
            </RadixSelect.Trigger>
            <RadixSelect.Content className="select-content" position="popper">
              <RadixSelect.Viewport className="select-viewport">
                {Object.keys(options).map((option) => (
                  <RadixSelect.Item
                    className="select-option"
                    key={option}
                    value={option}
                  >
                    <RadixSelect.ItemText>
                      {options[option]}
                    </RadixSelect.ItemText>
                    <RadixSelect.ItemIndicator className="select-selected">
                      <IconCheck />
                    </RadixSelect.ItemIndicator>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
            </RadixSelect.Content>
          </RadixSelect.Root>
        </div>
        <AddFeedbackButton />
      </div>
    </>
  );
}

export default SuggestionsHeader;
