import { StorytapeError } from "."
import { Settings, Variable, Variables } from ".."

export function evalExpression(
  expression: string,
  variables: Settings["variables"]
): Variable {
  let evalString = expression

  const token = tryFindUnexpectedToken(evalString)
  if (token)
    throw new StorytapeError(
      `Unexpected token "${token}" in expression "${expression}"`
    )

  evalString = replaceVariables(evalString, variables)
  evalString = replaceEntries(evalString, synonyms)

  try {
    return eval(evalString)
  } catch (error) {
    const err = error as Error

    throw new StorytapeError(`${err.message} in expression "${expression}"`)
  }
}

function tryFindUnexpectedToken(expression: string): string | null {
  expression = expression.replaceAll(
    /true|false|"([^"\\]*(?:\\.[^"\\]*)*)"/g,
    ""
  )

  const forbidden1: string[] = expression.match(/^[A-Za-z_@]+/g) || []

  const forbidden2: string[] =
    expression
      .match(/[^$A-Za-z_@][A-Za-z_@]+/g)
      ?.map((token) => token.substring(1)) || []

  const forbidden = forbidden1.concat(forbidden2)

  if (!forbidden.length) return null
  for (const token of forbidden) {
    if (!(token in synonyms)) {
      return token
    }
  }
  return null
}

function replaceVariables(
  expression: string,
  variables: Settings["variables"]
): string {
  for (const key in variables) {
    let variable = variables[key]
    const reg = new RegExp(`\\$${key}\\b`, "g")

    if (typeof variable === "string") {
      variable = "'" + variable + "'"
    } else {
      variable = variable.toString()
    }

    expression = expression.replace(reg, variable)
  }
  return expression
}

function replaceEntries(expression: string, variables: Variables): string {
  for (const key in variables) {
    const variable = variables[key]
    expression = expression.replace(key, variable.toString())
  }
  return expression
}

const synonyms = {
  "==": "===",
  "!=": "!==",
  neq: "!==",
  eq: "===",
  is: "===",
  gte: ">=",
  lte: "<=",
  gt: ">",
  lt: "<",
  or: "||",
  not: "!",
  and: "&&",
}
