import { ComponentProps } from "../types";

const componentDefaults = {
    "section": {
        name: "section",
        styles: {
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "16px",
            backgroundColor: "#f0f0f0",
        },
        childs: [],
        data: undefined,
        isEditing: false,
    }
} as Record<string, ComponentProps>;

export default componentDefaults;