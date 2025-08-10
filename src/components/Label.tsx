import { ComponentUpdateProps, LabelComponentProps } from "../types";

export const Label= ({ sequenceId, data, styles, onChange }: LabelComponentProps & ComponentUpdateProps) => {

  const onLabelChange = () => {
    // Handle change event if needed
    // This could be used to trigger updates or other actions
    console.log(`Label changed: ${data.label}`);
    if(onChange){
      onChange(
        sequenceId  || "", 
        {
          label: data.label,
        }, 
        styles
      );
    }
  }

  setTimeout(() => {
    onLabelChange();
  }, 3000)

  return (
    <label onChange={onLabelChange}>{data.label}</label>
  )
};

