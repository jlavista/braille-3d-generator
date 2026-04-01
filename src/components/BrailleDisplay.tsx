import { BrailleChar } from '@/lib/braille'

interface BrailleDisplayProps {
  brailleChars: BrailleChar[]
}

export function BrailleDisplay({ brailleChars }: BrailleDisplayProps) {
  return (
    <div className="font-mono text-2xl tracking-[0.5em] text-primary select-all">
      {brailleChars.length > 0 ? (
        brailleChars.map((bc, idx) => <span key={idx}>{bc.unicode}</span>)
      ) : (
        <span className="text-muted-foreground italic font-sans text-base tracking-normal">
          Enter text to see braille translation
        </span>
      )}
    </div>
  )
}
