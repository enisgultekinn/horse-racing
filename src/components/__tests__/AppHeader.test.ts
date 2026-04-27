import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AppHeader from '@/components/Header/AppHeader.component.vue'
import { useRaceStore } from '@/stores/race.store'
import { i18n } from '@/i18n'

function mountHeader() {
  return mount(AppHeader, {
    global: {
      plugins: [i18n],
    },
  })
}

function generateButton(wrapper: VueWrapper) {
  const buttons = wrapper.findAll('button')
  const target = buttons.find((b) => b.text() === 'Generate Race')
  if (!target) throw new Error('Generate Race button not found')
  return target
}

describe('AppHeader', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
  })

  it('renders the title and a Generate Race button', () => {
    const wrapper = mountHeader()
    expect(wrapper.text()).toContain('Horse Racing')
    expect(wrapper.text()).toContain('Generate Race')
  })

  it('triggers race generation on click', async () => {
    const wrapper = mountHeader()
    const store = useRaceStore()
    expect(store.rounds).toHaveLength(0)

    await generateButton(wrapper).trigger('click')
    expect(store.rounds.length).toBeGreaterThan(0)
  })

  it('disables the button while a round is active', async () => {
    const wrapper = mountHeader()
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    await wrapper.vm.$nextTick()
    expect(generateButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('re-enables the button once all rounds have finished', async () => {
    const wrapper = mountHeader()
    const store = useRaceStore()
    store.generateRace()
    for (const round of store.rounds) {
      round.status = 'finished'
    }
    await wrapper.vm.$nextTick()
    expect(generateButton(wrapper).attributes('disabled')).toBeUndefined()
  })
})
