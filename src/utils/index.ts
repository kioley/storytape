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

export function countIndents(str: string) {
  return str.match(/^\s+/)?.[0].length || 0
}

export function normalizeString(str: string): string {
  return str.trim().replace(/\s+/g, " ")
}

export function extractLineTags(str: string): [string, string[]] {
  const [line, ...tags] = str
    .split(" #")
    .map((tag) => tag.trim())
    .filter((tag) => !!tag)

  return [line, tags]
}

export function clearComment(str: string): string {
  return str.split(" //")[0]
}

export function extractInlineCondition(str: string): [string, string | false] {
  const matches = str.match(/<<\s*if(.+)>>/)

  if (!matches?.length) {
    return [str, false]
  }

  str = str.replace(matches?.[0], "")

  const condition = matches?.[1]

  return [str, condition]
}

export class StorytapeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "StorytapeError"
  }
}
