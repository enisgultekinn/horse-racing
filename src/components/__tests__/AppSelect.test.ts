import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSelect from '@/components/Select/AppSelect.component.vue'
import type { SelectOption } from '@/types'

const options: SelectOption[] = [
  { value: 'en', label: 'English' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'de', label: 'Deutsch' },
]

describe('AppSelect', () => {
  it('renders the selected option label in the trigger', () => {
    const wrapper = mount(AppSelect, { props: { modelValue: 'tr', options } })
    expect(wrapper.get('.select__value').text()).toBe('Türkçe')
  })

  it('falls back to the placeholder when no option matches', () => {
    const wrapper = mount(AppSelect, {
      props: { modelValue: 'xx', options, placeholder: 'Pick one' },
    })
    const value = wrapper.get('.select__value')
    expect(value.text()).toBe('Pick one')
    expect(value.classes()).toContain('select__value--placeholder')
  })

  it('defaults to medium size and applies size class from prop', () => {
    const md = mount(AppSelect, { props: { modelValue: 'en', options } })
    expect(md.classes()).toContain('select--md')

    const lg = mount(AppSelect, { props: { modelValue: 'en', options, size: 'lg' } })
    expect(lg.classes()).toContain('select--lg')
  })

  it('keeps the menu hidden initially', () => {
    const wrapper = mount(AppSelect, { props: { modelValue: 'en', options } })
    expect(wrapper.classes()).not.toContain('select--open')
    expect(wrapper.get('.select__menu').isVisible()).toBe(false)
  })

  it('toggles the menu open and closed when the trigger is clicked', async () => {
    const wrapper = mount(AppSelect, { props: { modelValue: 'en', options } })
    const trigger = wrapper.get('.select__trigger')

    await trigger.trigger('click')
    expect(wrapper.classes()).toContain('select--open')
    expect(wrapper.get('.select__menu').isVisible()).toBe(true)

    await trigger.trigger('click')
    expect(wrapper.classes()).not.toContain('select--open')
    expect(wrapper.get<HTMLElement>('.select__menu').element.style.display).toBe('none')
  })

  it('renders all options with selected state on the active value', async () => {
    const wrapper = mount(AppSelect, { props: { modelValue: 'tr', options } })
    await wrapper.get('.select__trigger').trigger('click')

    const items = wrapper.findAll('.select__option')
    expect(items).toHaveLength(options.length)
    expect(items[1]!.classes()).toContain('select__option--selected')
    expect(items[1]!.attributes('aria-selected')).toBe('true')
    expect(items[0]!.attributes('aria-selected')).toBe('false')
  })

  it('emits update:modelValue and closes the menu when an option is picked', async () => {
    const wrapper = mount(AppSelect, { props: { modelValue: 'en', options } })
    await wrapper.get('.select__trigger').trigger('click')

    await wrapper.findAll('.select__option')[2]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['de']])
    expect(wrapper.classes()).not.toContain('select--open')
  })

  it('does not open and marks itself disabled when disabled is true', async () => {
    const wrapper = mount(AppSelect, {
      props: { modelValue: 'en', options, disabled: true },
    })
    expect(wrapper.classes()).toContain('select--disabled')
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()

    await wrapper.get('.select__trigger').trigger('click')
    expect(wrapper.classes()).not.toContain('select--open')
  })

  it('closes the menu on an outside mousedown', async () => {
    const wrapper = mount(AppSelect, {
      props: { modelValue: 'en', options },
      attachTo: document.body,
    })
    await wrapper.get('.select__trigger').trigger('click')
    expect(wrapper.classes()).toContain('select--open')

    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).not.toContain('select--open')

    wrapper.unmount()
  })

  it('keeps the menu open when mousedown happens inside the component', async () => {
    const wrapper = mount(AppSelect, {
      props: { modelValue: 'en', options },
      attachTo: document.body,
    })
    await wrapper.get('.select__trigger').trigger('click')

    wrapper.get('.select__menu').element.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    )
    await wrapper.vm.$nextTick()
    expect(wrapper.classes()).toContain('select--open')

    wrapper.unmount()
  })
})
