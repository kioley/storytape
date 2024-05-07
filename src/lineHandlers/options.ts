import { Pragma, TapeOption } from ".."
import { evalString } from "../utils/evalString"
import {
  clearCommentAndId,
  extractInlineCondition,
  countIndents,
} from "../utils"
import { lineIsOption } from "../utils/checkLineType"

export function parseOptions(
  lines: string[],
  start: number,
  pragma: Pragma
): TapeOption[] {
  const options = []

  const indents = countIndents(lines[start])

  let line: string
  for (let i = start; i < lines.length; i++) {
    line = lines[i]
    if (countIndents(line) < indents) break
    if (!lineIsOption(line) || countIndents(line) !== indents) continue
    line = clearCommentAndId(line)
    line = extractOptionText(line)
    const [text, condition] = extractInlineCondition(line)

    const option: TapeOption = {
      text: text,
      available: true,
    }

    if (condition && !evalString(condition, pragma)) {
      option.available = false
    }

    options.push(option)
  }

  return options
}

function extractOptionText(option: string): string {
  const prefixLength = 2
  const text = option.trim().substring(prefixLength)
  return text
}

export function skipOptions(lines: string[], start: number, indents: number) {
  let nextIndex = lines.length
  for (let i = start; i < lines.length; i++) {
    if (countIndents(lines[i]) >= indents && !lineIsOption(lines[i])) {
      nextIndex = i
    }
  }
  return nextIndex
}

export function findOptionIndex(
  option: string | number | undefined,
  options: TapeOption[],
  lines: string[],
  index: number
): number {
  if (option == null) {
    throw new Error('storytape: The option is not passed to the "next" method')
  }

  let optionText: string | undefined
  switch (typeof option) {
    case "string":
      optionText = options.find((o) => o.text === option)?.text
      break
    case "number":
      optionText = options[option].text
      break
    default:
      throw new Error(`storytape: The wrong option "${option}"`)
  }

  if (!optionText) {
    throw new Error(`storytape: The wrong option "${option}"`)
  }

  const indents = countIndents(lines[index])

  let line: string
  let optionIndex: number | undefined
  for (let i = index; i < lines.length; i++) {
    line = lines[i]
    if (countIndents(line) < indents) break
    if (!lineIsOption(line) || countIndents(line) !== indents) continue
    if (line.includes(optionText)) {
      optionIndex = i
    }
  }

  if (!optionIndex) {
    throw new Error(`storytape: The option is not found "${option}"`)
  }

  return optionIndex
}
