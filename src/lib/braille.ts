export interface BrailleChar {
  char: string
  dots: number[]
  unicode: string
}

export type BrailleType = 'grade1' | 'grade2' | 'numeric' | 'ueb'

const grade1Map: Record<string, number[]> = {
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

const numericIndicator = [3, 4, 5, 6]

const numericMap: Record<string, number[]> = {
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
}

const grade2Contractions: Record<string, number[][]> = {
  'and': [[1, 2, 3, 4, 6]],
  'for': [[1, 2, 3, 4, 5, 6]],
  'of': [[1, 2, 3, 5, 6]],
  'the': [[2, 3, 4, 6]],
  'with': [[2, 3, 4, 5, 6]],
  'ch': [[1, 6]],
  'sh': [[1, 4, 6]],
  'th': [[1, 4, 5, 6]],
  'wh': [[1, 5, 6]],
  'ou': [[1, 2, 5, 6]],
  'st': [[3, 4]],
  'ing': [[3, 4, 6]],
  'ed': [[1, 2, 4, 6]],
  'er': [[1, 2, 4, 5, 6]],
}

const uebCapitalIndicator = [6]
const uebNumberIndicator = [3, 4, 5, 6]

const uebMap: Record<string, number[]> = {
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
  ' ': [],
  '.': [4, 6],
  ',': [6],
  '?': [1, 4, 5, 6],
  '!': [2, 3, 4, 6],
  ':': [1, 5, 6],
  ';': [5, 6],
  '-': [3, 6],
  '/': [3, 4],
  '(': [1, 2, 3, 5, 6],
  ')': [2, 3, 4, 5, 6],
  '"': [5],
  "'": [3],
}

const uebContractions: Record<string, number[][]> = {
  'and': [[1, 2, 3, 4, 6]],
  'for': [[1, 2, 3, 4, 5, 6]],
  'of': [[1, 2, 3, 5, 6]],
  'the': [[2, 3, 4, 6]],
  'with': [[2, 3, 4, 5, 6]],
  'ch': [[1, 6]],
  'sh': [[1, 4, 6]],
  'th': [[1, 4, 5, 6]],
  'wh': [[1, 5, 6]],
  'ou': [[1, 2, 5, 6]],
  'st': [[3, 4]],
  'ing': [[3, 4, 6]],
  'ed': [[1, 2, 4, 6]],
  'er': [[1, 2, 4, 5, 6]],
  'en': [[2, 6]],
  'in': [[3, 5]],
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

function textToBrailleGrade1(text: string): BrailleChar[] {
  const result: BrailleChar[] = []
  const lowerText = text.toLowerCase()
  
  for (let i = 0; i < lowerText.length; i++) {
    const char = lowerText[i]
    const dots = grade1Map[char]
    
    if (dots !== undefined) {
      result.push({
        char: text[i],
        dots,
        unicode: dotsToUnicode(dots)
      })
    } else if (numericMap[char]) {
      if (i === 0 || !numericMap[lowerText[i - 1]]) {
        result.push({
          char: '#',
          dots: numericIndicator,
          unicode: dotsToUnicode(numericIndicator)
        })
      }
      result.push({
        char: text[i],
        dots: numericMap[char],
        unicode: dotsToUnicode(numericMap[char])
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

function textToBrailleGrade2(text: string): BrailleChar[] {
  const result: BrailleChar[] = []
  const lowerText = text.toLowerCase()
  
  let i = 0
  while (i < lowerText.length) {
    let matched = false
    
    for (const [contraction, dotPatterns] of Object.entries(grade2Contractions)) {
      if (lowerText.substring(i, i + contraction.length) === contraction) {
        const isWordBoundary = 
          (i === 0 || lowerText[i - 1] === ' ') &&
          (i + contraction.length === lowerText.length || lowerText[i + contraction.length] === ' ')
        
        if (isWordBoundary || contraction.length <= 2) {
          for (const dots of dotPatterns) {
            result.push({
              char: contraction,
              dots,
              unicode: dotsToUnicode(dots)
            })
          }
          i += contraction.length
          matched = true
          break
        }
      }
    }
    
    if (!matched) {
      const char = lowerText[i]
      const dots = grade1Map[char]
      
      if (dots !== undefined) {
        result.push({
          char: text[i],
          dots,
          unicode: dotsToUnicode(dots)
        })
      } else if (numericMap[char]) {
        if (i === 0 || !numericMap[lowerText[i - 1]]) {
          result.push({
            char: '#',
            dots: numericIndicator,
            unicode: dotsToUnicode(numericIndicator)
          })
        }
        result.push({
          char: text[i],
          dots: numericMap[char],
          unicode: dotsToUnicode(numericMap[char])
        })
      } else {
        result.push({
          char: text[i],
          dots: [1, 2, 3, 4, 5, 6],
          unicode: '⠿'
        })
      }
      i++
    }
  }
  
  return result
}

function textToBrailleNumeric(text: string): BrailleChar[] {
  const result: BrailleChar[] = []
  let needsIndicator = true
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    
    if (char === ' ') {
      result.push({
        char: ' ',
        dots: [],
        unicode: ' '
      })
      needsIndicator = true
    } else if (numericMap[char]) {
      if (needsIndicator) {
        result.push({
          char: '#',
          dots: numericIndicator,
          unicode: dotsToUnicode(numericIndicator)
        })
        needsIndicator = false
      }
      result.push({
        char,
        dots: numericMap[char],
        unicode: dotsToUnicode(numericMap[char])
      })
    } else {
      result.push({
        char,
        dots: [1, 2, 3, 4, 5, 6],
        unicode: '⠿'
      })
      needsIndicator = true
    }
  }
  
  return result
}

function textToBrailleUEB(text: string): BrailleChar[] {
  const result: BrailleChar[] = []
  
  let i = 0
  while (i < text.length) {
    const char = text[i]
    const lowerChar = char.toLowerCase()
    const isUpperCase = char !== lowerChar && char.match(/[A-Z]/)
    
    let matched = false
    
    for (const [contraction, dotPatterns] of Object.entries(uebContractions)) {
      const substr = text.substring(i, i + contraction.length).toLowerCase()
      if (substr === contraction) {
        const isWordBoundary = 
          (i === 0 || text[i - 1] === ' ') &&
          (i + contraction.length === text.length || text[i + contraction.length] === ' ')
        
        if (isWordBoundary || contraction.length <= 2) {
          if (isUpperCase) {
            result.push({
              char: '⠠',
              dots: uebCapitalIndicator,
              unicode: dotsToUnicode(uebCapitalIndicator)
            })
          }
          
          for (const dots of dotPatterns) {
            result.push({
              char: contraction,
              dots,
              unicode: dotsToUnicode(dots)
            })
          }
          i += contraction.length
          matched = true
          break
        }
      }
    }
    
    if (!matched) {
      if (isUpperCase) {
        result.push({
          char: '⠠',
          dots: uebCapitalIndicator,
          unicode: dotsToUnicode(uebCapitalIndicator)
        })
      }
      
      const dots = uebMap[lowerChar]
      
      if (dots !== undefined) {
        result.push({
          char,
          dots,
          unicode: dotsToUnicode(dots)
        })
      } else if (numericMap[lowerChar]) {
        if (i === 0 || !numericMap[text[i - 1]]) {
          result.push({
            char: '#',
            dots: uebNumberIndicator,
            unicode: dotsToUnicode(uebNumberIndicator)
          })
        }
        result.push({
          char,
          dots: numericMap[lowerChar],
          unicode: dotsToUnicode(numericMap[lowerChar])
        })
      } else {
        result.push({
          char,
          dots: [1, 2, 3, 4, 5, 6],
          unicode: '⠿'
        })
      }
      i++
    }
  }
  
  return result
}

export function textToBraille(text: string, type: BrailleType = 'grade1'): BrailleChar[] {
  switch (type) {
    case 'grade1':
      return textToBrailleGrade1(text)
    case 'grade2':
      return textToBrailleGrade2(text)
    case 'numeric':
      return textToBrailleNumeric(text)
    case 'ueb':
      return textToBrailleUEB(text)
    default:
      return textToBrailleGrade1(text)
  }
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
  const dotSpacing = cellWidth
  const verticalSpacing = cellHeight / 2.5
  
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
