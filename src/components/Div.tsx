import React from "react";
import { ComponentRenderProps, ComponentUpdateProps } from "../types";
import onClickComponent from "./Common";

const Div: React.FC<ComponentRenderProps & ComponentUpdateProps> = (props) => {

    const clickComponent = onClickComponent(props)

    return (
        <div
            style={props.style}
            onClick={clickComponent}
        >
            {props.children}
        </div>
    );
};

export default Div;