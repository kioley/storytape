import { Settings } from ".."
import { StorytapeError } from "../utils"
import {
  lineIsElse,
  lineIsElseIf,
  lineIsEndif,
  lineIsIfBlockStart,
} from "../utils/checkLineType"
import { evalExpression } from "../utils/evalExpression"

export function handleIf(
  lines: string[],
  start: number,
  variables: Settings["variables"]
): number {
  if (checkCondition(lines[start], variables)) {
    return start
  }
  const endifIndex = getEndifIndex(lines, start + 1)
  for (let i = start + 1; i < endifIndex; i++) {
    const line = lines[i]
    if (lineIsIfBlockStart(line)) {
      i = getEndifIndex(lines, i) + 1
      continue
    }
    if (lineIsElse(line)) {
      return i
    }
    if (lineIsElseIf(line) && checkCondition(lines[i], variables)) {
      return i
    }
  }
  return endifIndex
}

export function getEndifIndex(lines: string[], start: number): number {
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]
    if (lineIsIfBlockStart(line)) {
      i = getEndifIndex(lines, i) + 1
      continue
    }
    if (lineIsEndif(line)) {
      return i
    }
  }
  throw new StorytapeError(
    `The "<<endif>>" operator was not found "${lines[start]}"`
  )
}

function checkCondition(
  str: string,
  variables: Settings["variables"]
): boolean {
  const condition = str.match(/<<\s*(else\s*)?if(.+)>>/)?.[2]
  if (!condition) {
    throw new StorytapeError(
      `[storytape] The condition cannot be resolved "${str}"`
    )
  }

  return !!evalExpression(condition, variables)
}
