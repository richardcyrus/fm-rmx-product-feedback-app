import * as RadixSelect from "@radix-ui/react-select";

import IconArrowDown from "~/assets/shared/IconArrowDown";
import IconCheck from "~/assets/shared/IconCheck";

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
      <RadixSelect.Root
        name={props.name}
        defaultValue={props.value}
        required={props.required || false}
        onValueChange={props.onOptionChange}
      >
        <RadixSelect.Trigger
          aria-labelledby={props.labelledby}
          aria-describedby={props.describedby}
          className="select-trigger"
        >
          <RadixSelect.Value>{props.options[props.value]}</RadixSelect.Value>
          <RadixSelect.Icon className="select-arrow">
            <IconArrowDown />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Content
          position="popper"
          className="feedback-form-popover"
        >
          <RadixSelect.Viewport>
            {Object.keys(props.options).map((option) => (
              <RadixSelect.Item
                className="select-option"
                key={option}
                value={option}
              >
                <RadixSelect.ItemText>
                  {props.options[option]}
                </RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="select-selected">
                  <IconCheck />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Root>
    </>
  );
}

export default FeedbackFormListbox;
