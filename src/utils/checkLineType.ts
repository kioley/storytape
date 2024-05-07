export function lineIsEmpty(str: string) {
  return !str.trim()
}

export function lineIsComment(str: string) {
  return /^\s*\/\//.test(str)
}

export function lineIsOption(str: string) {
  return /^\s*->/.test(str)
}

export function lineIsVariable(str: string) {
  return /^\s*<<\s*(declare|set)/.test(str)
}

export function lineIsJump(str: string) {
  return /^\s*<<\s*jump/.test(str)
}

export function lineIsCommand(str: string) {
  return /^\s*<</.test(str)
}

export function lineIsIfBlockStart(str: string) {
  return /^\s*<<\s*if/.test(str)
}

export function lineIsElseIf(str: string) {
  return /^\s*<<\s*elseif/.test(str)
}

export function lineIsElse(str: string) {
  return /^\s*<<\s*else/.test(str)
}

export function lineIsEndif(str: string) {
  return /^\s*<<\s*endif\s*>>/.test(str)
}
