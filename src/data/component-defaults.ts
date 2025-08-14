import { ComponentProps, InputComponentDataProps, InputComponentProps, LabelComponentProps, LinkComponentProps } from "../types";

const componentDefaults = {
    "section": {
        name: "section",
        styles: {
            gap: "16px",
            padding: "16px",
            backgroundColor: "#f0f0f0",
            height: 50
        },
        childs: [],
        data: undefined,
        isEditing: false,
    },
    "label": {
        name: "label",
        data: {
            label: "New Label",
            url: ""
        },
        styles: {}
    } as LabelComponentProps,
    "link": {
        name: "link",
        data: {
            label: "New Link",
            url: ""
        },
        styles: {}
    } as LinkComponentProps,
    "input": {
        name: "input",
        styles: {},
        data: {
            inputType: "string",
            label: "New Input",
        }
    } as InputComponentProps
} as Record<string, ComponentProps>;

export default componentDefaults;