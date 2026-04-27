import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyList from '@/components/List/EmptyList.component.vue'

describe('EmptyList', () => {
  it('renders the provided message', () => {
    const wrapper = mount(EmptyList, { props: { message: 'Nothing here yet' } })
    expect(wrapper.text()).toBe('Nothing here yet')
  })

  it('falls back to a default message when none is provided', () => {
    const wrapper = mount(EmptyList)
    expect(wrapper.text()).toBe('No data')
  })
})
