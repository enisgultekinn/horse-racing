import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHorseStore } from '@/stores/horse.store'
import { HORSES } from '@/constants/horse.constants'

describe('horse store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with an empty horse list', () => {
    const store = useHorseStore()
    expect(store.horses).toEqual([])
  })

  it('generates exactly the configured roster size', () => {
    const store = useHorseStore()
    store.generateHorses()
    expect(store.horses).toHaveLength(HORSES.length)
  })

  it('assigns each horse a condition between 1 and 100', () => {
    const store = useHorseStore()
    store.generateHorses()
    for (const h of store.horses) {
      expect(h.condition).toBeGreaterThanOrEqual(1)
      expect(h.condition).toBeLessThanOrEqual(100)
      expect(Number.isInteger(h.condition)).toBe(true)
    }
  })

  it('assigns unique ids and unique colors to every horse', () => {
    const store = useHorseStore()
    store.generateHorses()
    const ids = store.horses.map((h) => h._id)
    const colors = store.horses.map((h) => h.color)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(colors).size).toBe(colors.length)
  })

  it('replaces the list on regenerate (no accumulation)', () => {
    const store = useHorseStore()
    store.generateHorses()
    const firstSize = store.horses.length
    store.generateHorses()
    expect(store.horses).toHaveLength(firstSize)
  })

  it('uses every horse from the constants roster', () => {
    const store = useHorseStore()
    store.generateHorses()
    const names = store.horses.map((h) => h.name).sort()
    const expected = HORSES.map((h) => h.name).sort()
    expect(names).toEqual(expected)
  })
})
