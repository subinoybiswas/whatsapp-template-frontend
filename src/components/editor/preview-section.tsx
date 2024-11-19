import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Info, Loader2 } from 'lucide-react'
import { useVariables } from '@/contexts/VariablesContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export default function PreviewSection() {
    const { preview, error, isValidating, isGeneratingPreview } = useVariables();

    return (
        <Card className="col-span-1 flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Preview
                    {(isValidating || isGeneratingPreview) && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className='flex-1 overflow-auto'>
                {preview ? (
                    <div className="whitespace-pre-wrap text-start">{preview}</div>
                ) : (
                    <div className="text-muted-foreground italic">
                        Preview will appear here...
                    </div>
                )}
            </CardContent>
            <CardFooter className='flex justify-end items-center'>
                {error && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="text-red-500 mt-2 flex items-center gap-1">
                                {error}
                                <Info className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Check your template syntax and try again</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </CardFooter>
        </Card>
    )
}
