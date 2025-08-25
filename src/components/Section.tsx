import React from "react";
import { ComponentRenderProps, ComponentUpdateProps } from "../types";

const Section: React.FC<ComponentRenderProps & ComponentUpdateProps> = (props) => {
  return (
    <section
      style={props.style}
      onClick={(e) => {
        if (props.isEditingMode) {
          props.onSelectForEdit?.(props.sequenceId);
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      {props.children}
    </section>
  );
};

export default Section;
