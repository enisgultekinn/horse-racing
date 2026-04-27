import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from '@/components/Button/AppButton.component.vue'

describe('AppButton', () => {
  it('renders its slot content', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toBe('Click me')
  })

  it('defaults to a primary, medium, button-typed element', () => {
    const wrapper = mount(AppButton)
    const btn = wrapper.get('button')
    expect(btn.classes()).toContain('button--primary')
    expect(btn.classes()).toContain('button--md')
    expect(btn.attributes('type')).toBe('button')
    expect(btn.attributes('disabled')).toBeUndefined()
  })

  it('applies the variant and size classes from props', () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'secondary', size: 'lg' },
    })
    expect(wrapper.classes()).toContain('button--secondary')
    expect(wrapper.classes()).toContain('button--lg')
  })

  it('forwards the disabled prop to the underlying button', () => {
    const wrapper = mount(AppButton, { props: { disabled: true } })
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('emits native click events when clicked', async () => {
    const wrapper = mount(AppButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
