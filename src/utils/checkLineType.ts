export function lineIsEmpty(str: string) {
  return !str.trim()
}

export function lineIsComment(str: string) {
  return /^\s*\/\//.test(str)
}

export function lineIsOption(str: string) {
  return /^\s*->/.test(str)
}

export function lineIsIfBlockStart(str: string) {
  return /^\s*<<if/.test(str)
}

export function lineIsVariable(str: string) {
  return /^\s*<<(declare|set)/.test(str)
}

export function lineIsJump(str: string) {
  return /^\s*<<jump/.test(str)
}

export function lineIsCommand(str: string) {
  return /^\s*<</.test(str)
}
