import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRaceStore } from '@/stores/race.store'
import { HORSES_PER_ROUND, RACE_DISTANCES } from '@/constants/race.constants'

describe('race store — generateRace', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with no rounds', () => {
    const store = useRaceStore()
    expect(store.rounds).toEqual([])
    expect(store.currentRound).toBeUndefined()
  })

  it('generates one round per configured distance', () => {
    const store = useRaceStore()
    store.generateRace()
    expect(store.rounds).toHaveLength(RACE_DISTANCES.length)
  })

  it('orders rounds by the configured distance sequence', () => {
    const store = useRaceStore()
    store.generateRace()
    expect(store.rounds.map((r) => r.distance)).toEqual([...RACE_DISTANCES])
  })

  it('numbers rounds starting from 1', () => {
    const store = useRaceStore()
    store.generateRace()
    expect(store.rounds.map((r) => r.round)).toEqual(RACE_DISTANCES.map((_, i) => i + 1))
  })

  it('puts exactly HORSES_PER_ROUND horses in each round', () => {
    const store = useRaceStore()
    store.generateRace()
    for (const round of store.rounds) {
      expect(round.horses).toHaveLength(HORSES_PER_ROUND)
    }
  })

  it('initializes every round as idle with empty results', () => {
    const store = useRaceStore()
    store.generateRace()
    for (const round of store.rounds) {
      expect(round.status).toBe('idle')
      expect(round.results).toEqual([])
    }
  })

  it('resets currentRoundIndex to 0', () => {
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    store.rounds[0]!.horses.forEach((h) => store.markHorseFinished(h._id, store.rounds[0]!._id))
    store.nextRound()
    expect(store.currentRoundIndex).toBe(1)
    store.pauseRound()

    store.generateRace()
    expect(store.currentRoundIndex).toBe(0)
  })

  it('does not regenerate while a round is running', () => {
    const store = useRaceStore()
    store.generateRace()
    const firstRoundsRef = store.rounds
    store.startRound()
    store.generateRace()
    expect(store.rounds).toBe(firstRoundsRef)
  })

  it('regenerates when the current round is paused', () => {
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    store.pauseRound()
    const firstRoundsRef = store.rounds
    store.generateRace()
    expect(store.rounds).not.toBe(firstRoundsRef)
  })
})

describe('race store — round lifecycle', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('startRound transitions idle → running', () => {
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    expect(store.currentRound!.status).toBe('running')
  })

  it('pauseRound transitions running → paused', () => {
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    store.pauseRound()
    expect(store.currentRound!.status).toBe('paused')
  })

  it('startRound resumes from paused → running', () => {
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    store.pauseRound()
    store.startRound()
    expect(store.currentRound!.status).toBe('running')
  })

  it('pauseRound is a no-op when round is idle', () => {
    const store = useRaceStore()
    store.generateRace()
    store.pauseRound()
    expect(store.currentRound!.status).toBe('idle')
  })

  it('pauseRound is a no-op when round is finished', () => {
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    const round = store.currentRound!
    round.horses.forEach((h) => store.markHorseFinished(h._id, round._id))
    expect(round.status).toBe('finished')
    store.pauseRound()
    expect(round.status).toBe('finished')
  })

  it('startRound does nothing when there are no rounds', () => {
    const store = useRaceStore()
    expect(() => store.startRound()).not.toThrow()
    expect(store.currentRound).toBeUndefined()
  })
})

