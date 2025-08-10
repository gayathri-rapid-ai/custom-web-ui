import React from 'react';

const EditPanel: React.FC = () => {
    const [componentData, setComponentData] = React.useState<any>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setComponentData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div style={{ position: 'fixed', right: 0, top: 0, width: '300px', height: '100%', backgroundColor: '#f0f0f0', padding: '20px' }}>
            <h2>Edit Panel</h2>
            <form>
                <div>
                    <label htmlFor="headerStyle">Header Style:</label>
                    <input type="text" name="headerStyle" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="footerStyle">Footer Style:</label>
                    <input type="text" name="footerStyle" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="formFields">Form Fields:</label>
                    <input type="text" name="formFields" onChange={handleChange} />
                </div>
                {/* Additional fields for customization can be added here */}
            </form>
        </div>
    );
};

export default EditPanel;