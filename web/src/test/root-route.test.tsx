import { describe, expect, it } from 'vitest'
import { DocumentFrame, Route } from '../routes/__root'

describe('root route', () => {
  it('defines a root component so child routes can render through an Outlet', () => {
    expect(Route.options.component).toBeTypeOf('function')
  })

  it('suppresses hydration warnings on body when external extensions inject attributes', () => {
    const documentElement = DocumentFrame({
      children: <div>content</div>,
    })

    const documentChildren = documentElement.props.children as React.ReactNode[]
    const bodyElement = documentChildren[1] as React.ReactElement<{
      suppressHydrationWarning?: boolean
    }>

    expect(bodyElement.type).toBe('body')
    expect(bodyElement.props.suppressHydrationWarning).toBe(true)
  })
})
