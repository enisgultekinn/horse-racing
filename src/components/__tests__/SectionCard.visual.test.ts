import { describe, it, expect } from 'vitest'
import SectionCard from '@/components/Cards/SectionCard.component.vue'
import { renderAt } from '@/__tests__/visual.helpers'

describe('SectionCard (visual)', () => {
  it('renders title and slot body', async () => {
    const { locator } = renderAt(SectionCard, {
      props: { title: 'Race Program' },
      slots: {
        default: '<div style="height: 200px; background: #f1f5f9;">slot content</div>',
      },
      hostStyle: { width: '320px', height: '280px' },
    })
    await expect(locator).toMatchScreenshot('default')
  })
})
