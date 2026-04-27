import { describe, it, expect, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CurrentRaceSection from '@/components/Sections/CurrentRaceSection.component.vue'
import RaceLaneItem from '@/components/Item/RaceLaneItem.component.vue'
import EmptyList from '@/components/List/EmptyList.component.vue'
import { useRaceStore } from '@/stores/race.store'
import { i18n } from '@/i18n'
import { HORSES_PER_ROUND } from '@/constants/race.constants'

function mountSection() {
  return mount(CurrentRaceSection, {
    global: {
      plugins: [i18n],
    },
  })
}

function actionButton(wrapper: VueWrapper) {
  const button = wrapper.find('button')
  if (!button.exists()) throw new Error('Action button not found')
  return button
}

describe('CurrentRaceSection', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
  })

  it('renders the empty state when there is no current round', () => {
    const wrapper = mountSection()
    expect(wrapper.findComponent(EmptyList).exists()).toBe(true)
    expect(wrapper.text()).toContain(
      "No race in progress. You can start a new race by clicking the 'Generate Race' button.",
    )
  })

  it('renders round info and a lane per horse once a race is generated', () => {
    const store = useRaceStore()
    store.generateRace()
    const wrapper = mountSection()

    expect(wrapper.findComponent(EmptyList).exists()).toBe(false)
    expect(wrapper.text()).toContain(`1 / ${store.rounds.length}`)
    expect(wrapper.text()).toContain(`${store.currentRound!.distance}m`)
    expect(wrapper.text()).toContain(`${HORSES_PER_ROUND} / ${HORSES_PER_ROUND}`)

    const lanes = wrapper.findAllComponents(RaceLaneItem)
    expect(lanes).toHaveLength(store.currentRound!.horses.length)
  })

  it('shows the Start label while idle and starts the round on click', async () => {
    const store = useRaceStore()
    store.generateRace()
    const wrapper = mountSection()

    const button = actionButton(wrapper)
    expect(button.text()).toBe('Start')

    await button.trigger('click')
    expect(store.isRunning).toBe(true)
  })

  it('shows the Pause label while running and pauses the round on click', async () => {
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    const wrapper = mountSection()

    const button = actionButton(wrapper)
    expect(button.text()).toBe('Pause')

    await button.trigger('click')
    expect(store.isPaused).toBe(true)
  })

  it('shows the Resume label while paused and resumes the round on click', async () => {
    const store = useRaceStore()
    store.generateRace()
    store.startRound()
    store.pauseRound()
    const wrapper = mountSection()

    const button = actionButton(wrapper)
    expect(button.text()).toBe('Resume')

    await button.trigger('click')
    expect(store.isRunning).toBe(true)
  })

  it('shows the Next Round label when the round is finished and advances on click', async () => {
    const store = useRaceStore()
    store.generateRace()
    store.rounds[0]!.status = 'finished'
    const wrapper = mountSection()

    const button = actionButton(wrapper)
    expect(button.text()).toBe('Next Round')

    await button.trigger('click')
    expect(store.currentRoundIndex).toBe(1)
    expect(store.isRunning).toBe(true)
  })

  it('shows the Finished label and disables the button once every round is finished', async () => {
    const store = useRaceStore()
    store.generateRace()
    for (const round of store.rounds) {
      round.status = 'finished'
    }
    store.currentRoundIndex = store.rounds.length - 1
    const wrapper = mountSection()
    await wrapper.vm.$nextTick()

    const button = actionButton(wrapper)
    expect(button.text()).toBe('Finished')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('reflects the current round index as it advances', async () => {
    const store = useRaceStore()
    store.generateRace()
    const wrapper = mountSection()

    expect(wrapper.text()).toContain(`1 / ${store.rounds.length}`)

    store.rounds[0]!.status = 'finished'
    store.nextRound()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain(`2 / ${store.rounds.length}`)
  })
})
