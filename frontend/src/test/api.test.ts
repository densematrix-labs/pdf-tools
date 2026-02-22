import { describe, it, expect, vi, beforeEach } from 'vitest'
import { convertPdfToWord, convertWordToPdf } from '../lib/pdfUtils'

describe('API error handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('convertPdfToWord', () => {
    it('handles string error detail', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ detail: 'Something went wrong' }),
      })

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      await expect(convertPdfToWord(file)).rejects.toThrow('Something went wrong')
    })

    it('handles object error detail with error field', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 402,
        json: () => Promise.resolve({
          detail: { error: 'Payment required', code: 'payment_required' },
        }),
      })

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      
      try {
        await convertPdfToWord(file)
        expect.fail('Should have thrown')
      } catch (e: any) {
        expect(e.message).toBe('Payment required')
        expect(e.message).not.toContain('[object Object]')
      }
    })

    it('handles object error detail with message field', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          detail: { message: 'Invalid input' },
        }),
      })

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      await expect(convertPdfToWord(file)).rejects.toThrow('Invalid input')
    })

    it('returns blob on success', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      })

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const result = await convertPdfToWord(file)
      
      expect(result).toBeInstanceOf(Blob)
    })
  })

  describe('convertWordToPdf', () => {
    it('handles string error detail', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ detail: 'Conversion failed' }),
      })

      const file = new File(['test'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      await expect(convertWordToPdf(file)).rejects.toThrow('Conversion failed')
    })

    it('returns blob on success', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' })
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      })

      const file = new File(['test'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      const result = await convertWordToPdf(file)
      
      expect(result).toBeInstanceOf(Blob)
    })
  })
})
