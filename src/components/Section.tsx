import React from "react";
import {
    ComponentProps,
  ComponentUpdateProps,
} from "../types";

const Section: React.FC<ComponentProps & ComponentUpdateProps> = (
  props
) => {
  return (
    <section
      style={props.styles}
      onClick={(e) => {
        props.onSelectForEdit?.(props.sequenceId);
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {props.children}
    </section>
  );
};

export default Section;
