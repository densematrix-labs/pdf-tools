import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock pdf-lib
vi.mock('pdf-lib', () => ({
  PDFDocument: {
    create: vi.fn().mockResolvedValue({
      addPage: vi.fn().mockReturnValue({
        drawImage: vi.fn(),
      }),
      copyPages: vi.fn().mockResolvedValue([{}]),
      getPageIndices: vi.fn().mockReturnValue([0]),
      embedJpg: vi.fn().mockResolvedValue({ width: 100, height: 100 }),
      embedPng: vi.fn().mockResolvedValue({ width: 100, height: 100 }),
      save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    }),
    load: vi.fn().mockResolvedValue({
      setTitle: vi.fn(),
      setAuthor: vi.fn(),
      setSubject: vi.fn(),
      setKeywords: vi.fn(),
      setCreator: vi.fn(),
      setProducer: vi.fn(),
      copyPages: vi.fn().mockResolvedValue([{}]),
      getPageIndices: vi.fn().mockReturnValue([0]),
      save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    }),
  },
}))

// Import after mocking
import { compressPdf, mergePdfs, convertImagesToPdf, downloadBlob } from '../lib/pdfUtils'

describe('pdfUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('compressPdf', () => {
    it('compresses a PDF file', async () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const result = await compressPdf(file)
      
      expect(result).toBeInstanceOf(Blob)
      expect(result.type).toBe('application/pdf')
    })
  })

  describe('mergePdfs', () => {
    it('merges multiple PDF files', async () => {
      const files = [
        new File(['test1'], 'test1.pdf', { type: 'application/pdf' }),
        new File(['test2'], 'test2.pdf', { type: 'application/pdf' }),
      ]
      const result = await mergePdfs(files)
      
      expect(result).toBeInstanceOf(Blob)
      expect(result.type).toBe('application/pdf')
    })
  })

  describe('convertImagesToPdf', () => {
    it('converts images to PDF', async () => {
      const files = [
        new File(['img1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['img2'], 'test2.png', { type: 'image/png' }),
      ]
      const result = await convertImagesToPdf(files)
      
      expect(result).toBeInstanceOf(Blob)
      expect(result.type).toBe('application/pdf')
    })
  })

  describe('downloadBlob', () => {
    it('triggers download with correct filename', () => {
      const mockClick = vi.fn()
      const mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any)
      const mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any)
      
      vi.spyOn(document, 'createElement').mockReturnValue({
        click: mockClick,
        href: '',
        download: '',
      } as any)

      const blob = new Blob(['test'], { type: 'application/pdf' })
      downloadBlob(blob, 'test.pdf')

      expect(mockClick).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
    })
  })
})
