import { ComponentUpdateProps, LinkComponentProps } from "../types";

export const Link: React.FC<LinkComponentProps & ComponentUpdateProps> = (
  props
) => {
  return (
    <a
      style={props.style}
      href={props.data.url}
      onClick={(e) => {
        props.onSelectForEdit?.(props.sequenceId);
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {props.data.label}
    </a>
  );
};
