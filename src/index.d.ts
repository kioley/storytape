export interface Settings {
  ignoreTitleCase: boolean
  normalizeText: boolean
}

export interface Tape {
  variables: { [key: string]: Variable }
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

export interface Pragma {
  variables: { [key: string]: Variable }
  functions: { [key: string]: (...args: string[]) => Variable }
  methods: { [key: string]: (...args: string[]) => void }
}

export type Variable = string | number | boolean
