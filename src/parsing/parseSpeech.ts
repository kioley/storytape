import {
  extractCondition,
  clearID,
  hideEscapingChars,
  showEscapingChars,
  clearComment,
} from "../utils/strings"

export function parseSpeech(line: string): [string, string] {
  line = hideEscapingChars(line)
  line = clearComment(line)
  line = clearID(line)
  const [speech, condition] = extractCondition(line)

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
