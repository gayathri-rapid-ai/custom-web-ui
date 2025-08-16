import React, { useEffect, useState } from "react";
import { ComponentName, ComponentProps, DataProps } from "../types";
import schema from "../data/schema";
import { ReorderableList } from "./ReorderComponent";

const CSS_PROPERTIES = [
  "background",
  "backgroundColor",
  "border",
  "borderRadius",
  "boxShadow",
  "color",
  "display",
  "flex",
  "fontSize",
  "fontWeight",
  "height",
  "justifyContent",
  "lineHeight",
  "margin",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginTop",
  "maxHeight",
  "maxWidth",
  "minHeight",
  "minWidth",
  "opacity",
  "overflow",
  "padding",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "position",
  "textAlign",
  "textDecoration",
  "width",
  "zIndex",
];

// Type for EditComponent's props
export interface EditComponentRenderProps {
  name: string;
  data?: DataProps;
  childs?: ComponentProps[];
  styles?: React.CSSProperties;
  onDataChange?: (data: DataProps) => void;
  onStylesChange?: (styles: React.CSSProperties) => void;
  onChange?: (data: DataProps, styles: React.CSSProperties) => void;
  onSelectParent: () => void;
  onAddComponent?: (componentName: string) => void;
  onClose: () => void;
  onDeleteComponent?: () => void;
  onSelectChild?: (childId: string) => void;
  onReorderChild?: (newOrderChilds: ComponentProps[]) => void;
}

// Utility: set nested property value
function setNestedValue(obj: any, key: string, value: any) {
  return { ...obj, [key]: value };
}

// Utility: remove nested property
function removeNestedKey(obj: any, key: string) {
  const { [key]: _, ...rest } = obj;
  return rest;
}

// Utility: render key-value input fields for data props
function renderFormFields(
  data: any,
  onChange: (key: string, value: any) => void
) {
  return Object.entries(data || {}).map(([key, value]) => (
    <div key={key} style={{ marginBottom: 8 }}>
      <label>
        {key}:{" "}
        <input
          type="text"
          onChange={(e) => onChange(key, e.target.value)}
        />
      </label>
    </div>
  ));
}

// Utility: return supported children for given component
function getSupportedComponents(name: string): string[] {
  return schema?.[name] || [];
}

