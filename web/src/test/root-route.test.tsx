import { describe, expect, it } from 'vitest'
import { Route } from '../routes/__root'

describe('root route', () => {
  it('defines a root component so child routes can render through an Outlet', () => {
    expect(Route.options.component).toBeTypeOf('function')
  })

  it('suppresses hydration warnings on body when external extensions inject attributes', () => {
    const rootElement = Route.options.component?.()

    expect(rootElement).toBeDefined()
    expect(rootElement?.type).toBeTypeOf('function')

    const documentElement = (rootElement!.type as (props: {
      children: React.ReactNode
    }) => React.ReactElement)(rootElement!.props)

    const documentChildren = documentElement.props.children as React.ReactNode[]
    const bodyElement = documentChildren[1] as React.ReactElement<{
      suppressHydrationWarning?: boolean
    }>

    expect(bodyElement.type).toBe('body')
    expect(bodyElement.props.suppressHydrationWarning).toBe(true)
  })
})
