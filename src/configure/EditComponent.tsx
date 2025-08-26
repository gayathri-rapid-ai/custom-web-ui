import React, { useEffect, useState } from "react";
import { ComponentName, ComponentProps, DataProps } from "../types";
import schema from "../data/schema";
import { ReorderableList } from "./ReorderComponent";

const CSS_PROPERTIES = [
  "background", "backgroundColor", "border", "borderRadius", "boxShadow",
  "color", "display", "flex", "fontSize", "fontWeight", "height", "justifyContent",
  "lineHeight", "margin", "marginBottom", "marginLeft", "marginRight", "marginTop",
  "maxHeight", "maxWidth", "minHeight", "minWidth", "opacity", "overflow", "padding",
  "paddingBottom", "paddingLeft", "paddingRight", "paddingTop", "position", "textAlign",
  "textDecoration", "width", "zIndex",
];

export interface EditComponentRenderProps {
  name: string;
  data?: DataProps;
  childs?: ComponentProps[];
  styles: React.CSSProperties | React.CSSProperties[];
  onDataChange?: (data: DataProps) => void;
  onStylesChange?: (
    styles: React.CSSProperties | React.CSSProperties[]
  ) => void;
  onSelectParent: () => void;
  onAddComponent?: (componentName: string) => void;
  onClose: () => void;
  onDeleteComponent?: () => void;
  onSelectChild?: (childId: string) => void;
  onReorderChild?: (newOrderChilds: ComponentProps[]) => void;
  merge_childs?: boolean;
}

function setNestedValue(obj: any, key: string, value: any) {
  return { ...obj, [key]: value };
}

function removeNestedKey(obj: any, key: string) {
  const { [key]: _, ...rest } = obj;
  return rest;
}

function renderFormFields(
  data: any,
  onChange: (key: string, value: any) => void
) {
  return Object.entries(data || {}).map(([key, value]) => (
    <div key={key} style={{ marginBottom: 8 }}>
      <label>
        {key}: <input type="text" onChange={(e) => onChange(key, e.target.value)} />
      </label>
    </div>
  ));
}

function getSupportedComponents(name: string): string[] {
  return schema?.[name] || [];
}

