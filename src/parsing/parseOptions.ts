import { Pragma } from ".."
import { evalString } from "../functions/evalString"
import { countIndents, lineIsOption } from "../utils"
import { clearCommentAndId, extractCondition } from "../utils/strings"

export function parseOptions(
  strings: string[],
  start: number,
  pragma: Pragma
): Option[] {
  const options = []

  const indents = countIndents(strings[start])

  let str: string
  for (let i = start; i < strings.length; i++) {
    str = strings[i]
    // console.log("🚀 ~ str:", str)
    if (!lineIsOption(str) || countIndents(str) < indents) break
    const option = parseOption(strings, i, indents, pragma)
    if (!option) continue
    options.push(option)
    // console.log("🚀 ~ i:", i)
    i = option.end - 1
    // console.log("🚀 ~ i:", i)
    // console.log("🚀 ~ i:", strings[i])
  }

  return options
}

export interface Option {
  text: string
  available: boolean
  start: number
  end: number
}

function parseOption(
  strings: string[],
  start: number,
  indents: number,
  pragma: Pragma
): Option {
  let str = strings[start]
  start++
  str = clearCommentAndId(str)
  str = extractOptionText(str)
  const [text, condition] = extractCondition(str)

  const option: Option = {
    text: text,
    available: true,
    start: start,
    end: strings.length - 1,
  }

  if (condition && !evalString(condition, pragma)) {
    option.available = false
  }

  for (let index = start; index < strings.length; index++) {
    str = strings[index]
    if (countIndents(str) <= indents) {
      option.end = index
      break
    }
  }

  return option
}

export function extractOptionText(option: string): string {
  const prefixLength = 2
  const text = option.trim().substring(prefixLength)
  return text
}
