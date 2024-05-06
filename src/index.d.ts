export interface Settings {
  ignoreTitleCase: boolean
  normalizeText: boolean
  initialState: object
}

export interface Tape {
  type: "speech" | "options" | "end"
  speech: TapeSpeech
  options: TapeOption[]
  variables: { [key: string]: Variable }
  node: string
  line: number
}

export interface TapeSpeech {
  name: string
  text: string
}

interface TapeOption {
  text: string
  available: boolean
}

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

export type lineType =
  | "speech"
  | "option"
  | "if"
  | "variable"
  | "jump"
  | "command"
  | "empty"
  | "comment"
