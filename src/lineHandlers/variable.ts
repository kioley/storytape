import { Pragma, Variable } from ".."
import { evalExpression } from "../utils/evalString"

export function parseVariable(str: string, pragma: Pragma): [string, Variable] {
  const reg =
    /<<(declare|set)\s+\$(?<name>\w+)\s+(?<assign>([-+*/%]?=)|to)\s+(?<expression>.*)>>/
  const groups = str.match(reg)?.groups

  if (!groups) {
    throw new Error(`[storytape] Wrong assignment string: "${str}"`)
  }

  const { name, assign, expression } = groups

  let value = expression
  if (["to", "="].indexOf(assign) === -1) {
    value = "$" + name + assign[0] + "(" + expression + ")"
  }

  const result = evalExpression(value, pragma)

  return [name, result]
}
