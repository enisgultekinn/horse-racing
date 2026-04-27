import { describe, it, expect } from 'vitest'
import EmptyList from '@/components/List/EmptyList.component.vue'
import { renderAt } from '@/__tests__/visual.helpers'

describe('EmptyList (visual)', () => {
  it('default message', async () => {
    const { locator } = renderAt(EmptyList)
    await expect(locator.getByText('No data')).toMatchScreenshot('default')
  })

  it('custom message', async () => {
    const message = 'No races scheduled yet'
    const { locator } = renderAt(EmptyList, { props: { message } })
    await expect(locator.getByText(message)).toMatchScreenshot('custom-message')
  })
})
