import React from "react";
import { ComponentProps, InputComponentDataProps, InputComponentProps, LabelComponentDataProps } from "../types";
import { Label } from "./Label";

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
        style={props.style}
      />
  );
};

const InputWithLabel: React.FC<InputProps> = (props) => {
  const { childs, isEditingMode, sequenceId, onSelectForEdit, data } = props;
  const styles = Array.isArray(props.styles) ? props.styles : [{} , {}];
  console.info("InputWithLabel props:", props);

  return (
    <div
      className="input-with-label"
      onClick={(e) => {
        if (isEditingMode) {
          e.stopPropagation();
          onSelectForEdit?.(sequenceId);
        }
      }}
      style={styles[0]}
    >
      <Label {...props} data={data as LabelComponentDataProps} style={styles[1]}/>
      <Input {...props} data={data as InputComponentDataProps} style={styles[2]}/>
    </div>
  );
}   

export { Input, InputWithLabel };
