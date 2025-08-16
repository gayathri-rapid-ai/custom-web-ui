import React, { useState, createContext, useContext, ReactNode, Dispatch, SetStateAction } from "react";
import { Label } from "./Label";
import {
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
import Input from "./Input";
import Div from "./Div";

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
}

/**
 * Only highlights if its sequenceId matches currently hovered one in context.
 * On mouse enter/leave, updates HoverContext.
 */
const HighlightWrapper: React.FC<HighlightWrapperProps> = ({ children, sequenceId }) => {
  const hoverCtx = useContext(HoverContext);

  if (!hoverCtx) {
    // Should never happen as we always provide the context, but fallback to no highlight.
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
        // Prevent accidental parent override if already inside child.
        e.stopPropagation();
        setHoveredId(sequenceId);
      }}
      onMouseLeave={e => {
        // Only clear if we're the currently hovered
        e.stopPropagation();
        if (hoveredId === sequenceId) setHoveredId(null);
      }}
    >
      {children}
    </div>
  );
};

const RenderComponentInner: React.FC<RenderComponentRenderProps> = (props) => {
  const newComponent = (index: number, child: ComponentRenderProps) => {
    const sequenceId = (props.sequenceId ?? "") + index.toString() + "$";
    const content = (
      <RenderComponentInner
        key={sequenceId}
        {...child}
        sequenceId={sequenceId}
        onSelectForEdit={props.onSelectForEdit}
        onEditStyles={props.onEditStyles}
        isEditingMode={props.isEditingMode}
      />
    );
    return <HighlightWrapper key={sequenceId} sequenceId={sequenceId}>{content}</HighlightWrapper>;
  };

  const renderchilds = () => {
    if (Array.isArray(props?.childs)) {
      return (
        <>
          {props.childs.map((child: ComponentProps, index: number) => newComponent(index, child))}
        </>
      );
    } else {
      return null;
    }
  };

  // Root/leaf highlighting: always by sequenceId
  const wrapWithHighlighter = (node: React.ReactNode) =>
    <HighlightWrapper sequenceId={props.sequenceId ?? ""}>{node}</HighlightWrapper>;

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
          {renderchilds()}
        </Header>
      );
    case "navbar":
      return wrapWithHighlighter(
        <Navigation {...props}>{renderchilds()}</Navigation>
      );
    case "footer":
      return wrapWithHighlighter(
        <Footer {...props}>{renderchilds()}</Footer>
      );
    case "form":
      return wrapWithHighlighter(
        <Form {...props}>{renderchilds()}</Form>
      );
    case "link":
      return wrapWithHighlighter(
        <Link {...props} data={(props.data ?? {}) as LinkComponentDataProps} />
      );
    case "main":
      return wrapWithHighlighter(
        <Main {...props}>{renderchilds()}</Main>
      );
    case "section":
      return wrapWithHighlighter(
        <Section {...props}>{renderchilds()}</Section>
      );
    case "div":
      return wrapWithHighlighter(
        <Div {...props}>{renderchilds()}</Div>
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
        <div>{renderchilds()}</div>
      );
    case "root":
      return <>{renderchilds()}</>;
    default:
      return <>{renderchilds()}</>;
  }
};

// The exported wrapper will provide the hover context for all children.
const RenderComponent: React.FC<RenderComponentRenderProps> = (props) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return (
    <HoverContext.Provider value={{ hoveredId, setHoveredId }}>
      <RenderComponentInner {...props} />
    </HoverContext.Provider>
  );
};

export default RenderComponent;