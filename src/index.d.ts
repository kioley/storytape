export interface Tape {
  type: "speech" | "options" | "end"
  speech: TapeSpeech
  options: TapeOptions
  next: () => void
  choiceOption: (value: string | number) => void
}

export interface TapeSpeech {
  name: string
  text: string
}

export type TapeOptions = string[]

export interface YarnSpinnerNode {
  title: string
  body: string[]
}
