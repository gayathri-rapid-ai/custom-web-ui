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

  const { isEditingMode } = props

  return (
    <nav
      onClick={(e) => {
        if(isEditingMode) {
          props.onSelectForEdit?.(props.sequenceId);
          e.stopPropagation();
          e.preventDefault();
        }
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
          if(isEditingMode) {
            props.onSelectForEdit?.(props.sequenceId);
            e.stopPropagation();
            e.preventDefault();
          }
        }}
      >
        {props.children}
      </ul>
    </nav>
  );
};

export default NavBar;
