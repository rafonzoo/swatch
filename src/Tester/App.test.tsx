import { render, screen } from '@testing-library/react'
import App from 'Pages/App'

test('renders learn react link', () => {
  render(<App />)
  const linkElement = screen.getByText(/hell/i)
  expect(linkElement).toBeInTheDocument()
})
