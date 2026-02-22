import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import FileDropzone from '../components/FileDropzone'
import LanguageSwitcher from '../components/LanguageSwitcher'

// Wrapper component for router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('FileDropzone', () => {
  it('renders dropzone with correct text', () => {
    const onFilesAdded = vi.fn()
    render(<FileDropzone onFilesAdded={onFilesAdded} />)
    
    expect(screen.getByTestId('file-dropzone')).toBeInTheDocument()
    expect(screen.getByText('dropzone.drag')).toBeInTheDocument()
  })

  it('calls onFilesAdded when files are dropped', async () => {
    const onFilesAdded = vi.fn()
    render(<FileDropzone onFilesAdded={onFilesAdded} />)
    
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByTestId('file-input')
    
    Object.defineProperty(input, 'files', {
      value: [file],
    })
    
    fireEvent.change(input)
    
    // Allow for async processing
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(onFilesAdded).toHaveBeenCalled()
  })

  it('disables dropzone when disabled prop is true', () => {
    const onFilesAdded = vi.fn()
    render(<FileDropzone onFilesAdded={onFilesAdded} disabled={true} />)
    
    const dropzone = screen.getByTestId('file-dropzone')
    expect(dropzone).toHaveClass('opacity-50')
  })
})

describe('LanguageSwitcher', () => {
  it('renders language switcher', () => {
    render(<LanguageSwitcher />, { wrapper: RouterWrapper })
    
    expect(screen.getByTestId('lang-switcher')).toBeInTheDocument()
  })

  it('opens dropdown on click', () => {
    render(<LanguageSwitcher />, { wrapper: RouterWrapper })
    
    const button = screen.getByRole('button', { name: /select language/i })
    fireEvent.click(button)
    
    // Check that all languages are visible
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('中文')).toBeInTheDocument()
    expect(screen.getByText('日本語')).toBeInTheDocument()
  })
})
