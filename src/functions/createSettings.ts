import { Settings } from ".."

export function createSettings(settings: Settings | void) {
  const _settings: Settings = {
    ignoreTitleCase: true,
    normalizeText: true,
  }

  settings && Object.assign(_settings, settings)

  return _settings
}
