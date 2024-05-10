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
    speech: Speech
    options: Speech[]
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

export interface Speech {
  name: string
  text: string
  available: boolean
  tags: string[]
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
