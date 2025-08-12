import { ComponentProps, ComponentUpdateProps } from "../types";

export default function Main(props: ComponentProps & ComponentUpdateProps) {
  return (
    <main
      style={props.styles}
      onClick={(e) => {
        props.onSelectForEdit?.(props.sequenceId);
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {props.children}
    </main>
  );
}
