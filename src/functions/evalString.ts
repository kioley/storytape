import { Pragma, Variable } from ".."

export function evalString(str: string, pragma: Pragma): Variable {
  // console.log("PRAGMA: ", pragma)

  // console.log("eval: ", str)
  const variables = pragma.variables
  for (const key in variables) {
    const variable = variables[key]
    const reg = new RegExp(`\\$${key}`, "g")
    // console.log(reg)
    str = str.replace(reg, variable.toString())
  }
  console.log("eval: ", str)

  const res = eval(str)

  console.log("eval: ", res)

  return res
}
