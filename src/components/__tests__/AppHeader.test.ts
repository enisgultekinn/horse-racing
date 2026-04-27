import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AppHeader from '@/components/Header/AppHeader.component.vue'
import { useRaceStore } from '@/stores/race.store'

describe('AppHeader', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the title and a Generate Race button', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.text()).toContain('Horse Racing')
    expect(wrapper.text()).toContain('Generate Race')
  })

  it('triggers race generation on click', async () => {
    const wrapper = mount(AppHeader)
    const store = useRaceStore()
    expect(store.rounds).toHaveLength(0)

    await wrapper.get('button').trigger('click')
    expect(store.rounds.length).toBeGreaterThan(0)
  })

  it('disables the button while a round is active', async () => {
    const wrapper = mount(AppHeader)
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    await wrapper.vm.$nextTick()
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('re-enables the button once all rounds have finished', async () => {
    const wrapper = mount(AppHeader)
    const store = useRaceStore()
    store.generateRace()
    for (const round of store.rounds) {
      round.status = 'finished'
    }
    await wrapper.vm.$nextTick()
    expect(wrapper.get('button').attributes('disabled')).toBeUndefined()
  })
})
