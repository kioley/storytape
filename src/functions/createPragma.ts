import { Pragma } from ".."

export function createPragma(pragma: Partial<Pragma> | void): Pragma {
  const _pragma: Pragma = {
    variables: {},
    functions: {},
    methods: {},
  }

  pragma && Object.assign(_pragma, pragma)

  return _pragma
}