describe('race store — markHorseFinished', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('marks the horse as finished and records its id in results', () => {
    const store = useRaceStore()
    store.generateRace()
    const round = store.currentRound!
    const [first] = round.horses
    store.markHorseFinished(first!._id, round._id)
    expect(first!.finished).toBe(true)
    expect(round.results).toEqual([first!._id])
  })

  it('preserves finishing order across multiple horses', () => {
    const store = useRaceStore()
    store.generateRace()
    const round = store.currentRound!
    const [a, b, c] = round.horses
    store.markHorseFinished(b!._id, round._id)
    store.markHorseFinished(c!._id, round._id)
    store.markHorseFinished(a!._id, round._id)
    expect(round.results.slice(0, 3)).toEqual([b!._id, c!._id, a!._id])
  })

  it('ignores duplicate finishes for the same horse', () => {
    const store = useRaceStore()
    store.generateRace()
    const round = store.currentRound!
    const [first] = round.horses
    store.markHorseFinished(first!._id, round._id)
    store.markHorseFinished(first!._id, round._id)
    expect(round.results.filter((id) => id === first!._id)).toHaveLength(1)
  })

  it('flips round status to finished only after every horse finishes', () => {
    const store = useRaceStore()
    store.generateRace()
    const round = store.currentRound!
    store.startRound()
    const horses = [...round.horses]
    for (let i = 0; i < horses.length - 1; i++) {
      store.markHorseFinished(horses[i]!._id, round._id)
      expect(round.status).toBe('running')
    }
    store.markHorseFinished(horses[horses.length - 1]!._id, round._id)
    expect(round.status).toBe('finished')
  })

  it('ignores unknown round ids', () => {
    const store = useRaceStore()
    store.generateRace()
    const round = store.currentRound!
    const [first] = round.horses
    store.markHorseFinished(first!._id, 'does-not-exist')
    expect(first!.finished).toBe(false)
    expect(round.results).toEqual([])
  })

  it('ignores unknown horse ids', () => {
    const store = useRaceStore()
    store.generateRace()
    const round = store.currentRound!
    store.markHorseFinished(99_999, round._id)
    expect(round.results).toEqual([])
  })
})

describe('race store — nextRound', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function finishCurrentRound(store: ReturnType<typeof useRaceStore>) {
    const round = store.currentRound!
    store.startRound()
    round.horses.forEach((h) => store.markHorseFinished(h._id, round._id))
  }

  it('advances to the next round and starts it running', () => {
    const store = useRaceStore()
    store.generateRace()
    finishCurrentRound(store)
    store.nextRound()
    expect(store.currentRoundIndex).toBe(1)
    expect(store.currentRound!.status).toBe('running')
  })

  it('is a no-op when current round is not finished', () => {
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    store.nextRound()
    expect(store.currentRoundIndex).toBe(0)
  })

  it('does not advance past the last round', () => {
    const store = useRaceStore()
    store.generateRace()
    for (let i = 0; i < store.rounds.length; i++) {
      finishCurrentRound(store)
      store.nextRound()
    }
    expect(store.currentRoundIndex).toBe(store.rounds.length - 1)
    expect(store.rounds.every((r) => r.status === 'finished')).toBe(true)
  })
})

describe('race store — status flags', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('all flags are false before any race is generated', () => {
    const store = useRaceStore()
    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(false)
    expect(store.isFinished).toBe(false)
    expect(store.isRaceFinished).toBe(false)
  })

  it('all per-round flags are false when the current round is idle', () => {
    const store = useRaceStore()
    store.generateRace()
    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(false)
    expect(store.isFinished).toBe(false)
  })

  it('isRunning is true while a round is running', () => {
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    expect(store.isRunning).toBe(true)
    expect(store.isPaused).toBe(false)
    expect(store.isFinished).toBe(false)
  })

  it('isPaused is true while a round is paused', () => {
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    store.pauseRound()
    expect(store.isPaused).toBe(true)
    expect(store.isRunning).toBe(false)
    expect(store.isFinished).toBe(false)
  })

  it('isFinished is true once every horse in the current round has finished', () => {
    const store = useRaceStore()
    store.generateRace()
    const round = store.currentRound!
    store.startRound()
    round.horses.forEach((h) => store.markHorseFinished(h._id, round._id))
    expect(store.isFinished).toBe(true)
    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(false)
  })

  it('isRaceFinished is false until every round is finished', () => {
    const store = useRaceStore()
    store.generateRace()
    expect(store.isRaceFinished).toBe(false)

    for (let i = 0; i < store.rounds.length - 1; i++) {
      const round = store.currentRound!
      store.startRound()
      round.horses.forEach((h) => store.markHorseFinished(h._id, round._id))
      expect(store.isRaceFinished).toBe(false)
      store.nextRound()
    }

    const lastRound = store.currentRound!
    store.startRound()
    lastRound.horses.forEach((h) => store.markHorseFinished(h._id, lastRound._id))
    expect(store.isRaceFinished).toBe(true)
  })
})
