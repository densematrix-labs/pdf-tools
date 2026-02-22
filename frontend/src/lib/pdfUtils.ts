import { PDFDocument } from 'pdf-lib'

/**
 * Compress a PDF file by reducing image quality and removing unnecessary data
 */
export async function compressPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
  
  // Remove metadata to reduce size
  pdfDoc.setTitle('')
  pdfDoc.setAuthor('')
  pdfDoc.setSubject('')
  pdfDoc.setKeywords([])
  pdfDoc.setCreator('')
  pdfDoc.setProducer('')
  
  // Serialize with compression
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  })
  
  return new Blob([compressedBytes], { type: 'application/pdf' })
}

/**
 * Merge multiple PDF files into one
 */
export async function mergePdfs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create()
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach(page => mergedPdf.addPage(page))
  }
  
  const mergedBytes = await mergedPdf.save()
  return new Blob([mergedBytes], { type: 'application/pdf' })
}

/**
 * Convert PDF to Word (via backend API)
 */
export async function convertPdfToWord(file: File): Promise<Blob> {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/v1/convert/pdf-to-word', {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const errorMessage = typeof data.detail === 'string' 
      ? data.detail 
      : data.detail?.error || data.detail?.message || 'Conversion failed'
    throw new Error(errorMessage)
  }
  
  return await response.blob()
}

/**
 * Convert Word to PDF (via backend API)
 */
export async function convertWordToPdf(file: File): Promise<Blob> {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/v1/convert/word-to-pdf', {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const errorMessage = typeof data.detail === 'string' 
      ? data.detail 
      : data.detail?.error || data.detail?.message || 'Conversion failed'
    throw new Error(errorMessage)
  }
  
  return await response.blob()
}

/**
 * Convert images to PDF
 */
export async function convertImagesToPdf(files: File[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    let image
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(uint8Array)
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(uint8Array)
    } else {
      // For other formats, try as PNG first, then JPEG
      try {
        image = await pdfDoc.embedPng(uint8Array)
      } catch {
        image = await pdfDoc.embedJpg(uint8Array)
      }
    }
    
    const page = pdfDoc.addPage([image.width, image.height])
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    })
  }
  
  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
