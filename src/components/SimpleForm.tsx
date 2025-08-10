import React, { useState } from 'react';
import { ComponentProps, ComponentUpdateProps, FormComponentProps } from '../types';
import RenderComponent from '.';


const Form: React.FC<FormComponentProps & ComponentUpdateProps> = ({ styles, children, sequenceId, onChange }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={styles}>
            {children}
            <button type="submit">Submit</button>
        </form>
    );
};

export default Form;