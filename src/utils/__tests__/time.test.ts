import { describe, it, expect } from 'vitest'
import { formatRaceTime } from '@/utils/time'

describe('formatRaceTime', () => {
  it('formats 0 ms as 00:00.000', () => {
    expect(formatRaceTime(0)).toBe('00:00.000')
  })

  it('formats sub-second durations with millisecond precision', () => {
    expect(formatRaceTime(123)).toBe('00:00.123')
  })

  it('formats sub-minute durations with seconds and ms', () => {
    expect(formatRaceTime(5_500)).toBe('00:05.500')
  })

  it('formats multi-minute durations', () => {
    // 1 minute, 5 seconds, 500 ms
    expect(formatRaceTime(65_500)).toBe('01:05.500')
  })

  it('zero-pads minutes, seconds and milliseconds', () => {
    // 1 minute, 1 second, 1 ms
    expect(formatRaceTime(61_001)).toBe('01:01.001')
  })

  it('handles minute counts >= 60 by not collapsing into hours', () => {
    // 61 minutes, 1 second, 123 ms
    expect(formatRaceTime(61 * 60_000 + 1_123)).toBe('61:01.123')
  })
})
