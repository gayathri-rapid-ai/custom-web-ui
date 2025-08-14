import { ComponentProps } from "../types";

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
    }
} as Record<string, ComponentProps>;

export default componentDefaults;