import { Pragma, Variable } from ".."

export function evalString(str: string, pragma: Pragma): Variable {
  const variables = pragma.variables
  for (const key in variables) {
    const variable = variables[key]
    const reg = new RegExp(`\\$${key}`, "g")
    str = str.replace(reg, variable.toString())
  }

  const res = eval(str)

  return res
}
