import { Pragma } from ".."
import { evalString } from "../functions/evalString"
import {
  extractCondition,
  clearID,
  hideEscapingChars,
  showEscapingChars,
  clearComment,
} from "../utils/strings"

export function parseSpeech(
  line: string,
  pragma: Pragma
): [string, string] | false {
  line = hideEscapingChars(line)
  line = clearComment(line)
  line = clearID(line)
  const [speech, condition] = extractCondition(line)

  if (condition && !evalString(condition, pragma)) {
    return false
  }

  // const [name, text] = extractSpeech(speech)
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
