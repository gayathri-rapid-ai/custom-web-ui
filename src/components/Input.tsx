import React from "react";
import { ComponentProps, InputComponentProps } from "../types";

type InputProps = InputComponentProps &
  ComponentProps & {
    isEditing?: boolean;
  };

const Input: React.FC<InputProps> = (props) => {
  const { isEditingMode } = props;

  const inputProps = isEditingMode
    ? {
        readOnly: true,
        "aria-disabled": true,
      }
    : {};

  return (
      <input
        type={props.data.inputType}
        onClick={(e) => {
          if (isEditingMode) {
            e.stopPropagation();
            props.onSelectForEdit?.(props.sequenceId);
          }
        }}
        onChange={isEditingMode ? (e) => e.preventDefault() : undefined}
        {...inputProps}
      />
  );
};

export default Input;
