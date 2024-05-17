import { Settings, Variable } from ".."
import { StorytapeError } from "../utils"
import { evalExpression } from "../utils/evalExpression"

export function parseVariable(
  str: string,
  variables: Settings["variables"]
): [string, Variable] {
  const reg =
    /<<(declare|set)\s+\$(?<name>\w+)\s+(?<assign>([-+*/%]?=)|to)\s+(?<expression>.*)>>/
  const groups = str.match(reg)?.groups

  if (!groups) {
    throw new StorytapeError(`Wrong assignment string: "${str}"`)
  }

  const { name, assign, expression } = groups

  let value = expression
  if (["to", "="].indexOf(assign) === -1) {
    value = "$" + name + assign[0] + "(" + expression + ")"
  }

  const result = evalExpression(value, variables)

  return [name, result]
}
