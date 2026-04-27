import { describe, it, expect, vi, afterEach } from 'vitest'
import { getRaceHorses } from '@/utils/race'
import { RACE_EASINGS } from '@/constants/race.constants'
import type { Horse } from '@/types'

const horse = (id: number, condition: number): Horse => ({
  _id: id,
  name: `Horse ${id}`,
  color: '#000',
  condition,
})

describe('getRaceHorses', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns one race horse per input horse', () => {
    const result = getRaceHorses([horse(1, 50), horse(2, 75)], 1200)
    expect(result).toHaveLength(2)
  })

  it('preserves base horse fields and adds race-specific fields', () => {
    // Pin Math.random so duration/easing are deterministic.
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const [first] = getRaceHorses([horse(1, 50)], 1200)

    expect(first).toBeDefined()
    expect(first!._id).toBe(1)
    expect(first!.name).toBe('Horse 1')
    expect(first!.condition).toBe(50)
    expect(first!.finished).toBe(false)
    expect(typeof first!.duration).toBe('number')
    expect(first!.duration).toBeGreaterThan(0)
    expect(RACE_EASINGS).toContain(first!.easing)
  })

  it('gives a higher-condition horse a shorter duration than a lower-condition horse', () => {
    // Cancel out the luck factor and easing randomness by pinning Math.random.
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const [slow] = getRaceHorses([horse(1, 1)], 1200)
    const [fast] = getRaceHorses([horse(2, 100)], 1200)
    expect(fast!.duration).toBeLessThan(slow!.duration)
  })

  it('produces longer durations for longer distances at the same condition', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const [shortRace] = getRaceHorses([horse(1, 50)], 1200)
    const [longRace] = getRaceHorses([horse(1, 50)], 2200)
    expect(longRace!.duration).toBeGreaterThan(shortRace!.duration)
  })

  it('returns an empty array for empty input', () => {
    expect(getRaceHorses([], 1200)).toEqual([])
  })
})
