const schema = {
    "main": ["section"],
    "section": ["section", "label", "link", "input"]
} as Record<string, string[]>;

export default schema;