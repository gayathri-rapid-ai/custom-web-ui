import {
  ComponentProps,
  ComponentRenderProps,
  InputComponentDataProps,
  InputComponentProps,
  LabelComponentProps,
  LinkComponentProps,
} from "../types";

const componentDefaults: Record<string, ComponentRenderProps> = {
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
  },
  label: {
    name: "label",
    styles: {},
    data: {
      label: "New Label",
    },
  } as LabelComponentProps,
  link: {
    name: "link",
    styles: {},
    data: {
      label: "New Link",
      url: "",
    },
  } as LinkComponentProps,
  input: {
    name: "input",
    styles: {},
    data: {
      label: "Field",
      inputType: "string",
      placeHolder: "Field name",
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
  } as ComponentRenderProps,
  input_with_label: {
    name: "input_with_label",
    styles: [{}, {}, {}],
    merge_childs: true,
    data: {
      label: "New Label",
      inputType: "string",
      placeHolder: "Field name",
    },
    childs: [
      {
        name: "label",
        styles: {},
        data: {
          label: "New Label",
        },
      } as LabelComponentProps,
     {
        name: "input",
        styles: {},
        data: {
          label: "Field",
          placeHolder: "Field name",
        },
      } as InputComponentProps,
    ] as ComponentProps[],
  },
};

export default componentDefaults;
