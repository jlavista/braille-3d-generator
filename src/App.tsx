import { useState, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import { textToBraille, BrailleChar, BrailleType } from '@/lib/braille'
import { generateSTL, downloadSTL } from '@/lib/stl-export'
import { BrailleViewer3D } from '@/components/BrailleViewer3D'
import { BrailleDisplay } from '@/components/BrailleDisplay'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { Download, TextAa, Cube, Code, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const [inputText, setInputText] = useState('')
  const [brailleType, setBrailleType] = useState<BrailleType>('ueb')
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null)
  const [stlCode, setStlCode] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const brailleChars = useMemo<BrailleChar[]>(() => {
    if (!inputText) return []
    return textToBraille(inputText, brailleType)
  }, [inputText, brailleType])

  const handleGeometryUpdate = useCallback((newGeometry: THREE.BufferGeometry) => {
    setGeometry(newGeometry)
  }, [])

  const generateStlCode = useCallback(() => {
    if (!geometry) {
      toast.error('No model to generate', {
        description: 'Please enter some text first'
      })
      return null
    }

    try {
      return generateSTL(geometry)
    } catch (error) {
      toast.error('Failed to generate STL', {
        description: 'An error occurred while creating the file'
      })
      return null
    }
  }, [geometry])

  const handleViewStl = () => {
    const stl = generateStlCode()
    if (stl) {
      setStlCode(stl)
      setIsDialogOpen(true)
    }
  }

  const handleDownloadFromDialog = () => {
    if (stlCode) {
      const sanitizedText = inputText.slice(0, 20).replace(/[^a-z0-9]/gi, '_')
      downloadSTL(stlCode, `braille_${sanitizedText}.stl`)
      toast.success('STL file downloaded', {
        description: 'Your 3D model is ready for printing'
      })
      setIsDialogOpen(false)
    }
  }

  const handleCopyStl = async () => {
    try {
      await navigator.clipboard.writeText(stlCode)
      toast.success('Copied to clipboard', {
        description: 'STL code has been copied'
      })
    } catch (error) {
      toast.error('Failed to copy', {
        description: 'Could not copy to clipboard'
      })
    }
  }

  const handleDownload = () => {
    const stl = generateStlCode()
    if (stl) {
      const sanitizedText = inputText.slice(0, 20).replace(/[^a-z0-9]/gi, '_')
      downloadSTL(stl, `braille_${sanitizedText}.stl`)
      toast.success('STL file downloaded', {
        description: 'Your 3D model is ready for printing'
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

                  <div className="space-y-2">
                    <Label htmlFor="braille-type">Braille Type</Label>
                    <Select value={brailleType} onValueChange={(value) => setBrailleType(value as BrailleType)}>
                      <SelectTrigger id="braille-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grade1">Grade 1 (Letter-by-letter)</SelectItem>
                        <SelectItem value="grade2">Grade 2 (Contracted)</SelectItem>
                        <SelectItem value="ueb">UEB (Unified English Braille)</SelectItem>
                        <SelectItem value="numeric">Numeric Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {brailleType === 'grade1' && 'Each letter is represented individually'}
                      {brailleType === 'grade2' && 'Common words are shortened using contractions'}
                      {brailleType === 'ueb' && 'International standard with capital indicators and contractions'}
                      {brailleType === 'numeric' && 'Optimized for numbers and digits'}
                    </p>
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
                <CardContent className="space-y-3">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={handleViewStl}
                        disabled={!inputText || !geometry}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <Code className="mr-2" size={20} />
                        View STL Code
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>STL Code</DialogTitle>
                        <DialogDescription>
                          ASCII STL format for your braille model
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        <div className="rounded-md border bg-muted/50">
                          <div className="max-h-[400px] overflow-auto">
                            <pre className="p-4 text-xs font-mono whitespace-pre select-text">
{stlCode}
                            </pre>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleCopyStl}
                            variant="outline"
                            className="flex-1"
                          >
                            <Copy className="mr-2" size={18} />
                            Copy to Clipboard
                          </Button>
                          <Button
                            onClick={handleDownloadFromDialog}
                            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                          >
                            <Download className="mr-2" size={18} />
                            Download STL
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                    Standard braille dimensions (dots: 1.5mm dia. × 0.6mm high)
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
            <p>Models use standard braille specifications for optimal readability</p>
            <p className="text-xs mt-1">
              {brailleType === 'grade1' && 'Grade 1: Uncontracted braille with each letter spelled out'}
              {brailleType === 'grade2' && 'Grade 2: Contracted braille with common word abbreviations'}
              {brailleType === 'ueb' && 'UEB: Unified English Braille - international standard with capitalization'}
              {brailleType === 'numeric' && 'Numeric: Specialized format for numerical content'}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App