import { SyntheticEvent } from "react";
import { ComponentProps, ComponentUpdateProps } from "../types";

const onClickComponent = (
  props: ComponentProps &
    ComponentUpdateProps & {
      onClick?: (e: SyntheticEvent) => any;
    }
) => {
  const { isEditingMode, sequenceId, onSelectForEdit, onClick } = props;

  return (e: SyntheticEvent) => {
    if (isEditingMode) {
      e.preventDefault()
      e.stopPropagation()
      onSelectForEdit?.(sequenceId);
    } else {
      onClick?.(e);
    }
  };
};

export default onClickComponent