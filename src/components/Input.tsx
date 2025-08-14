import React from "react";
import { ComponentUpdateProps, InputComponentProps } from "../types";
import { Label } from "./Label";

type InputProps = InputComponentProps &
  ComponentUpdateProps & {
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
    <div id={props.sequenceId} style={props.styles}>
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
    </div>
  );
};

export default Input;
