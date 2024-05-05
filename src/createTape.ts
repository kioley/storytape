import { Pragma, Settings, Tape, YarnSpinnerNode } from "."
import { createPragma } from "./functions/createPragma"
import { createSettings } from "./functions/createSettings"
import { parseNodes } from "./parsing/parseNodes"
import { parseOptions, Option } from "./parsing/parseOptions"
import { parseSpeech } from "./parsing/parseSpeech"
import { parseVariable } from "./parsing/parseVariable"
import {
  lineIsCommand,
  lineIsComment,
  lineIsEmpty,
  lineIsIfBlockStart,
  lineIsJump,
  lineIsOption,
  lineIsVariable,
} from "./utils"
import { normalizeString } from "./utils/strings"

export function createTape(
  yarnSpinnerScriptString: string,
  pragma?: Partial<Pragma> | null,
  settings?: Partial<Settings>
): [Tape, (option?: number | string) => void] {
  const _pragma = createPragma(pragma)
  const _settings = createSettings(settings)
  const normalize = _settings.normalizeText

  const nodes = parseNodes(yarnSpinnerScriptString)
  let strings = getNode(nodes, "start").body
  let currentOptions: Option[]

  let index = -1

  let state: Tape = {
    variables: _pragma.variables,
    type: "speech",
    speech: {
      name: "",
      text: "",
    },
    options: [],
  }
  state = Object.assign(_settings.initialState, state)

  function next(option?: string | number): void {
    if (state.type === "options") {
      const [start1, end1, start2] = getOptionIndexes(option, currentOptions)
      strings = strings.slice(start1, end1).concat(strings.slice(start2))
      index = -1
    }

    let line: string

    while (++index < strings.length) {
      line = strings[index]
      if (lineIsEmpty(line) || lineIsComment(line)) continue

      if (lineIsIfBlockStart(line)) {
        continue
      } else if (lineIsVariable(line)) {
        const [name, value] = parseVariable(line, _pragma)
        _pragma.variables[name] = value
      } else if (lineIsJump(line)) {
        continue
      } else if (lineIsCommand(line)) {
        continue
      } else if (lineIsOption(line)) {
        state.type = "options"
        currentOptions = parseOptions(strings, index, _pragma)
        currentOptions.forEach((option) =>
          state.options.push({
            text: normalizeString(option.text, _settings.normalizeText),
            available: option.available,
          })
        )
        // console.log("🚀 ~ next ~ currentOptions:", currentOptions)
        // console.log("🚀 ~ next ~ options:", state.options)
        break
      } else {
        const speech = parseSpeech(line, _pragma)
        if (!speech) continue
        state.type = "speech"
        ;[state.speech.name, state.speech.text] = speech.map((s) =>
          normalizeString(s, normalize)
        )
        break
      }
    }
    if (index === strings.length) {
      state.type = "end"
    }
  }

  return [state, next]
}

function getNode(nodes: YarnSpinnerNode[], title: string): YarnSpinnerNode {
  const startNode = nodes.find(
    (n) => n.title.toLowerCase() === title.toLowerCase()
  )

  if (!startNode) {
    throw new Error("storytape: No start node is found")
  }

  return startNode
}

function getOptionIndexes(
  option: string | number | undefined,
  options: Option[]
): [number, number, number] {
  if (!option) {
    throw new Error('storytape: The option is not passed to the "next" method')
  }

  let currentOption: Option | undefined
  switch (typeof option) {
    case "string":
      currentOption = options.find((o) => o.text === option)
      break
    case "number":
      currentOption = options[option]
      break
    default:
      throw new Error(`storytape: The wrong option "${option}"`)
  }

  if (!currentOption) {
    throw new Error(`storytape: The wrong option "${option}"`)
  }

  return [
    currentOption.start,
    currentOption.end,
    options[options.length - 1].end,
  ]
}
