import React, { Children } from "react";
import {
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
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          gap: "24px",
          alignItems: "center",
          ...props.styles,
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
