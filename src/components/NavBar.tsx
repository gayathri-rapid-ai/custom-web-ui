import React, { Children } from "react";
import RenderComponent from ".";
import {
  ComponentProps,
  ComponentUpdateProps,
  NavBarComponentProps,
} from "../types";

const NavBar: React.FC<NavBarComponentProps & ComponentUpdateProps> = (
  props
) => {
  return (
    <nav
      onClick={(e) => {
        props.onSelectForEdit?.(props.sequenceId);
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <ul
        style={{
          ...props.styles,
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          gap: "24px",
          alignItems: "center",
        }}
        onClick={(e) => {
          props.onSelectForEdit?.(props.sequenceId);
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {props.children}
      </ul>
    </nav>
  );
};

export default NavBar;
