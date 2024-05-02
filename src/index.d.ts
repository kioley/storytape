export interface Settings {
  ignoreTitleCase?: bolean
  normalizeText?: boolean
}

export interface Tape {
  type: "speech" | "options" | "end"
  speech: TapeSpeech
  options: TapeOptions
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
