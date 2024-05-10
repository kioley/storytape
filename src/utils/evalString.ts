import { Settings, Variable, Variables } from ".."

export function evalExpression(
  expression: string,
  variables: Settings["variables"]
): Variable {
  let result = expression
  try {
    checkForbidden(result)
  } catch (error) {
    const err = error as Error

    throw new Error(`[storytape] ${err.message} in expression "${expression}"`)
  }
  result = replaceVariables(result, variables)
  result = replaceEntries(result, synonyms)

  try {
    return eval(result)
  } catch (error) {
    const err = error as Error

    throw new Error(`[storytape] ${err.message} in expression "${expression}"`)
  }
}

function checkForbidden(expression: string): void {
  expression = expression.replaceAll('\\"', "")
  expression = expression.replaceAll(/true|false|"[^"]*"/g, "")

  const word = expression.match(/[A-Za-z]+/)?.[0]
  if (word) {
    throw new Error(`Unexpected token "${word}"`)
  }
}

function replaceVariables(
  expression: string,
  variables: Settings["variables"]
): string {
  console.log("🚀 ~ checkForbidden ~ expression:", [expression])
  for (const key in variables) {
    let variable = variables[key]
    const reg = new RegExp(`\\$${key}\\b`, "g")

    if (typeof variable === "string") {
      variable = '"' + variable + '"'
    } else {
      variable = variable.toString()
    }

    expression = expression.replace(reg, variable)
  }
  console.log("🚀 ~ checkForbidden ~ expression:", [expression])
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
