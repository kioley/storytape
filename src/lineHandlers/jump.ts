import { StorytapeError } from "../utils"

export function extractJumpNodeTitle(line: string): string {
  const title = line.match(/<<jump (.*)>>/)?.[1]
  if (!title) {
    throw new StorytapeError(`"${line}"`)
  }
  return title
}
