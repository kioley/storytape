import { Settings, Speech } from ".."
import { countIndents } from "../utils"
import { lineIsOption } from "../utils/checkLineType"
import { parseSpeech } from "./speech"

export function parseOptions(
  lines: string[],
  start: number,
  variables: Settings["variables"],
  normalize: boolean
): Speech[] {
  const options = []

  const indents = countIndents(lines[start])

  let line: string
  for (let i = start; i < lines.length; i++) {
    line = lines[i]
    if (countIndents(line) < indents) break
    if (!lineIsOption(line) || countIndents(line) !== indents) continue
    line = clearOption(line)
    const speech = parseSpeech(line, variables, normalize)

    options.push(speech)
  }

  return options
}

function clearOption(line: string): string {
  const prefixLength = 2
  const text = line.trim().substring(prefixLength)
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
  options: Speech[],
  lines: string[],
  index: number
): number {
  if (option == null) {
    throw new Error('[storytape] The option is not passed to the "next" method')
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
      throw new Error(`[storytape] The wrong option "${option}"`)
  }

  if (!optionText) {
    throw new Error(`[storytape] The wrong option "${option}"`)
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
    throw new Error(`[storytape] The option is not found "${option}"`)
  }

  return optionIndex
}
