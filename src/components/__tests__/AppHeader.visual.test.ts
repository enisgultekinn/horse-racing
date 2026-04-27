import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import AppHeader from '@/components/Header/AppHeader.component.vue'
import { useRaceStore } from '@/stores/race.store'
import type { RaceRound } from '@/types'
import { renderAt } from '@/__tests__/visual.helpers'

const headerHostStyle = { width: '960px' }

function makeRound(status: RaceRound['status']): RaceRound {
  return {
    _id: 'fixture-round',
    round: 1,
    distance: 1200,
    status,
    results: [],
    horses: [],
  }
}

describe('AppHeader (visual)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('idle (no race generated)', async () => {
    const { locator } = renderAt(AppHeader, { hostStyle: headerHostStyle })
    await expect(locator.getByRole('banner')).toMatchScreenshot('idle')
  })

  it('running (generate button disabled)', async () => {
    const race = useRaceStore()
    race.rounds = [makeRound('running')]
    const { locator } = renderAt(AppHeader, { hostStyle: headerHostStyle })
    await expect(locator.getByRole('banner')).toMatchScreenshot('running')
  })
})
