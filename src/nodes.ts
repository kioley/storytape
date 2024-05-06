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
  // console.log("nodeRaw: ", [nodeRaw])

  if (!/\r?\n---\r?\n/.test(nodeRaw)) {
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

export function getNode(
  nodes: YarnSpinnerNode[],
  title: string
): YarnSpinnerNode {
  const startNode = nodes.find(
    (n) => n.title.toLowerCase() === title.toLowerCase()
  )

  if (!startNode) {
    throw new Error("storytape: No start node is found")
  }

  return startNode
}