import { _settings } from "../settings"

const escapingChars = {
  "\\": "L34KLFdfg3",
  "#": "jt5437teWY",
  "/": "kdf8438hjf",
  "[": "asLS8345KL",
  "]": "fsdkgDf768",
  ">": "dK48fkK20G",
  "<": "F7gi8f3Jk0",
  ":": "Af0AS9f0sQ",
}

export function normalizeString(str: string): string {
  return _settings.normalizeText ? str.trim().replace(/\s+/g, " ") : str
}

export function clearID(str: string): string {
  return str.split("#")[0]
}

export function clearComment(str: string): string {
  return str.split("//")[0]
}

export function extractCondition(str: string): [string, string] {
  const reg = str.match(/(<<if(.+)>>)\s*$/)

  if (!reg?.length) {
    return [str, ""]
  }

  str = str.replace(reg?.[1], "")

  const condition = reg?.[2]

  return [str, condition]
}

export function hideEscapingChars(str: string) {
  for (const [k, v] of Object.entries(escapingChars)) {
    str = str.replaceAll("\\" + k, v)
    if (k === ":") {
      str = str.replaceAll("/" + k, v)
    }
  }
  return str
}

export function showEscapingChars(str: string) {
  for (const [k, v] of Object.entries(escapingChars)) {
    str = str.replaceAll(v, k)
  }
  return str
}
