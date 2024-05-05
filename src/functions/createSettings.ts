import { Settings } from ".."

export function createSettings(settings: Partial<Settings> | undefined | null) {
  const _settings: Settings = {
    ignoreTitleCase: true,
    normalizeText: true,
    initialState: {},
  }

  settings && Object.assign(_settings, settings)

  return _settings
}
