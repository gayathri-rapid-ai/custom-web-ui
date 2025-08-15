const schema = {
    "main": ["section"],
    "section": ["section", "label", "link", "input", "div", "input_with_label"],
    "div": ["div", "input", "input_with_label"]
} as Record<string, string[]>;

export default schema;