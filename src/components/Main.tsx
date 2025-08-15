import { ComponentProps, ComponentUpdateProps } from "../types";

export default function Main(props: ComponentProps & ComponentUpdateProps) {

  const { isEditingMode } = props

  return (
    <main
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
    </main>
  );
}
