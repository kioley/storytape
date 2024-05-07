import { Settings } from ".."

export function createSettings(settings: Partial<Settings> | undefined | null) {
  const _settings: Settings = {
    startNode: "Start",
    ignoreTitleCase: true,
    normalizeText: true,
  }

  settings && Object.assign(_settings, settings)

  return _settings
}
