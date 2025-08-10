import React, { useEffect, useState } from "react";
import { DataProps } from "../types";

export interface EditComponentProps {
  data?: DataProps;
  styles?: React.CSSProperties;
  onDataChange?: (data: DataProps) => void;
  onStylesChange?: (styles: React.CSSProperties) => void;
  onChange?: (data: DataProps, styles: React.CSSProperties) => void;
  onSelectParent: () => void;
  onClose: () => void;
  name: string; // New prop for tag name
}

function setNestedValue(obj: any, key: string, value: any) {
  // Dummy implementation; replace with your actual logic
  return { ...obj, [key]: value };
}

function removeNestedKey(obj: any, key: string) {
  // Dummy implementation; replace with your actual logic
  const { [key]: _, ...rest } = obj;
  return rest;
}

function renderFormFields(data: any, onChange: (key: string, value: any) => void) {
  // Dummy implementation; replace with your actual logic
  return Object.entries(data || {}).map(([key, value]) => (
    <div key={key} style={{ marginBottom: 8 }}>
      <label>
        {key}:{" "}
        <input
          type="text"
          value={value as string}
          onChange={e => onChange(key, e.target.value)}
        />
      </label>
    </div>
  ));
}

export function EditComponent({
  data = null,
  styles = {},
  onDataChange,
  onStylesChange,
  onChange,
  onSelectParent,
  onClose,
  name, // New prop
}: EditComponentProps) {
  const [showPanel, setShowPanel] = useState(true);
  const [activeTab, setActiveTab] = useState<"data" | "styles">("data");
  const [dataState, setDataState] = useState<DataProps>(data);
  const [stylesState, setStylesState] = useState(styles);
  const [newStyleKey, setNewStyleKey] = useState("");
  const [newStyleValue, setNewStyleValue] = useState("");

  useEffect(() => {
    setDataState(data);
  }, [data]);
  useEffect(() => {
    setStylesState(styles);
  }, [styles]);

  const handleDataChange = (key: string, value: any) => {
    const updated = setNestedValue(dataState, key, value);
    setDataState(updated);
    onDataChange?.(updated);
    onChange?.(updated, stylesState);
  };

  const handleStylesChange = (key: string, value: any) => {
    const updated = setNestedValue(stylesState, key, value);
    setStylesState(updated);
    onStylesChange?.(updated);
    onChange?.(dataState, updated);
  };

  const handleAddStyle = () => {
    if (!newStyleKey) return;
    const updated = {
      ...stylesState,
      [newStyleKey]: newStyleValue,
    };
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

  return (
    <div style={{ display: "flex", position: "relative" }}>
      {showPanel && (
        <div
          style={{
            width: 340,
            background: "#f7f7f7",
            borderLeft: "1px solid #ddd",
            padding: 24,
            position: "fixed",
            right: 0,
            top: 0,
            height: "100vh",
            zIndex: 100,
            overflowY: "auto",
            boxShadow: "-2px 0 8px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
                  setShowPanel(false);
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
          </div>
          <div>
            {activeTab === "data"
              ? renderFormFields(dataState, handleDataChange)
              : (
                <div>
                  {Object.entries(stylesState).map(([key, value]) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                      <label style={{ flex: 1 }}>
                        {key}:{" "}
                        <input
                          type="text"
                          value={value as string}
                          onChange={e => handleStylesChange(key, e.target.value)}
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
                  <div style={{ marginTop: 12 }}>
                    <input
                      type="text"
                      placeholder="Style key"
                      value={newStyleKey}
                      onChange={e => setNewStyleKey(e.target.value)}
                      style={{ width: "40%", marginRight: 8 }}
                    />
                    <input
                      type="text"
                      placeholder="Style value"
                      value={newStyleValue}
                      onChange={e => setNewStyleValue(e.target.value)}
                      style={{ width: "40%", marginRight: 8 }}
                    />
                    <button
                      onClick={handleAddStyle}
                      style={{
                        padding: "4px 12px",
                        background: "#e0ffe0",
                        border: "1px solid #aaffaa",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
export default EditComponent;