import { ComponentUpdateProps, LabelComponentProps } from "../types";

export const Label = (props: LabelComponentProps & ComponentUpdateProps) => {
  return (
    <label
      onClick={(e) => {
        e.stopPropagation();
        props.onSelectForEdit?.(props.sequenceId);
      }}
    >
      {props.data.label}
    </label>
  );
};
