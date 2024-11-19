'use client'

import { useState, ChangeEvent } from 'react'
import axios from 'axios'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Info } from 'lucide-react';
import './App.css'

function App() {
  const [template, setTemplate] = useState('')
  const [variables, setVariables] = useState<{ [key: string]: string }>({})
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')

  const validateTemplate = async (template: string) => {
    try {
      const response = await axios.post('http://localhost:5000/validate-template', { template })
      const vars = response.data.placeholders.reduce((acc: { [key: string]: string }, key: string) => {
        acc[key] = ''
        return acc
      }, {})
      setVariables(vars)
      setError('')
    } catch (err) {
      setError((err as any).response?.data?.message || 'Invalid template format')
    }
  }

  const handleTemplateChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newTemplate = e.target.value
    setTemplate(newTemplate)
    await validateTemplate(newTemplate)
    updateVariables(newTemplate)
    updatePreview(newTemplate, variables)
  }

  const handleVariableChange = (key: string, value: string) => {
    const newVariables = { ...variables, [key]: value }
    setVariables(newVariables)
    updatePreview(template, newVariables)
  }

  const parseTemplate = async (vars: { [key: string]: string }) => {
    try {
      const response = await axios.post('http://localhost:5000/generate-preview', { template, variables: vars })
      setPreview(response.data.preview)
      setError('')
    } catch (err) {
      setError((err as any).response?.data?.message || 'An error occurred')
    }
  }

  const handleParseTemplate = async () => {
    await parseTemplate(variables)
  }

  const updateVariables = (template: string) => {
    const variableRegex = /\{\{(\w+)\}\}/g
    const matches = [...template.matchAll(variableRegex)]
    const newVariables: { [key: string]: string } = {}
    matches.forEach(match => {
      const varName = match[1]
      newVariables[varName] = variables[varName] || ''
    })
    setVariables(newVariables)
  }

  const updatePreview = async (template: string, variables: { [key: string]: string }) => {
    await parseTemplate(variables)
  }

  return (
    <div className="container mx-auto p-4 space-y-6 w-screen max-w-screen-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  value={template}
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
      </div>
    </div>
  )
}

export default App
