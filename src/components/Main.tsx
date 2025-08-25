import { ComponentRenderProps, ComponentUpdateProps } from "../types";

export default function Main(props: ComponentRenderProps & ComponentUpdateProps) {

  const { isEditingMode } = props

  return (
    <main
      style={props.style}
      onClick={(e) => {
        if(isEditingMode) {
          props.onSelectForEdit?.(props.sequenceId);
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      {props.children}
    </main>
  );
}
