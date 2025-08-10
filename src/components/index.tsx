import React from 'react';
import { Label } from './Label';
import { ComponentProps, ComponentUpdateProps, FormComponentProps, HeaderComponentProps, LabelComponentDataProps, LabelComponentProps, LinkComponentDataProps, LinkComponentProps, NavBarComponentProps } from '../types';
import Header from './Header';
import Navigation from './NavBar';
import Footer from './Footer';
import Form from './SimpleForm';
import { Link } from './Link';

type RenderComponentProps = ComponentProps & ComponentUpdateProps ;

const RenderComponent: React.FC<RenderComponentProps> = (props) => {
    // Helper to render childs if present
    const renderchilds = () => {
        if (Array.isArray(props?.childs)) {
            console.info("Rendering childs for component:", props.name, props.childs);
            return (
                <>
                    {props.childs.map((child, index) => (
                        <RenderComponent
                            key={index}
                            {...child}
                            sequenceId={props.sequenceId + index.toString() + "$"}
                            onChange={props.onChange}
                        />
                    ))}
                </>
            );
        } else {
            return null
        }
    };

    switch (props.name) {
        case 'label':
            return <Label {...props} data={(props.data ?? {}) as LabelComponentDataProps} />;
        case 'header':
            return (
                <Header {...props} data={(props.data ?? {}) as LabelComponentDataProps}>
                    {renderchilds()}
                </Header>
            );
        case 'navbar':
            return (
                <Navigation {...props}>
                    {renderchilds()}
                </Navigation>
            );
        case 'footer':
            return (
                <Footer {...props}>
                    {renderchilds()}
                </Footer>
            );
        case 'form':
            return (
                <Form {...props}>
                    {renderchilds()}
                </Form>
            );
        case 'link':
            return <Link {...props} data={(props.data ?? {}) as LinkComponentDataProps} />;
        case 'root':
            return <>{renderchilds()}</>
        default:
            return <>{renderchilds()}</>;
    }
};

export default RenderComponent;