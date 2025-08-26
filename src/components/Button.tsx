import { ButtonComponentProps, ComponentUpdateProps } from "../types";

export const Button: React.FC<ButtonComponentProps & ComponentUpdateProps> = (
  props
) => {
  return (
    <button
      style={props.style}
        onClick={(e) => {
          if (props.isEditingMode) {
            e.stopPropagation();
            props.onSelectForEdit?.(props.sequenceId);
          }
        }}
    >
      {props.data.label}
    </button>
  );
};
