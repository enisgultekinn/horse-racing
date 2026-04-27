import { describe, it, expect } from 'vitest'
import AppButton from '@/components/Button/AppButton.component.vue'
import { renderAt } from '@/__tests__/visual.helpers'

describe('AppButton (visual)', () => {
  it('primary / md', async () => {
    const { locator } = renderAt(AppButton, {
      props: { variant: 'primary', size: 'md' },
      slots: { default: 'Click me' },
    })
    await expect(locator.getByRole('button')).toMatchScreenshot('primary-md')
  })

  it('secondary / lg', async () => {
    const { locator } = renderAt(AppButton, {
      props: { variant: 'secondary', size: 'lg' },
      slots: { default: 'Generate' },
    })
    await expect(locator.getByRole('button')).toMatchScreenshot('secondary-lg')
  })

  it('disabled', async () => {
    const { locator } = renderAt(AppButton, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    })
    await expect(locator.getByRole('button')).toMatchScreenshot('disabled')
  })
})
