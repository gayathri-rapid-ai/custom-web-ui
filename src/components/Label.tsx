import { ComponentUpdateProps, LabelComponentProps } from "../types";
import onClickComponent from "./Common";

export const Label = (props: LabelComponentProps & ComponentUpdateProps) => {

  const onClick = onClickComponent(props)

  return (
    <label
      style={props.styles}
      onClick={onClick}
    >
      {props.data.label}
    </label>
  );
};
