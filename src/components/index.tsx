import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction
} from "react";
import { Label } from "./Label";
import {
  ButtonComponentDataProps,
  ComponentProps,
  ComponentRenderProps,
  ComponentUpdateProps,
  InputComponentDataProps,
  LabelComponentDataProps,
  LinkComponentDataProps,
} from "../types";
import Header from "./Header";
import Navigation from "./NavBar";
import Footer from "./Footer";
import Form from "./SimpleForm";
import { Link } from "./Link";
import Main from "./Main";
import Section from "./Section";
import EditLayer from "../configure/EditLayer";
import { Input, InputWithLabel } from "./Input";
import Div from "./Div";
import { Button } from "./Button";

// --- HOVER CONTEXT to propagate hovered sequenceId through tree. ---
type HoverCtxType = {
  hoveredId: string | null;
  setHoveredId: Dispatch<SetStateAction<string | null>>;
};
const HoverContext = createContext<HoverCtxType | undefined>(undefined);

type RenderComponentRenderProps = ComponentRenderProps & ComponentUpdateProps;

interface HighlightWrapperProps {
  children: ReactNode;
  sequenceId: string;
  isEditingMode: boolean;
}

const HighlightWrapper: React.FC<HighlightWrapperProps> = ({ children, sequenceId, isEditingMode }) => {
  const hoverCtx = useContext(HoverContext);

  if (!hoverCtx || !isEditingMode) {
    // No highlight outside editing mode.
    return <>{children}</>;
  }

  const { hoveredId, setHoveredId } = hoverCtx;

  return (
    <div
      style={{
        transition: "box-shadow 0.15s, border 0.15s",
        border: hoveredId === sequenceId ? "2px solid #2196f3" : "2px solid transparent",
        borderRadius: "5px",
        boxShadow: hoveredId === sequenceId ? "0 0 7px 0 rgba(33,150,243, 0.18)" : undefined,
        position: "relative"
      }}
      onMouseEnter={e => {
        e.stopPropagation();
        setHoveredId(sequenceId);
      }}
      onMouseLeave={e => {
        e.stopPropagation();
        if (hoveredId === sequenceId) setHoveredId(null);
      }}
    >
      {children}
    </div>
  );
};

const RenderComponentInner: React.FC<RenderComponentRenderProps> = (props) => {
  // Children are recursively rendered, highlight only happens at parent (container) level.
  const newComponent = (index: number, child: ComponentRenderProps) => {
    const childSequenceId = (props.sequenceId ?? "") + index.toString() + "$";
    return (
      <RenderComponentInner
        key={childSequenceId}
        {...child}
        sequenceId={childSequenceId}
        onSelectForEdit={props.onSelectForEdit}
        onEditStyles={props.onEditStyles}
        isEditingMode={props.isEditingMode}
        style={Array.isArray(child.styles) ? child.styles[0] : child.styles}
      />
    );
  };

  const renderchildren = () => {
    if (Array.isArray(props?.childs) && !props.merge_childs) {
      return (
        <>
          {props.childs.map((child: ComponentProps, index: number) => newComponent(index, child))}
        </>
      );
    } else {
      return null;
    }
  };

  // Utility for wrapping a node with highlight, always by sequenceId and only at container level.
  const wrapWithHighlighter = (node: React.ReactNode) =>
    <HighlightWrapper sequenceId={props.sequenceId ?? ""} isEditingMode={props.isEditingMode}>{node}</HighlightWrapper>;

  // Only use EditLayer for 'section' or 'div' WHEN editing mode is enabled!
  if ((props.name === "section" || props.name === "div" || props.name === "main") && props.isEditingMode) {
    return wrapWithHighlighter(
      <EditLayer
        {...props}
        sequenceId={props.sequenceId}
        onSelectForEdit={props.onSelectForEdit}
        onEditStyles={props.onEditStyles}
        isEditingMode={props.isEditingMode}
      >
        {props.name === "section"
          ? <Section {...props}>{renderchildren()}</Section>
          : <Div {...props}>{renderchildren()}</Div>
        }
      </EditLayer>
    );
  }

  // Otherwise, just render and highlight the container.
  switch (props.name) {
    case "label":
      return wrapWithHighlighter(
        <Label
          {...props}
          data={(props.data ?? {}) as LabelComponentDataProps}
        />
      );
    case "header":
      return wrapWithHighlighter(
        <Header {...props} data={(props.data ?? {}) as LabelComponentDataProps}>
          {renderchildren()}
        </Header>
      );
    case "navbar":
      return wrapWithHighlighter(
        <Navigation {...props}>{renderchildren()}</Navigation>
      );
    case "footer":
      return wrapWithHighlighter(
        <Footer {...props}>{renderchildren()}</Footer>
      );
    case "form":
      return wrapWithHighlighter(
        <Form {...props}>{renderchildren()}</Form>
      );
    case "link":
      return wrapWithHighlighter(
        <Link {...props} data={(props.data ?? {}) as LinkComponentDataProps} />
      );
    case "main":
      return wrapWithHighlighter(
        <Main {...props}>{renderchildren()}</Main>
      );
    case "section":
      return wrapWithHighlighter(
        <Section {...props}>{renderchildren()}</Section>
      );
    case "div":
      return wrapWithHighlighter(
        <Div {...props}>{renderchildren()}</Div>
      );
    case "input":
      return wrapWithHighlighter(
        <Input
          {...props}
          data={(props.data ?? {}) as InputComponentDataProps}
        />
      );
    case "input_with_label":
      return wrapWithHighlighter(
        <InputWithLabel
          {...props}
          data={(props.data ?? {}) as InputComponentDataProps}
        />
      );
    case "button":
      return wrapWithHighlighter(
        <Button {...props} data={(props.data ?? {}) as ButtonComponentDataProps} />
      );
    case "root":
      return <>{renderchildren()}</>;
    default:
      return <>{renderchildren()}</>;
  }
};

const RenderComponent: React.FC<RenderComponentRenderProps> = (props) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return (
    <HoverContext.Provider value={{ hoveredId, setHoveredId }}>
      <RenderComponentInner {...props} />
    </HoverContext.Provider>
  );
};

export default RenderComponent;