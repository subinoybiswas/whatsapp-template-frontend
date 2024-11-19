import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { useVariables } from "@/contexts/VariablesContext";
import { ChangeEvent } from "react";

export default function TemplateEditor() {
    const { variables, handleVariableChange, updateTemplate } = useVariables();
    const handleTemplateChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        updateTemplate(e.target.value);
    }
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Template Editor</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className='flex flex-col justify-center gap-2'>
                        <Label htmlFor="template" className='text-lg text-start '>Template</Label>
                        <Textarea
                            id="template"
                            placeholder="Enter your template here. Use {{variable_name}} for variables."
                            onChange={handleTemplateChange}
                            rows={5}
                        />
                    </div>
                    {Object.keys(variables).length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-start">Variables</h3>
                            {Object.entries(variables).map(([varName, value]) => (
                                <div key={varName} className='flex flex-col gap-2 text-base'>
                                    <Label htmlFor={varName} className='text-start'>{varName}</Label>
                                    <Input
                                        id={varName}
                                        placeholder={`Enter value for ${varName}`}
                                        value={value}
                                        onChange={(e) => handleVariableChange(varName, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
