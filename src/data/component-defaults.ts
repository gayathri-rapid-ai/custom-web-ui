import {
  ComponentProps,
  InputComponentDataProps,
  InputComponentProps,
  LabelComponentProps,
  LinkComponentProps,
} from "../types";

const componentDefaults = {
  section: {
    name: "section",
    styles: {
      gap: "16px",
      padding: "16px",
      backgroundColor: "#f0f0f0",
      height: 50,
    },
    childs: [],
    data: undefined,
    isEditing: false,
  },
  label: {
    name: "label",
    data: {
      label: "New Label",
      url: "",
    },
    styles: {},
  } as LabelComponentProps,
  link: {
    name: "link",
    data: {
      label: "New Link",
      url: "",
    },
    styles: {},
  } as LinkComponentProps,
  input: {
    name: "input",
    styles: {},
    labelStyles: {},
    data: {
      inputType: "string",
      label: "New Input",
    },
  } as InputComponentProps,
  div: {
    name: "div",
    styles: {
      backgroundColor: "#fff",
      minWidth: "3rem",
      minHeight: "3rem",
    },
    data: {},
  } as ComponentProps,
  input_with_label: {
    name: "input_with_label",
    styles: {},
    childs: [
      {
        name: "link",
        data: {
          label: "Label",
          url: "",
        },
        styles: {},
      } as LinkComponentProps,
      {
        name: "input",
        styles: {},
        data: {
          inputType: "string",
          label: "New Input",
        },
      },
    ],
  },
} as Record<string, ComponentProps>;

export default componentDefaults;
