import React from 'react';
import { ComponentProps, ComponentUpdateProps } from '../types';
import onClickComponent from './Common';


const Footer: React.FC<ComponentProps & ComponentUpdateProps> = (props) => {

    const clickComponent = onClickComponent(props)

    return (
        <footer style={props.styles} onClick={clickComponent}>
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </footer>
    );
};

export default Footer;