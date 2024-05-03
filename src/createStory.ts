import { Pragma, Settings, Tape, YarnSpinnerNode } from "."
import { createPragma } from "./functions/createPragma"
import { createSettings } from "./functions/createSettings"
import { parseNodes } from "./parsing/parseNodes"
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

export function createStory(
  yarnSpinnerScriptString: string,
  pragma?: Partial<Pragma>,
  settings?: Settings
): [Tape, (option?: number | string) => void] {
  const _pragma = createPragma(pragma)
  const _settings = createSettings(settings)
  const normalize = _settings.normalizeText

  const nodes = parseNodes(yarnSpinnerScriptString)
  let body = getNode(nodes, "start").body

  let index = -1

  const state: Tape = {
    variables: _pragma.variables,
    type: "speech",
    speech: {
      name: "",
      text: "",
    },
    options: [""],
  }

  function next(option?: string | number): void {
    if (state.type === "options" && !option) {
      throw new Error(
        'storytape: The option is not passed to the "next" method'
      )
    }

    let line: string

    while (index < body.length) {
      index++
      line = body[index]
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
        continue
      } else {
        state.type = "speech"
        ;[state.speech.name, state.speech.text] = parseSpeech(line).map((s) =>
          normalizeString(s, normalize)
        )
        break
      }
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
