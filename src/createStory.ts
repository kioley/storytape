import { Tape, YarnSpinnerNode } from "."
import { parseNodes } from "./parseNodes"
import { parseSpeech } from "./parseSpeech"
import {
  lineIsCommand,
  lineIsComment,
  lineIsEmpty,
  lineIsIfBlockStart,
  lineIsJump,
  lineIsOption,
  lineIsVariable,
} from "./utils"

export function createStory(
  yarnSpinnerScriptString: string
): [Tape, (option?: number | string) => void] {
  const nodes = parseNodes(yarnSpinnerScriptString)
  let body = getNode(nodes, "start").body

  let index = -1

  // let options: TapeOptions
  // let speech: TapeSpeech
  const state: Tape = {
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
        continue
      } else if (lineIsJump(line)) {
        continue
      } else if (lineIsCommand(line)) {
        continue
      } else if (lineIsOption(line)) {
        continue
      } else {
        state.type = "speech"
        ;[state.speech.name, state.speech.text] = parseSpeech(line)
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
