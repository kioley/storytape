import { Pragma } from ".."

export function createPragma(
  pragma: Partial<Pragma> | undefined | null
): Pragma {
  const _pragma: Pragma = {
    variables: {},
    functions: {},
    methods: {},
  }

  pragma && Object.assign(_pragma, pragma)

  return _pragma
}
