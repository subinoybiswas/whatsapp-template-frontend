import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDebounceFn } from '../hooks/useDebounceFn';
import { TemplateApiResponse } from '../types/TemplateAPIResponse';
import { BACKEND_URL } from '../lib/constants';

interface VariablesContextType {
    variables: { [key: string]: string };
    preview: string;
    error: string;
    loading: boolean;
    updateTemplate: (template: string) => void;
    handleVariableChange: (key: string, value: string) => void;
    isValidating: boolean;
    isGeneratingPreview: boolean;
}

const VariablesContext = createContext<VariablesContextType | undefined>(undefined);

export function VariablesProvider({ children }: { children: ReactNode }) {
    const [variables, setVariables] = useState<{ [key: string]: string }>({});
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const [template, setTemplate] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
    
    // Template cache
    const templateCache = useRef<Map<string, string[]>>(new Map());

    const validateTemplateFormat = (template: string): string | null => {
        if (template.includes('{{') && !template.includes('}}')) {
            return 'Invalid template format: missing closing "}}" for a placeholder';
        }
        if (template.match(/{{\s*[a-z_]*\d+[a-z_]*\s*}}/g)) {
            return 'Invalid template format: placeholders cannot contain numbers';
        }
        if (template.match(/{{\s*[^a-zA-Z_\s}]+\s*}}/g)) {
            return 'Invalid template format: placeholders can only contain letters and underscores';
        }
        return null;
    };

    const debouncedValidateTemplate = useDebounceFn(async (newTemplate: string) => {
        setTemplate(newTemplate); // Store the template value
        
        if (!newTemplate.trim()) {
            setVariables({});
            setPreview('');
            setError('');
            return;
        }

        const formatError = validateTemplateFormat(newTemplate);
        if (formatError) {
            setError(formatError);
            setVariables({});
            setPreview('');
            return;
        }

        const abortController = new AbortController();

        try {
            setIsValidating(true);
            setError('');

            if (templateCache.current.has(newTemplate)) {
                const cachedPlaceholders = templateCache.current.get(newTemplate)!;
                const vars = cachedPlaceholders.reduce((acc, key) => ({ ...acc, [key]: variables[key] || '' }), {});
                setVariables(vars);
                await generatePreview(newTemplate, vars);
                return;
            }

            const response = await axios.post<TemplateApiResponse>(
                `${BACKEND_URL}/validate-template`, 
                { template: newTemplate },
                { signal: abortController.signal }
            );

            if (response.data.success && response.data.data?.placeholders) {
                const placeholders = response.data.data.placeholders;
                templateCache.current.set(newTemplate, placeholders);
                const vars = placeholders.reduce((acc, key) => ({ ...acc, [key]: variables[key] || '' }), {});
                setVariables(vars);
                await generatePreview(newTemplate, vars);
            } else {
                throw new Error(response.data.message || 'Validation failed');
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                setError(err.response?.data?.message || err.message || 'Invalid template format');
            }
        } finally {
            setIsValidating(false);
        }

        return () => abortController.abort();
    }, 500);

    const generatePreview = async (templateText: string, vars: { [key: string]: string }) => {
        const formatError = validateTemplateFormat(templateText);
        if (formatError) {
            setError(formatError);
            return;
        }

        const abortController = new AbortController();

        try {
            setIsGeneratingPreview(true);
            const response = await axios.post<TemplateApiResponse>(
                `${BACKEND_URL}/generate-preview`,
                { template: templateText, variables: vars },
                { signal: abortController.signal }
            );

            if (response.data.success && response.data.data?.preview) {
                setPreview(response.data.data.preview);
                setError('');
            } else {
                throw new Error(response.data.message || 'Preview generation failed');
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                setError(err.response?.data?.message || err.message || 'Preview generation failed');
            }
        } finally {
            setIsGeneratingPreview(false);
        }

        return () => abortController.abort();
    };

    const handleVariableChange = (key: string, value: string) => {
        const newVariables = { ...variables, [key]: value };
        setVariables(newVariables);
        
        // Always generate preview with current template
        if (template) {
            generatePreview(template, newVariables);
        }
    };

    useEffect(() => {
        return () => {
            templateCache.current.clear();
        };
    }, []);

    return (
        <VariablesContext.Provider value={{
            variables,
            preview,
            error,
            loading: isValidating || isGeneratingPreview,
            isValidating,
            isGeneratingPreview,
            updateTemplate: debouncedValidateTemplate,
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