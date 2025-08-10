import React from "react";
import {
  ComponentProps,
  ComponentUpdateProps,
  HeaderComponentProps,
} from "../types";
import RenderComponent from ".";

const Header: React.FC<HeaderComponentProps & ComponentUpdateProps> = (
  props
) => {
  return (
    <header
      style={props.styles}
      onClick={(e) => {
        props.onSelectForEdit?.(props.sequenceId);
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {props.children}
    </header>
  );
};

export default Header;
