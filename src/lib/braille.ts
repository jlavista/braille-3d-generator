export interface BrailleChar {
  char: string
  dots: number[]
  unicode: string
}

const brailleMap: Record<string, number[]> = {
  'a': [1],
  'b': [1, 2],
  'c': [1, 4],
  'd': [1, 4, 5],
  'e': [1, 5],
  'f': [1, 2, 4],
  'g': [1, 2, 4, 5],
  'h': [1, 2, 5],
  'i': [2, 4],
  'j': [2, 4, 5],
  'k': [1, 3],
  'l': [1, 2, 3],
  'm': [1, 3, 4],
  'n': [1, 3, 4, 5],
  'o': [1, 3, 5],
  'p': [1, 2, 3, 4],
  'q': [1, 2, 3, 4, 5],
  'r': [1, 2, 3, 5],
  's': [2, 3, 4],
  't': [2, 3, 4, 5],
  'u': [1, 3, 6],
  'v': [1, 2, 3, 6],
  'w': [2, 4, 5, 6],
  'x': [1, 3, 4, 6],
  'y': [1, 3, 4, 5, 6],
  'z': [1, 3, 5, 6],
  '1': [1],
  '2': [1, 2],
  '3': [1, 4],
  '4': [1, 4, 5],
  '5': [1, 5],
  '6': [1, 2, 4],
  '7': [1, 2, 4, 5],
  '8': [1, 2, 5],
  '9': [2, 4],
  '0': [2, 4, 5],
  ' ': [],
  '.': [2, 5, 6],
  ',': [2],
  '?': [2, 3, 6],
  '!': [2, 3, 5],
  ':': [2, 5],
  ';': [2, 3],
  '-': [3, 6],
  '/': [3, 4],
  '(': [2, 3, 6],
  ')': [3, 5, 6],
  '+': [3, 4, 6],
  '=': [2, 3, 5, 6],
  '*': [3, 5],
  '@': [4],
  '#': [3, 4, 5, 6],
  '$': [1, 2, 4, 6],
  '%': [1, 4, 6],
  '&': [1, 2, 3, 4, 6],
  '"': [5],
  "'": [3],
}

function dotsToUnicode(dots: number[]): string {
  if (dots.length === 0) return ' '
  
  const baseCode = 0x2800
  let offset = 0
  
  for (const dot of dots) {
    offset += Math.pow(2, dot - 1)
  }
  
  return String.fromCodePoint(baseCode + offset)
}

export function textToBraille(text: string): BrailleChar[] {
  const result: BrailleChar[] = []
  const lowerText = text.toLowerCase()
  
  for (let i = 0; i < lowerText.length; i++) {
    const char = lowerText[i]
    const dots = brailleMap[char]
    
    if (dots !== undefined) {
      result.push({
        char: text[i],
        dots,
        unicode: dotsToUnicode(dots)
      })
    } else {
      result.push({
        char: text[i],
        dots: [1, 2, 3, 4, 5, 6],
        unicode: '⠿'
      })
    }
  }
  
  return result
}

export function brailleToString(brailleChars: BrailleChar[]): string {
  return brailleChars.map(bc => bc.unicode).join('')
}

export interface DotPosition {
  x: number
  y: number
  z: number
}

export function getDotPositions(dotNumbers: number[], cellWidth: number, cellHeight: number, dotHeight: number): DotPosition[] {
  const dotSpacing = cellWidth / 2
  const verticalSpacing = cellHeight / 3
  
  const dotMap: Record<number, [number, number]> = {
    1: [0, 0],
    2: [0, verticalSpacing],
    3: [0, verticalSpacing * 2],
    4: [dotSpacing, 0],
    5: [dotSpacing, verticalSpacing],
    6: [dotSpacing, verticalSpacing * 2],
  }
  
  return dotNumbers.map(dotNum => {
    const [x, y] = dotMap[dotNum]
    return { x, y, z: dotHeight }
  })
}
