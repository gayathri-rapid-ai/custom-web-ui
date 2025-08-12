import React, { useState } from 'react';
import {
    test_data
} from './data/components';
import { ComponentProps, DataProps } from './types';
import RenderComponent from './components';
import EditComponent from './components/EditComponent';
import componentDefaults from './data/component-defaults';

const App: React.FC = () => {

    const [page, setPage] = useState<ComponentProps>(test_data as ComponentProps);
    const [isEditingMode, setEditingMode] = useState<boolean>(false);
    const [selectedComponent, setSelectedComponent] = useState<ComponentProps|null>(null);
    const [selectedID, setSelectedID] = useState<string>("");

const handleComponentChange = (sequenceId: string) => {
        const seqIDs = sequenceId.trim().split('$').filter(id => id !== '').map(id => parseInt(id, 10));
        console.info(sequenceId, "sequenceId");
        let targetComponent: ComponentProps | undefined = page; // Start from root
        console.info(seqIDs, "seqIDs");
        for (let i = 0; i < seqIDs.length; i++) {
            if (!targetComponent?.childs || isNaN(seqIDs[i])) {
                targetComponent = undefined;
                break;
            }
            targetComponent = targetComponent.childs[seqIDs[i]];
            targetComponent.isEditing = true;
        }
        console.info(targetComponent, "targetComponent");
        setSelectedID(sequenceId);
        setSelectedComponent(targetComponent || null);
    };

    const onSetParentComponent = () => {
        let seqIDs = selectedID.trim().split('$').filter(id => id !== '').map(id => parseInt(id, 10));
        seqIDs = seqIDs.slice(0, -1); // Remove last ID to set parent
        console.info(selectedID, "sequenceId");
        let targetComponent: ComponentProps | undefined = page; // Start from root
        for (let i = 0; i < seqIDs.length; i++) {
            if (!targetComponent?.childs || isNaN(seqIDs[i])) {
                targetComponent = undefined;
                break;
            }
            targetComponent = targetComponent.childs[seqIDs[i]];
        }
        console.info(targetComponent, "targetComponent");
        setSelectedID(seqIDs.join('$'));
        setSelectedComponent(targetComponent || null);
    };

    return (
        <div className="App">
            <h1>Custom Web UI</h1>
            <button onClick={() => setEditingMode(!isEditingMode)}>
                {isEditingMode ? "Exit Editing Mode" : "Enter Editing Mode"}
            </button>
            
           <RenderComponent
                {...page}
                sequenceId={""}
                onSelectForEdit={handleComponentChange} 
            />
            {isEditingMode && selectedComponent !== null && (
                <EditComponent
                    {...selectedComponent}
                    onChange={(data: DataProps, styles:React.CSSProperties)=>{
                        selectedComponent.data = data;
                        selectedComponent.styles = styles;
                        setPage({ ...page });
                    }}
                    onSelectParent={onSetParentComponent}
                    onClose={() => setSelectedComponent(null)}
                    onAddComponent={(component: string)=> {
                        if(componentDefaults[component] === undefined) {
                            console.error("Component not found in defaults:", component);
                            return;
                        }
                        const newComponent: ComponentProps = {
                            ...componentDefaults[component],
                        };
                        if (selectedComponent?.childs) {
                            selectedComponent.childs.push(newComponent);
                        }
                        else {
                            selectedComponent.childs = [newComponent];
                        }
                        console.info("New component added:", newComponent);
                        setPage({ ...page });
                        console.info(page);
                    }}
                />
            )}
        </div>
    );
};

export default App;