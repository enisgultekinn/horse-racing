import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RaceLaneItem from '@/components/Item/RaceLaneItem.component.vue'
import { useRaceStore } from '@/stores/race.store'
import { i18n } from '@/i18n'
import type { RaceHorse } from '@/types'

const baseHorse: RaceHorse = {
  _id: 1,
  name: 'Thunder Bolt',
  color: '#b71c1c',
  condition: 80,
  duration: 5000,
  easing: 'linear',
  finished: false,
}

function mountLane(overrides: Partial<{
  isRunning: boolean
  isPaused: boolean
  isFinished: boolean
}> = {}) {
  return mount(RaceLaneItem, {
    props: {
      horse: baseHorse,
      roundId: 'round-1',
      index: 0,
      isRunning: false,
      isPaused: false,
      isFinished: false,
      ...overrides,
    },
    global: {
      plugins: [i18n],
    },
  })
}

describe('RaceLaneItem', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows a 1-based lane number based on the index', () => {
    const wrapper = mountLane()
    expect(wrapper.get('.race-lane__number').text()).toBe('1')
  })

  it('does not apply the running class while idle', () => {
    const wrapper = mountLane()
    expect(wrapper.get('.race-lane__horse').classes()).not.toContain(
      'race-lane__horse--running',
    )
  })

  it('applies the running class while the round is running', () => {
    const wrapper = mountLane({ isRunning: true })
    expect(wrapper.get('.race-lane__horse').classes()).toContain(
      'race-lane__horse--running',
    )
  })

  it('applies both running and paused classes when paused', () => {
    const wrapper = mountLane({ isPaused: true })
    const classes = wrapper.get('.race-lane__horse').classes()
    expect(classes).toContain('race-lane__horse--running')
    expect(classes).toContain('race-lane__horse--paused')
  })

  it('keeps the running class after the round finishes so the horse stays at the finish line', () => {
    const wrapper = mountLane({ isFinished: true })
    expect(wrapper.get('.race-lane__horse').classes()).toContain(
      'race-lane__horse--running',
    )
  })

  it('exposes the horse duration and easing as CSS custom properties', () => {
    const wrapper = mountLane({ isRunning: true })
    const style = wrapper.get('.race-lane__horse').attributes('style') ?? ''
    expect(style).toContain('--horse-duration: 5000ms')
    expect(style).toContain('--horse-easing: linear')
  })

  it('marks the horse as finished in the store on animationend', async () => {
    setActivePinia(createPinia())
    const store = useRaceStore()
    store.generateRace()
    const round = store.currentRound!
    const target = round.horses[0]!

    const wrapper = mount(RaceLaneItem, {
      props: {
        horse: target,
        roundId: round._id,
        index: 0,
        isRunning: true,
        isPaused: false,
        isFinished: false,
      },
      global: {
        plugins: [i18n],
      },
    })

    await wrapper.get('.race-lane__horse').trigger('animationend')
    expect(target.finished).toBe(true)
    expect(round.results).toContain(target._id)
  })
})
