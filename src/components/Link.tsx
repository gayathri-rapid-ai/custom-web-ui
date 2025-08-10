import { ComponentUpdateProps, LinkComponentProps } from "../types";

export const Link: React.FC<LinkComponentProps & ComponentUpdateProps> = ({ data, styles, onChange, sequenceId }) => {

  console.info("Link component props:", data, styles, sequenceId);
  if (!data || !data.label || !data.url) {
    console.warn("Link component requires 'label' and 'url' in data.");
    return null;
  }


  const onLabelChange = () => {
    // Handle change event if needed
    // This could be used to trigger updates or other actions
    console.log(`Link changed: ${data.label} -> ${data.url}`);
    onChange?.(
      sequenceId || "", 
      {
        label: "Omkar",
        url: data.url,
      },
      styles)
  }

  setTimeout(() => {
    onLabelChange();
  }, 3000);

  return (
    <a style={styles} href={data.url}>{data.label}</a>
  );
};