export function EditComponent({
  name,
  data = null,
  styles = {},
  childs,
  onDataChange,
  onStylesChange,
  onChange,
  onSelectParent,
  onAddComponent,
  onClose,
  onDeleteComponent,
  onSelectChild,
  onReorderChild,
}: EditComponentRenderProps) {
  // Local state
  const [showPanel, setShowPanel] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "data" | "styles" | "components" | "children"
  >("data");

  const [dataState, setDataState] = useState<DataProps>(data);
  const [stylesState, setStylesState] = useState(styles);
  const [newStyleKey, setNewStyleKey] = useState<string>("");
  const [newStyleValue, setNewStyleValue] = useState<string>("");
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  // Maintain local children state for reordering;
  // if the source of truth is higher in the tree, lift this state up and update via props.
  const [childsState, setChildsState] = useState<ComponentProps[]>(childs ?? []);

  // Keep state in sync with incoming data/props
  useEffect(() => setDataState(data), [data]);
  useEffect(() => setStylesState(styles), [styles]);

  // Keep children in sync
  useEffect(() => {
    setChildsState(childs ?? []);
  }, [childs]);

  // Data props handler
  const handleDataChange = (key: string, value: any) => {
    const updated = setNestedValue(dataState, key, value);
    setDataState(updated);
    onDataChange?.(updated);
    onChange?.(updated, stylesState);
  };

  // Styles handler
  const handleStylesChange = (key: string, value: any) => {
    const updated = setNestedValue(stylesState, key, value);
    setStylesState(updated);
    onStylesChange?.(updated);
    onChange?.(dataState, updated);
  };

  const handleAddStyle = () => {
    if (!newStyleKey) return;
    const updated = { ...stylesState, [newStyleKey]: newStyleValue };
    setStylesState(updated);
    onStylesChange?.(updated);
    onChange?.(dataState, updated);
    setNewStyleKey("");
    setNewStyleValue("");
  };

  const handleRemoveStyle = (key: string) => {
    const updated = removeNestedKey(stylesState, key);
    setStylesState(updated);
    onStylesChange?.(updated);
    onChange?.(dataState, updated);
  };

  const supportedComponents = getSupportedComponents(name);

  // Handle DND reordering of children
  const handleReorderChildren = (newOrder: ComponentProps[]) => {
    setChildsState(newOrder);
    onReorderChild?.(newOrder);
  };

  // Main UI
  return (
    <div
      style={{
        background: "#f7f7f7",
        borderLeft: "1px solid #ddd",
        padding: 24,
        right: 0,
        top: 0,
        height: "100vh",
        zIndex: 100,
        overflowY: "auto",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Edit Props</h3>
          {name && (
            <span
              style={{
                background: "#e0e0e0",
                color: "#333",
                fontSize: 13,
                padding: "2px 8px",
                borderRadius: 4,
                marginLeft: 4,
              }}
              title="Component tag"
            >
              {name}
            </span>
          )}
        </div>
        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              background: "#e0e0e0",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
              padding: "4px 12px"
            }}
            aria-label="Select parent element"
            onClick={onSelectParent}
            title="Select parent element"
          >
            ↑ Parent
          </button>
          <button
            style={{
              background: "transparent",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              marginLeft: 8,
            }}
            aria-label="Close edit panel"
            onClick={() => {
              setShowPanel(false);
              onClose();
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <button
          style={{
            marginRight: 8,
            padding: "6px 16px",
            background: activeTab === "data" ? "#e0e0e0" : "#fff",
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("data")}
        >
          Data
        </button>
        <button
          style={{
            marginRight: 8,
            padding: "6px 16px",
            background: activeTab === "styles" ? "#e0e0e0" : "#fff",
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("styles")}
        >
          Styles
        </button>
        {supportedComponents.length > 0 && (
          <button
            style={{
              marginRight: 8,
              padding: "6px 16px",
              background: activeTab === "components" ? "#e0e0e0" : "#fff",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => setActiveTab("components")}
          >
            Components
          </button>
        )}
        {childsState && childsState.length > 0 && (
          <button
            style={{
              marginRight: 8,
              padding: "6px 16px",
              background: activeTab === "children" ? "#e0e0e0" : "#fff",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => setActiveTab("children")}
          >
            Children
          </button>
        )}
        {onDeleteComponent && (
          <button
            style={{
              background: "#ffdddd",
              border: "1px solid #ffaaaa",
              borderRadius: 4,
              cursor: "pointer",
              padding: "4px 12px",
              marginLeft: 2,
              color: "#a00",
            }}
            onClick={onDeleteComponent}
            title="Delete this component"
          >
            Delete
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div>
        {/* Data Tab */}
        {activeTab === "data" && renderFormFields(dataState, handleDataChange)}

        {/* Styles Tab */}
        {activeTab === "styles" && (
          <div>
            {Object.entries(stylesState).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <label style={{ flex: 1 }}>
                  {key}:{" "}
                  <input
                    type="text"
                    value={value ?? ""}
                    onChange={(e) => handleStylesChange(key, e.target.value)}
                  />
                </label>
                <button
                  style={{
                    marginLeft: 8,
                    background: "#ffdddd",
                    border: "1px solid #ffaaaa",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  onClick={() => handleRemoveStyle(key)}
                  title="Remove style"
                >
                  ×
                </button>
              </div>
            ))}
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <input
                list="css-properties"
                type="text"
                placeholder="Style key"
                value={newStyleKey}
                onChange={(e) => setNewStyleKey(e.target.value)}
                style={{ width: "30%" }}
              />
              <datalist id="css-properties">
                {CSS_PROPERTIES.map((prop) => (
                  <option key={prop} value={prop} />
                ))}
              </datalist>
              <input
                type="text"
                placeholder="Style value"
                value={newStyleValue}
                onChange={(e) => setNewStyleValue(e.target.value)}
                style={{ width: "30%" }}
              />
              <button
                onClick={handleAddStyle}
                style={{
                  padding: "4px 12px",
                  background: "#e0ffe0",
                  border: "1px solid #aaffaa",
                  borderRadius: 4,
                  cursor: "pointer",
                  minWidth: "30%",
                }}
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Components Tab */}
        {activeTab === "components" && supportedComponents.length > 0 && (
          <div style={{ color: "#444", padding: "16px 0" }}>
            <div style={{ marginBottom: 8, fontWeight: "bold" }}>
              Add Components:
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {supportedComponents.map((comp) => (
                <li
                  key={comp}
                  style={{
                    padding: "6px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {comp}
                  <button
                    style={{
                      background: "#e0ffe0",
                      border: "1px solid #b0ebb0",
                      borderRadius: "50%",
                      width: 28,
                      height: 28,
                      fontSize: 20,
                      lineHeight: "1",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title={`Add "${comp}"`}
                    onClick={() =>{
                      setSelectedComponent(comp)
                      onAddComponent?.(comp)
                    }}
                  >
                    ＋
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Children Tab */}
        {activeTab === "children" && (
          <div style={{ padding: "16px 0" }}>
            <div style={{ marginBottom: 8, fontWeight: "bold" }}>
              Child Components:
            </div>
            {(!childsState || childsState.length === 0) ? (
              <div style={{ color: "#888" }}>No children.</div>
            ) : (
              <ReorderableList
                items={childsState}
                onReorder={handleReorderChildren}
                onSelectChild={onSelectChild}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EditComponent;