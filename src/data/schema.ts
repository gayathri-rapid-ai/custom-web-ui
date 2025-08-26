const schema = {
    "main": ["section"],
    "section": ["section", "label", "div"],
    "div": ["div", "label", "input", "input_with_label", "link", "button"]
} as Record<string, string[]>;

export default schema;