export function EditComponent({
  name,
  data = null,
  styles,
  childs,
  merge_childs,
  onDataChange,
  onStylesChange,
  onSelectParent,
  onAddComponent,
  onClose,
  onDeleteComponent,
  onSelectChild,
  onReorderChild,
}: EditComponentRenderProps) {
  const [activeTab, setActiveTab] = useState<
    "data" | "styles" | "components" | "children"
  >("styles");

  const [dataState, setDataState] = useState<DataProps>(data);
  const [stylesState, setStylesState] = useState(
    Array.isArray(styles) ? styles : [styles]
  );

  const [showAddStyleArr, setShowAddStyleArr] = useState<boolean[]>(
    Array(Array.isArray(styles) ? styles.length : 1).fill(false)
  );
  const [newStyleKeyArr, setNewStyleKeyArr] = useState<string[]>(
    Array(Array.isArray(styles) ? styles.length : 1).fill("")
  );
  const [newStyleValueArr, setNewStyleValueArr] = useState<string[]>(
    Array(Array.isArray(styles) ? styles.length : 1).fill("")
  );

  const [childsState, setChildsState] = useState<ComponentProps[]>(
    childs ?? []
  );

  useEffect(() => {
    const stylesList = Array.isArray(styles) ? styles : [styles];
    setStylesState(stylesList);
    setShowAddStyleArr(Array(stylesList.length).fill(false));
    setNewStyleKeyArr(Array(stylesList.length).fill(""));
    setNewStyleValueArr(Array(stylesList.length).fill(""));
  }, [styles]);

  useEffect(() => setDataState(data), [data]);
  useEffect(() => setChildsState(childs ?? []), [childs]);

  const handleDataChange = (key: string, value: any) => {
    const updated = setNestedValue(dataState, key, value);
    setDataState(updated);
    onDataChange?.(updated);
  };

  const handleStylesChange = (key: string, value: any, index: number) => {
    const updatedStyle = setNestedValue({ ...stylesState[index] }, key, value);
    const updated = [
      ...stylesState.slice(0, index),
      updatedStyle,
      ...stylesState.slice(index + 1),
    ];
    setStylesState(updated);
    onStylesChange?.(updated);
  };

  const handleAddStyle = (styleIndex: number) => {
    const key = newStyleKeyArr[styleIndex];
    if (!key) return;
    const value = newStyleValueArr[styleIndex];

    const updated = stylesState.map((styleObj, i) => {
      if (i === styleIndex) {
        return {
          ...styleObj,
          [key]: value
        };
      }
      return styleObj;
    });
    setStylesState(updated);

    setShowAddStyleArr((arr) => arr.map((v, i) => (i === styleIndex ? false : v)));
    setNewStyleKeyArr((arr) => arr.map((v, i) => (i === styleIndex ? "" : v)));
    setNewStyleValueArr((arr) => arr.map((v, i) => (i === styleIndex ? "" : v)));
    onStylesChange?.(updated);
  };

  const handleRemoveStyle = (key: string, index: number) => {
   const updatedStyle = removeNestedKey({ ...stylesState[index] }, key);
    const updated = [
      ...stylesState.slice(0, index),
      updatedStyle,
      ...stylesState.slice(index + 1),
    ];
    setStylesState(updated);
    onStylesChange?.(updated);
  };

  const supportedComponents = getSupportedComponents(name);

  const handleReorderChildren = (newOrder: ComponentProps[]) => {
    setChildsState(newOrder);
    onReorderChild?.(newOrder);
  };

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
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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

        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              background: "#e0e0e0",
              border: "1px solid #ccc",
              borderRadius: 4,
              cursor: "pointer",
              padding: "4px 12px",
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
              onClose();
            }}
          >
            ×
          </button>
        </div>
      </div>

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
        {childsState && childsState.length > 0 && !merge_childs && (
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

      <div>
        {activeTab === "data" && renderFormFields(dataState, handleDataChange)}

        {activeTab === "styles" && (
          <div>
            {stylesState?.map((_style, styleIndex) => {
              const childName =
                styleIndex > 0 &&
                Array.isArray(childsState) &&
                childsState[styleIndex-1] &&
                typeof childsState[styleIndex-1].name === "string"
                  ? childsState[styleIndex-1].name
                  : null;
              console.info("Editing style for:", childName, childsState[styleIndex], styleIndex);
              return (
                <div
                  key={styleIndex}
                  style={{
                    marginBottom: 16,
                    borderBottom: "1px solid #eee",
                    paddingBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#777",
                      marginBottom: 6,
                      fontSize: 13,
                    }}
                  >
                    {childName && styleIndex ? (
                      <>
                        <span style={{ fontWeight: "normal" }}>
                          {`${childName} > Styles`}
                        </span>
                      </>
                    ) : (
                      <>Container</>
                    )}
                  </div>
                  {Object.entries(_style).map(([key, value]) => (
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
                          onChange={(e) =>
                            handleStylesChange(key, e.target.value, styleIndex)
                          }
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
                        onClick={() => handleRemoveStyle(key, styleIndex)}
                        title="Remove style"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {showAddStyleArr[styleIndex] ? (
                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <input
                        list="css-properties"
                        type="text"
                        placeholder="Style key"
                        value={newStyleKeyArr[styleIndex]}
                        onChange={e =>
                          setNewStyleKeyArr(arr =>
                            arr.map((v, i) =>
                              i === styleIndex ? e.target.value : v
                            )
                          )
                        }
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
                        value={newStyleValueArr[styleIndex]}
                        onChange={e =>
                          setNewStyleValueArr(arr =>
                            arr.map((v, i) =>
                              i === styleIndex ? e.target.value : v
                            )
                          )
                        }
                        style={{ width: "30%" }}
                      />
                      <button
                        onClick={() => handleAddStyle(styleIndex)}
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
                      <button
                        style={{
                          background: "#eee",
                          border: "1px solid #ccc",
                          borderRadius: 4,
                          cursor: "pointer",
                          padding: "4px 8px",
                        }}
                        onClick={() =>
                          setShowAddStyleArr(arr =>
                            arr.map((v, i) => (i === styleIndex ? false : v))
                          )
                        }
                        title="Cancel"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      aria-label="Add style property"
                      onClick={() =>
                        setShowAddStyleArr(arr =>
                          arr.map((v, i) => (i === styleIndex ? true : v))
                        )
                      }
                      style={{
                        marginTop: 8,
                        background: "#e0ffe0",
                        border: "1px solid #aaffaa",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        fontSize: 22,
                        lineHeight: "1",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Add new style property"
                    >
                      ＋
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

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
                    onClick={() => {
                      onAddComponent?.(comp);
                    }}
                  >
                    ＋
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "children" && !merge_childs && (
          <div style={{ padding: "16px 0" }}>
            <div style={{ marginBottom: 8, fontWeight: "bold" }}>
              Child Components:
            </div>
            {!childsState || childsState.length === 0 ? (
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