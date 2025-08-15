import { SyntheticEvent } from "react";
import { ComponentProps } from "../types";

const onClickComponent = (
  props: ComponentProps & {
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