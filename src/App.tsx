import { useState, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { textToBraille, BrailleChar } from '@/lib/braille'
import { generateSTL, downloadSTL } from '@/lib/stl-export'
import { BrailleViewer3D } from '@/components/BrailleViewer3D'
import { BrailleDisplay } from '@/components/BrailleDisplay'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/sonner'
import { Download, TextAa, Cube } from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const [inputText, setInputText] = useState('')
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  
  const brailleChars = useMemo<BrailleChar[]>(() => {
    if (!inputText) return []
    return textToBraille(inputText)
  }, [inputText])

  const handleGeometryUpdate = useCallback((newGeometry: THREE.BufferGeometry) => {
    setGeometry(newGeometry)
  }, [])

  const handleDownload = () => {
    if (!geometry) {
      toast.error('No model to download', {
        description: 'Please enter some text first'
      })
      return
    }

    try {
      const stl = generateSTL(geometry)
      const sanitizedText = inputText.slice(0, 20).replace(/[^a-z0-9]/gi, '_')
      downloadSTL(stl, `braille_${sanitizedText}.stl`)
      toast.success('STL file downloaded', {
        description: 'Your 3D model is ready for printing'
      })
    } catch (error) {
      toast.error('Failed to generate STL', {
        description: 'An error occurred while creating the file'
      })
    }
  }

  const charCount = inputText.length
  const maxChars = 100

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
              Braille 3D Generator
            </h1>
            <p className="text-muted-foreground text-base">
              Convert text to tactile braille and export as printable 3D models
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TextAa className="text-primary" size={24} />
                    <CardTitle>Text Input</CardTitle>
                  </div>
                  <CardDescription>
                    Enter the text you want to convert to braille
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="text-input">Your Text</Label>
                      <Badge variant={charCount > maxChars ? 'destructive' : 'secondary'}>
                        {charCount} / {maxChars}
                      </Badge>
                    </div>
                    <Textarea
                      id="text-input"
                      placeholder="Type your message here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value.slice(0, maxChars))}
                      className="min-h-[120px] resize-none font-sans"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Braille Translation</Label>
                    <div className="bg-secondary p-4 rounded-lg min-h-[60px] flex items-center">
                      <BrailleDisplay brailleChars={brailleChars} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Export</CardTitle>
                  <CardDescription>
                    Download your braille model as an STL file
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleDownload}
                    disabled={!inputText || !geometry}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                    size="lg"
                  >
                    <Download className="mr-2" size={20} />
                    Download STL File
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3 text-center">
                    Standard braille dimensions for 3D printing
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Cube className="text-primary" size={24} />
                    <CardTitle>3D Preview</CardTitle>
                  </div>
                  <CardDescription>
                    Rotate and zoom to inspect your model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {brailleChars.length > 0 ? (
                    <BrailleViewer3D
                      brailleChars={brailleChars}
                      onGeometryUpdate={handleGeometryUpdate}
                    />
                  ) : (
                    <div className="w-full h-[400px] rounded-lg bg-secondary/50 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Cube size={48} className="mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No preview available</p>
                        <p className="text-sm">Enter text to generate a 3D model</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Models use standard Grade 1 braille specifications for optimal readability</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App