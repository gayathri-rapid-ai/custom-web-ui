import React, { useState } from 'react';
import { ComponentUpdateProps, FormComponentProps } from '../types';


const Form: React.FC<FormComponentProps & ComponentUpdateProps> = ({ style, children, sequenceId, onSelectForEdit }) => {
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
        <form onSubmit={handleSubmit} style={style}>
            {children}
            <button type="submit">Submit</button>
        </form>
    );
};

export default Form;