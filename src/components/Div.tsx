import React from "react";
import { ComponentProps, ComponentUpdateProps } from "../types";
import onClickComponent from "./Common";

const Div: React.FC<ComponentProps & ComponentUpdateProps> = (props) => {

    const clickComponent = onClickComponent(props)
    return (
        <div
            style={props.styles}
            onClick={clickComponent}
        >
            {props.children}
        </div>
    );
};

export default Div;
