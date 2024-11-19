import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Info, Loader } from 'lucide-react'
import { useVariables } from '@/contexts/VariablesContext';

export default function PreviewSection() {
    const { loading, preview, error } = useVariables();

    return (
        <Card className="col-span-1 flex flex-col">
            <CardHeader>
                <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className='flex-1 overflow-auto'>
                <div className="whitespace-pre-wrap text-start">{preview}</div>
            </CardContent>
            <CardFooter className='flex justify-end items-center'>
                {loading && <Loader className="animate-spin text-blue-500" size={48} />}
                {error && <div className="text-red-500 mt-2 flex gap-1">{error}
                    <Info />
                </div>}
            </CardFooter>
        </Card>
    )
}
