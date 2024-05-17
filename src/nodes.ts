import { YarnSpinnerNode } from "."
import { StorytapeError } from "./utils"

export function parseNodes(yarnRaw: string) {
  const nodes: YarnSpinnerNode[] = []

  const nodesRaw = yarnRaw.split("\n===")

  for (const nodeRaw of nodesRaw) {
    if (!nodeRaw.trim()) continue

    const node: YarnSpinnerNode = {
      title: "",
      tags: [],
      body: [],
    }

    const [header, body] = splitNode(nodeRaw)

    node.title = parseTitle(header)
    node.tags = parseTags(header)
    node.body = body.split("\n")

    nodes.push(node)
  }

  return nodes
}

function splitNode(nodeRaw: string): [headerRaw: string, bodyRaw: string] {
  if (!/\r?\n---\r?\n/.test(nodeRaw)) {
    throw new StorytapeError("One of the nodes has no delimiter")
  }

  const [headerRaw, bodyRaw] = nodeRaw.split("\n---")

  if (!headerRaw.trim()) {
    throw new StorytapeError("One of the nodes has no header")
  }

  return [headerRaw, bodyRaw]
}

function parseTitle(header: string): string {
  const title = header.match(/title\s*:\s*(\w*)/i)?.[1]

  if (!title) {
    throw new StorytapeError("One of the nodes has no title")
  }

  return title
}

function parseTags(header: string): string[] {
  const tags = header
    .match(/tags\s*:\s*(.*)\s*(\n|$)/i)?.[1]
    ?.split(/\s+/)
    ?.filter((tag) => !!tag)

  if (!tags) {
    return []
  }

  return tags
}

export function findNode(
  nodes: YarnSpinnerNode[],
  title: string
): YarnSpinnerNode {
  const node = nodes.find((n) => n.title === title)

  if (!node) {
    throw new StorytapeError(`No "${title}" node is found`)
  }

  return node
}
