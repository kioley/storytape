import { Speech, Settings } from ".."
import { evalExpression } from "../utils/evalExpression"
import {
  clearComment,
  extractInlineCondition,
  extractLineTags,
  hideEscapingChars,
  normalizeString,
  showEscapingChars,
} from "../utils"

export function parseSpeech(
  line: string,
  variables: Settings["variables"],
  normalize: boolean
): Speech {
  const speech: Speech = {
    text: "",
    name: "",
    available: true,
    tags: [],
  }
  line = clearComment(line)
  ;[line, speech.tags] = extractLineTags(line)
  line = hideEscapingChars(line)
  let condition: string | false
  ;[line, condition] = extractInlineCondition(line)

  if (condition && !evalExpression(condition, variables)) {
    speech.available = false
  }

  ;[speech.name, speech.text] = extractSpeech(line, normalize)
  return speech
}

function extractSpeech(speech: string, normalize: boolean): [string, string] {
  speech = speech.trim()
  let name = ""
  let text = speech
  const splitIndex = speech.indexOf(":")

  if (splitIndex !== -1) {
    name = speech.substring(0, splitIndex)
    text = speech.substring(splitIndex + 1)
  }

  if (text.startsWith(" ")) text = text.substring(1)
  name = showEscapingChars(name)
  text = showEscapingChars(text)
  if (normalize) {
    name = normalizeString(name)
    text = normalizeString(text)
  }

  return [name, text]
}
