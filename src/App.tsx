import React, { useState } from "react";
import { test_data } from "./data/components";
import { ComponentProps, DataProps } from "./types";
import RenderComponent from "./components";
import EditComponent from "./components/EditComponent";
import componentDefaults from "./data/component-defaults";

const App: React.FC = () => {
  const data = localStorage.getItem("prev_data");
  const [page, setPage] = useState<ComponentProps>(
    (data === null ? test_data : JSON.parse(data)) as ComponentProps
  );
  const [isEditingMode, setEditingMode] = useState<boolean>(false);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentProps | null>(null);
  const [selectedID, setSelectedID] = useState<string>("");

  const handleComponentChange = (sequenceId: string) => {
    const seqIDs = sequenceId
      .trim()
      .split("$")
      .filter((id) => id !== "")
      .map((id) => parseInt(id, 10));
    let targetComponent: ComponentProps | undefined = page;
    for (let i = 0; i < seqIDs.length; i++) {
      if (!targetComponent?.childs || isNaN(seqIDs[i])) {
        targetComponent = undefined;
        break;
      }
      targetComponent = targetComponent.childs[seqIDs[i]];
    }
    if (selectedComponent) {
      selectedComponent.isEditing = false;
    }
    if (targetComponent) {
      targetComponent.isEditing = true;
      setSelectedID(sequenceId);
      setSelectedComponent(targetComponent || null);
    }
  };

  const onSetParentComponent = () => {
    let seqIDs = selectedID
      .trim()
      .split("$")
      .filter((id) => id !== "")
      .map((id) => parseInt(id, 10));
    seqIDs = seqIDs.slice(0, -1); // Remove last ID to set parent
    let targetComponent: ComponentProps | undefined = page;
    for (let i = 0; i < seqIDs.length; i++) {
      if (!targetComponent?.childs || isNaN(seqIDs[i])) {
        targetComponent = undefined;
        break;
      }
      targetComponent = targetComponent.childs[seqIDs[i]];
    }
    setSelectedID(seqIDs.join("$"));
    setSelectedComponent(targetComponent || null);
  };

  // --- NEW: handle delete logic ---
  const handleDeleteComponent = () => {
    if (!selectedID) return;
    const seqIDs = selectedID
      .trim()
      .split("$")
      .filter((id) => id !== "")
      .map((id) => parseInt(id, 10));
    if (seqIDs.length === 0) return; // Can't delete root page

    // parent path = all but last
    const parentIDs = seqIDs.slice(0, -1);
    const childIdx = seqIDs[seqIDs.length - 1];

    let parent: ComponentProps | undefined = page;
    for (let i = 0; i < parentIDs.length; i++) {
      if (!parent?.childs || isNaN(parentIDs[i])) {
        parent = undefined;
        break;
      }
      parent = parent.childs[parentIDs[i]];
    }
    // Delete the child if parent and childs exist
    if (parent && Array.isArray(parent.childs)) {
      parent.childs.splice(childIdx, 1);
      setPage({ ...page }); // re-render
      setSelectedID("");
      setSelectedComponent(null);
      // persist the change
      const data_str = JSON.stringify(page);
      localStorage.setItem("prev_data", data_str.replaceAll("true", "false"));
    }
  };

  const leftPanelStyle: React.CSSProperties = {
    width: isEditingMode && selectedComponent ? "75%" : "100%",
  };
  const rightPanelStyle: React.CSSProperties = {
    width: "25%",
  };

  const changeEditMode = () => {
    setEditingMode(!isEditingMode);
    if (selectedComponent) {
      selectedComponent.isEditing = false;
    }
  };

  const handleComponentChanges = () => {
    setPage({ ...page });
    const data_str = JSON.stringify(page);
    localStorage.setItem("prev_data", data_str.replaceAll("true", "false"));
  };

  const handleStyleChanges = (styles: React.CSSProperties) => {
    if (selectedComponent) {
      selectedComponent.styles = styles;
    }
    handleComponentChanges();
  };
  
  return (
    <div className="App" style={{ width: "100%", display: "flex" }}>
      <div style={leftPanelStyle}>
        <button
          onClick={changeEditMode}
          style={{ float: "right", position: "fixed" }}
        >
          {isEditingMode ? "Exit Editing Mode" : "Enter Editing Mode"}
        </button>

        <RenderComponent
          {...page}
          sequenceId={""}
          isEditingMode={isEditingMode}
          onSelectForEdit={handleComponentChange}
          onEditStyles={handleStyleChanges}
        />
      </div>
      {isEditingMode && selectedComponent !== null && (
        <div style={rightPanelStyle}>
          <EditComponent
            {...selectedComponent}
            onChange={(data: DataProps, styles: React.CSSProperties) => {
              console.info(styles);
              selectedComponent.data = data;
              selectedComponent.styles = {
                ...styles,
              };
              handleComponentChanges();
            }}
            onSelectParent={onSetParentComponent}
            onClose={() => {
              selectedComponent.isEditing = false;
              setSelectedComponent(null);
              setSelectedID("");
            }}
            onAddComponent={(component: string) => {
              if (componentDefaults[component] === undefined) {
                console.error("Component not found in defaults:", component);
                return;
              }
              const newComponent: ComponentProps = {
                ...componentDefaults[component],
                isEditing: true,
              };
              if (selectedComponent?.childs) {
                selectedComponent.childs.push(newComponent);
              } else {
                selectedComponent.childs = [newComponent];
              }
              selectedComponent.isEditing = false;
              setSelectedComponent(selectedComponent.childs[0]);
              setSelectedID(selectedID + (selectedComponent.childs.length - 1) + "$");
              setPage({ ...page });
            }}
            onStylesChange={handleStyleChanges}
            onDeleteComponent={handleDeleteComponent}
          />
        </div>
      )}
    </div>
  );
};

export default App;