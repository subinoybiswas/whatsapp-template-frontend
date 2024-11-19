import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Info } from 'lucide-react'
import { useVariables } from '@/contexts/VariablesContext';

export default function PreviewSection() {
    const { variables, preview, error, updateTemplate, handleVariableChange } = useVariables();

    return (
        <Card className="col-span-1 flex flex-col">
            <CardHeader>
                <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className='flex-1 overflow-auto'>
                <div className="whitespace-pre-wrap text-start">{preview}</div>
            </CardContent>
            <CardFooter className='flex justify-end items-center'>
                {error && <div className="text-red-500 mt-2 flex gap-1">{error}
                    <Info />
                </div>}
            </CardFooter>
        </Card>
    )
}
