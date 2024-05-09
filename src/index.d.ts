export interface Settings {
  startNode: string
  ignoreTitleCase: boolean
  normalizeText: boolean
  variables: Variables
  functions: { [key: string]: (...args: string[]) => Variable }
  methods: { [key: string]: (...args: string[]) => void }
}

export interface Tape {
  dialogue: {
    type: "speech" | "options" | "end"
    speech: TapeSpeech
    options: TapeOption[]
  }
  variables: Variables
  node: {
    title: string
    tags: string[]
    line: number
  }
}

export type Variable = string | number | boolean

export interface Variables {
  [key: string]: Variable
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
  tags: string[]
  body: string[]
}

export type lineType =
  | "speech"
  | "option"
  | "if"
  | "variable"
  | "jump"
  | "command"
  | "empty"
  | "comment"
