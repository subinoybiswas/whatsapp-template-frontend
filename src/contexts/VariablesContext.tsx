
import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { useDebounceFn } from '../hooks/useDebounceFn';
import { TemplateApiResponse } from '../types/TemplateAPIResponse';

interface VariablesContextType {
    variables: { [key: string]: string };
    preview: string;
    error: string;
    loading: boolean;
    updateTemplate: (template: string) => void;
    handleVariableChange: (key: string, value: string) => void;
}

const VariablesContext = createContext<VariablesContextType | undefined>(undefined);

export function VariablesProvider({ children }: { children: ReactNode }) {
    const [variables, setVariables] = useState<{ [key: string]: string }>({});
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const [template, setTemplate] = useState('');
    const [loading, setLoading] = useState(false)

    const debouncedValidateTemplate = useDebounceFn(async (template: string) => {
        try {
            setLoading(true);
            const response = await axios.post<TemplateApiResponse>('http://localhost:5000/validate-template', { template });
            if (response.data.success && response.data.data?.placeholders) {
                const vars = response.data.data.placeholders.reduce((acc: { [key: string]: string }, key: string) => {
                    acc[key] = variables[key] || '';
                    return acc;
                }, {});
                setVariables(prevVars => ({
                    ...prevVars,
                    ...vars
                }));
                setError('');

            } else {
                setError(response.data.message || 'Validation failed');
            }
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid template format');
            setLoading(false);
        }
    }, 500);

    const debouncedParseTemplate = useDebounceFn(async (template: string, vars: { [key: string]: string }) => {
        try {
            setLoading(true);
            const response = await axios.post<TemplateApiResponse>('http://localhost:5000/generate-preview', { template, variables: vars });
            if (response.data.success && response.data.data?.preview) {
                setPreview(response.data.data.preview);
                setError('');
            } else {
                setError(response.data.message || 'Preview generation failed');
            }
            setLoading(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
            setLoading(false);
        }
    }, 500);

    const updateTemplate = (newTemplate: string) => {
        setTemplate(newTemplate);
        debouncedValidateTemplate(newTemplate);
        updateVariables(newTemplate);
        debouncedParseTemplate(newTemplate, variables);
    };

    const handleVariableChange = (key: string, value: string) => {
        const newVariables = { ...variables, [key]: value };
        setVariables(newVariables);
        debouncedParseTemplate(template, newVariables);
    };

    const updateVariables = (template: string) => {
        const variableRegex = /\{\{(\w+)\}\}/g;
        const matches = [...template.matchAll(variableRegex)];
        const newVariables: { [key: string]: string } = {};
        matches.forEach(match => {
            const varName = match[1];
            newVariables[varName] = variables[varName] || '';
        });
        setVariables(prevVars => ({
            ...prevVars,
            ...newVariables
        }));
    };

    return (
        <VariablesContext.Provider value={{
            variables,
            preview,
            error,
            loading,
            updateTemplate,
            handleVariableChange,
        }}>
            {children}
        </VariablesContext.Provider>
    );
}

export const useVariables = () => {
    const context = useContext(VariablesContext);
    if (context === undefined) {
        throw new Error('useVariables must be used within a VariablesProvider');
    }
    return context;
};