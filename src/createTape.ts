import { Pragma, Settings, Tape } from "."
import { createPragma } from "./utils/createPragma"
import { createSettings } from "./utils/createSettings"
import {
  findOptionIndex,
  parseOptions,
  skipOptions,
} from "./lineHandlers/options"

import {
  lineIsCommand,
  lineIsComment,
  lineIsElse,
  lineIsElseIf,
  lineIsEmpty,
  lineIsIfBlockStart,
  lineIsJump,
  lineIsOption,
  lineIsVariable,
} from "./utils/checkLineType"
import { countIndents, normalizeString } from "./utils"
import { getNode, parseNodes } from "./nodes"
import { parseVariable } from "./lineHandlers/variable"
import { parseSpeech } from "./lineHandlers/speech"
import { getEndifIndex, handleIf } from "./lineHandlers/ifBlock"

export function createTape(
  yarnSpinnerScriptString: string,
  pragma?: Partial<Pragma> | null,
  settings?: Partial<Settings>
): [Tape, (option?: number | string) => void] {
  const _pragma = createPragma(pragma)
  const _settings = createSettings(settings)
  const normalize = _settings.normalizeText

  const nodes = parseNodes(yarnSpinnerScriptString)
  const startNode = getNode(nodes, _settings.startNode)
  const lines = startNode.body

  const state: Tape = {
    type: "speech",
    speech: {
      name: "",
      text: "",
    },
    options: [],
    variables: _pragma.variables,
    node: startNode.title,
    line: 0,
  }

  function next(option?: string | number): void {
    if (state.type === "options") {
      state.line = findOptionIndex(option, state.options, lines, state.line)
      state.options = []
    }

    let line: string

    while (++state.line < lines.length) {
      line = lines[state.line]

      if (lineIsEmpty(line) || lineIsComment(line)) continue

      if (lineIsElseIf(line) || lineIsElse(line)) {
        state.line = getEndifIndex(lines, state.line)
      }

      if (lineIsIfBlockStart(line)) {
        state.line = handleIf(lines, state.line, _pragma)
        continue
      } else if (lineIsVariable(line)) {
        const [name, value] = parseVariable(line, _pragma)
        _pragma.variables[name] = value
      } else if (lineIsJump(line)) {
        continue
      } else if (lineIsCommand(line)) {
        continue
      } else if (lineIsOption(line)) {
        const indents = countIndents(line)
        if (indents < countIndents(lines[state.line - 1])) {
          state.line = skipOptions(lines, state.line + 1, indents)
          continue
        }
        state.type = "options"
        state.options = parseOptions(lines, state.line, _pragma)
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
    if (state.line >= lines.length) {
      state.type = "end"
    }
  }
  next()
  return [state, next]
}
