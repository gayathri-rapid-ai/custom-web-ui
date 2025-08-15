import React from "react";
import { Label } from "./Label";
import {
  ComponentProps,
  ComponentUpdateProps,
  FormComponentProps,
  HeaderComponentProps,
  InputComponentDataProps,
  LabelComponentDataProps,
  LabelComponentProps,
  LinkComponentDataProps,
  LinkComponentProps,
  NavBarComponentProps,
} from "../types";
import Header from "./Header";
import Navigation from "./NavBar";
import Footer from "./Footer";
import Form from "./SimpleForm";
import { Link } from "./Link";
import Main from "./Main";
import Section from "./Section";
import EditLayer from "./EditLayer";
import Input from "./Input";
import Div from "./Div";

type RenderComponentProps = ComponentProps & ComponentUpdateProps;

const RenderComponent: React.FC<RenderComponentProps> = (props) => {

  const newComponent = (index: number, child: ComponentProps) => {

    return (
      <RenderComponent
        key={index}
        {...child}
        sequenceId={props.sequenceId + index.toString() + "$"}
        onSelectForEdit={props.onSelectForEdit}
        onEditStyles={props.onEditStyles}
        isEditingMode={props.isEditingMode}
      />
    );
  };

  // Helper to render childs if present
  const renderchilds = () => {
    if (Array.isArray(props?.childs)) {
      return (
        <>
          {props.childs.map((child: ComponentProps, index: number) => {
            // If the child is in editing mode, wrap it in EditLayer
            if (child.isEditing) {
              return (
                <EditLayer
                  key={index}
                  {...child}
                  sequenceId={props.sequenceId + index.toString() + "$"}
                  onSelectForEdit={props.onSelectForEdit}
                  onEditStyles={props.onEditStyles}
                  isEditingMode={props.isEditingMode}
                >
                  {newComponent(index, child)}
                </EditLayer>
              );
            }
            return newComponent(index, child);
          })}
        </>
      );
    } else {
      return null;
    }
  };

  switch (props.name) {
    case "label":
      return (
        <Label
          {...props}
          data={(props.data ?? {}) as LabelComponentDataProps}
        />
      );
    case "header":
      return (
        <Header {...props} data={(props.data ?? {}) as LabelComponentDataProps}>
          {renderchilds()}
        </Header>
      );
    case "navbar":
      return <Navigation {...props}>{renderchilds()}</Navigation>;
    case "footer":
      return <Footer {...props}>{renderchilds()}</Footer>;
    case "form":
      return <Form {...props}>{renderchilds()}</Form>;
    case "link":
      return (
        <Link {...props} data={(props.data ?? {}) as LinkComponentDataProps} />
      );
    case "main":
      return <Main {...props}>{renderchilds()}</Main>;
    case "section":
      return <Section {...props}>{renderchilds()}</Section>;
    case "div":
      return <Div {...props}>{renderchilds()}</Div>;
    case "input":
      return (
        <Input
          {...props}
          data={(props.data ?? {}) as InputComponentDataProps}
        ></Input>
      );
    case "root":
      return <>{renderchilds()}</>;
    default:
      return <>{renderchilds()}</>;
  }
};

export default RenderComponent;
