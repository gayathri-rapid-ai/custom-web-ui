const schema = {
    "main": ["section"],
    "section": ["section", "label", "link", "input", "div"],
    "div": ["input"]
} as Record<string, string[]>;

export default schema;