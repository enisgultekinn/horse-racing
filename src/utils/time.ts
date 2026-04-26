export function formatRaceTime(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)
  const ms = Math.floor(durationMs % 1000)

  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  const mmm = String(ms).padStart(3, '0')

  return `${mm}:${ss}.${mmm}`
}
