import { describe, it, expect, vi, afterEach } from 'vitest'
import { shuffle } from '@/utils/array'

describe('shuffle', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns an array with the same length', () => {
    const input = [1, 2, 3, 4, 5]
    expect(shuffle(input)).toHaveLength(input.length)
  })

  it('preserves all original elements', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    expect(result.slice().sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5])
  })

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5]
    const snapshot = [...input]
    shuffle(input)
    expect(input).toEqual(snapshot)
  })

  it('handles empty arrays', () => {
    expect(shuffle([])).toEqual([])
  })

  it('handles single-element arrays', () => {
    expect(shuffle([42])).toEqual([42])
  })

  it('produces a different order than the input given a non-trivial random sequence', () => {
    // Force Math.random to always pick the first index, which guarantees swaps.
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input)
    expect(result).not.toEqual(input)
  })
})
