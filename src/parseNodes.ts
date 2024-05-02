import { YarnSpinnerNode } from "."

export function parseNodes(yarnRaw: string) {
  const nodes: YarnSpinnerNode[] = []

  const nodesRaw = yarnRaw.split("\n===")

  for (const nodeRaw of nodesRaw) {
    if (!nodeRaw.trim()) continue

    const node: YarnSpinnerNode = {
      title: "",
      body: [],
    }

    const [header, body] = splitNode(nodeRaw)

    node.title = parseTitle(header)
    node.body = body.split("\n")

    nodes.push(node)
  }

  return nodes
}

function splitNode(nodeRaw: string): [headerRaw: string, bodyRaw: string] {
  if (!/---\r?\n/.test(nodeRaw)) {
    throw new SyntaxError("One of the nodes has no delimiter")
  }

  const [headerRaw, bodyRaw] = nodeRaw.split("\n---")

  if (!headerRaw.trim()) {
    throw new SyntaxError("One of the nodes has no header")
  }

  return [headerRaw, bodyRaw]
}

function parseTitle(header: string): string {
  const title = header.match(/title\s*:\s*(\w*)/i)?.[1]

  if (!title) {
    throw new SyntaxError("One of the nodes has no title")
  }

  return title
}
