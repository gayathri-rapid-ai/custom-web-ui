import React from "react";
import { ComponentProps, ComponentUpdateProps } from "../types";

const Div: React.FC<ComponentProps & ComponentUpdateProps> = (props) => {

    const { 
        isEditingMode
     } = props

    return (
        <div
        style={props.styles}
        onClick={(e) => {
            if(isEditingMode) {
                props.onSelectForEdit?.(props.sequenceId);
                e.stopPropagation();
                e.preventDefault();
            }
        }}
        >
            {props.children}
        </div>
    );
};

export default Div;
