import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the base layout with a main element', () => {
    render(<App />)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('max-w-[480px]', 'mx-auto', 'px-6', 'md:px-8')
  })

  it('renders the placeholder text', () => {
    render(<App />)
    expect(screen.getByText('calorie-sugar-tracker')).toBeInTheDocument()
  })
})
