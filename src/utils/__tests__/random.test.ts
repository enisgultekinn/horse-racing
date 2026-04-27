import { describe, it, expect, vi, afterEach } from 'vitest'
import { randomInt } from '@/utils/random'

describe('randomInt', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the only possible value when min equals max', () => {
    expect(randomInt(7, 7)).toBe(7)
  })

  it('returns min when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(randomInt(1, 100)).toBe(1)
  })

  it('returns max when Math.random returns just under 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999999)
    expect(randomInt(1, 100)).toBe(100)
  })

  it('always returns a value within [min, max] across many samples', () => {
    for (let i = 0; i < 500; i++) {
      const v = randomInt(1, 100)
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(100)
      expect(Number.isInteger(v)).toBe(true)
    }
  })
})
