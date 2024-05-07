import { Pragma } from ".."
import { evalString } from "../utils/evalString"
import {
  clearCommentAndId,
  extractInlineCondition,
  hideEscapingChars,
  showEscapingChars,
} from "../utils"

export function parseSpeech(
  line: string,
  pragma: Pragma
): [string, string] | false {
  line = hideEscapingChars(line)
  line = clearCommentAndId(line)
  const [speech, condition] = extractInlineCondition(line)

  if (condition && !evalString(condition, pragma)) {
    return false
  }

  return extractSpeech(speech)
}

function extractSpeech(speech: string): [string, string] {
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

  return [name, text]
}
