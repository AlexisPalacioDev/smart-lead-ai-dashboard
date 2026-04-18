import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AppShell } from '../components/app-shell/app-shell'

/**
 * -__root.test.tsx
 * Verifies the shell exposes the three approved top-level routes.
 * Uses a lightweight mocked `Link` so assertions stay focused on labels.
 */

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
  }: {
    children: React.ReactNode
    to: string
  }) => <a href={to}>{children}</a>,
}))

describe('AppShell', () => {
  it('renders the three approved top-level routes', () => {
    render(<AppShell />)

    expect(
      screen.getByRole('link', { name: /dashboard/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /leads directory/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /ai summary/i }),
    ).toBeInTheDocument()
  })
})
