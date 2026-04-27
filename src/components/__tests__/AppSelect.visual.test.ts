import { describe, it, expect } from 'vitest'
import AppSelect from '@/components/Select/AppSelect.component.vue'
import type { SelectOption } from '@/types'
import { renderAt } from '@/__tests__/visual.helpers'

const options: SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'de', label: 'Deutsch' },
]

const hostStyle = { width: '240px', padding: '24px' }

describe('AppSelect (visual)', () => {
  it('closed / md', async () => {
    const { locator } = renderAt(AppSelect, {
      props: { modelValue: 'en', options },
      hostStyle,
    })
    await expect(locator).toMatchScreenshot('closed-md')
  })

  it('placeholder', async () => {
    const { locator } = renderAt(AppSelect, {
      props: { modelValue: 'xx', options, placeholder: 'Select language' },
      hostStyle,
    })
    await expect(locator).toMatchScreenshot('placeholder')
  })

  it('disabled', async () => {
    const { locator } = renderAt(AppSelect, {
      props: { modelValue: 'en', options, disabled: true },
      hostStyle,
    })
    await expect(locator).toMatchScreenshot('disabled')
  })

  it('open with selection / md', async () => {
    const { locator } = renderAt(AppSelect, {
      props: { modelValue: 'tr', options },
      hostStyle: { ...hostStyle, paddingBottom: '180px' },
    })
    await locator.getByRole('button').click()
    await expect(locator).toMatchScreenshot('open-md')
  })

  it('size sm', async () => {
    const { locator } = renderAt(AppSelect, {
      props: { modelValue: 'en', options, size: 'sm' },
      hostStyle,
    })
    await expect(locator).toMatchScreenshot('closed-sm')
  })

  it('size lg', async () => {
    const { locator } = renderAt(AppSelect, {
      props: { modelValue: 'en', options, size: 'lg' },
      hostStyle,
    })
    await expect(locator).toMatchScreenshot('closed-lg')
  })
})
