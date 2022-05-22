import {
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from "@reach/listbox";
import listboxStyles from "@reach/listbox/styles.css";
import type { LinksFunction } from "@remix-run/node";

import ListboxArrowIcon from "~/assets/shared/IconArrowDown";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: listboxStyles }];
};

type ListboxProps = {
  name: string;
  value: string;
  labelledby: string;
  describedby: string;
  required?: boolean;
  options: Record<string, string>;
  onOptionChange: (value: string) => void;
};

function FeedbackFormListbox(props: ListboxProps) {
  return (
    <>
      <ListboxInput
        name={props.name}
        defaultValue={props.value}
        required={props.required || false}
        onChange={props.onOptionChange}
      >
        <ListboxButton
          arrow={<ListboxArrowIcon />}
          aria-labelledby={props.labelledby}
          aria-describedby={props.describedby}
        >
          {props.options[props.value]}
        </ListboxButton>
        <ListboxPopover className="feedback-form-popover">
          <ListboxList>
            {Object.keys(props.options).map((option) => (
              <ListboxOption
                key={option}
                value={option}
                label={props.options[option]}
              >
                {props.options[option]}
              </ListboxOption>
            ))}
          </ListboxList>
        </ListboxPopover>
      </ListboxInput>
    </>
  );
}

export default FeedbackFormListbox;
