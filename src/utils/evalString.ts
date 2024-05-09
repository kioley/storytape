import { Settings, Variable, Variables } from ".."

export function evalExpression(
  expression: string,
  variables: Settings["variables"]
): Variable {
  let result = expression
  result = replaceVariables(result, variables)
  result = replaceEntries(result, synonyms)

  try {
    checkForbidden(result)
    return eval(result)
  } catch (error) {
    const err = error as Error

    throw new Error(`[storytape] ${err.message} in expression "${expression}"`)
  }
}

function checkForbidden(expression: string): void {
  for (const substr of expression.split(/true|false/)) {
    const word = substr.match(/[A-Za-z]+/)?.[0]
    if (word) {
      throw new Error(`Unexpected token "${word}"`)
    }
  }
}

function replaceVariables(
  expression: string,
  variables: Settings["variables"]
): string {
  for (const key in variables) {
    const variable = variables[key]
    const reg = new RegExp(`\\$${key}\\b`, "g")
    expression = expression.replace(reg, variable.toString())
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
