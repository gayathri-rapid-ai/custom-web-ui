import React, { useState } from 'react';
import {
    test_data
} from './data/components';
import { ComponentProps } from './types';
import RenderComponent from './components';


const App: React.FC = () => {

    const [page, setPage] = useState<ComponentProps>(test_data as ComponentProps);

    const handleComponentChange = (sequenceId: string, data: any, styles: React.CSSProperties) => {
        const seqIDs = sequenceId.trim().split('$').filter(id => id !== '').map(id => parseInt(id, 10));
        let selectedComponent: ComponentProps | undefined = page;
        if (selectedComponent) {
            for (let i = 0; i < seqIDs.length; i++) {
                selectedComponent = selectedComponent?.childs?.[seqIDs[i]];
            }
            console.info(selectedComponent, "selectedComponent");
        }
        if (selectedComponent) {
            selectedComponent.data = data;
            selectedComponent.styles = styles;
            setPage({ ...page });
        }
    };

    return (
        <div className="App">
           <RenderComponent 
                {...page}
                sequenceId={""}
                onChange={handleComponentChange} 
            />
        </div>
    );
};

export default App;