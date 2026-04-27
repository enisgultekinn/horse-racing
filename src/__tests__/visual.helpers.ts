import type { Component } from 'vue'
import { mount, type ComponentMountingOptions } from '@vue/test-utils'
import { page } from 'vitest/browser'

let hostCounter = 0

export function renderAt<C extends Component>(
  component: C,
  options: ComponentMountingOptions<C> & { hostStyle?: Partial<CSSStyleDeclaration> } = {},
) {
  const { hostStyle, ...mountOptions } = options
  const host = document.createElement('div')
  const hostId = `visual-host-${hostCounter++}`
  host.setAttribute('data-testid', hostId)
  if (hostStyle) Object.assign(host.style, hostStyle)
  document.body.appendChild(host)
  mount(component, { ...mountOptions, attachTo: host })
  return { host, locator: page.getByTestId(hostId) }
}
