import { Settings, Tape, Variables } from "."
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
import { StorytapeError, countIndents } from "./utils"
import { findNode, parseNodes } from "./nodes"
import { parseVariable } from "./lineHandlers/variable"
import { parseSpeech } from "./lineHandlers/speech"
import { getEndifIndex, handleIf } from "./lineHandlers/ifBlock"
import { extractJumpNodeTitle } from "./lineHandlers/jump"

export function createTape(
  story: string,
  settings?: Partial<Settings> | null
): [Tape, (option?: number | string) => void] {
  const _settings = createSettings(settings)

  const nodes = parseNodes(story)
  let node = findNode(nodes, _settings.startNode)

  let state = createInitialState(
    _settings.startNode,
    node.tags,
    _settings.variables
  )

  function next(option?: string | number): void {
    if (state.dialogue.type === "end") {
      return
    }

    if (node.title !== state.node.title) {
      node = findNode(nodes, state.node.title)
    }

    let lines = node.body

    if (state.dialogue.type === "options") {
      if (option == null) {
        throw new StorytapeError(
          'The option is not passed to the "next" method'
        )
      }
      state.node.line = findOptionIndex(
        option,
        state.dialogue.options,
        lines,
        state.node.line
      )
      state.dialogue.options = []
    }

    const normalize = _settings.normalizeText

    while (++state.node.line < lines.length) {
      const line = lines[state.node.line]

      if (lineIsEmpty(line) || lineIsComment(line)) continue

      if (lineIsElseIf(line) || lineIsElse(line)) {
        state.node.line = getEndifIndex(lines, state.node.line)
      }

      if (lineIsIfBlockStart(line)) {
        state.node.line = handleIf(lines, state.node.line, state.variables)
        continue
      } else if (lineIsVariable(line)) {
        const [name, value] = parseVariable(line, state.variables)
        state.variables[name] = value
      } else if (lineIsJump(line)) {
        node = findNode(nodes, extractJumpNodeTitle(line))
        lines = node.body

        Object.assign(
          state,
          createInitialState(node.title, node.tags, state.variables)
        )
        continue
      } else if (lineIsCommand(line)) {
        continue
      } else if (lineIsOption(line)) {
        const indents = countIndents(line)
        if (indents < countIndents(lines[state.node.line - 1])) {
          state.node.line = skipOptions(lines, state.node.line + 1, indents)
          continue
        }
        state.dialogue.type = "options"
        state.dialogue.options = parseOptions(
          lines,
          state.node.line,
          state.variables,
          normalize
        )
        break
      } else {
        state.dialogue.type = "speech"
        state.dialogue.speech = parseSpeech(line, state.variables, normalize)
        break
      }
    }

    if (state.node.line >= lines.length) {
      state.dialogue.type = "end"
    }
  }
  next()
  return [state, next]
}

function createInitialState(
  nodeTitle: string,
  tags: string[],
  variables: Variables
): Tape {
  const state: Tape = {
    dialogue: {
      type: "speech",
      speech: {
        name: "",
        text: "",
        available: true,
        tags: [],
      },
      options: [],
    },
    variables,
    node: {
      title: nodeTitle,
      tags,
      line: 0,
    },
  }

  return state
}
