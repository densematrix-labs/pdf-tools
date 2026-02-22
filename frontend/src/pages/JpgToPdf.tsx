import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import FileDropzone from '../components/FileDropzone'
import { convertImagesToPdf, downloadBlob } from '../lib/pdfUtils'

interface ImageFile {
  file: File
  id: string
  preview: string
}

export default function JpgToPdf() {
  const { t } = useTranslation()
  const [images, setImages] = useState<ImageFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)

  const handleFilesAdded = useCallback((files: File[]) => {
    const newImages = files.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
    }))
    setImages(prev => [...prev, ...newImages])
    setResult(null)
  }, [])

  const handleConvert = async () => {
    if (images.length === 0) return
    
    setIsProcessing(true)
    try {
      const imageFiles = images.map(img => img.file)
      const pdf = await convertImagesToPdf(imageFiles)
      setResult(pdf)
    } catch (error) {
      console.error('Conversion failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadBlob(result, 'images.pdf')
    }
  }

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const toRemove = prev.find(img => img.id === id)
      if (toRemove) {
        URL.revokeObjectURL(toRemove.preview)
      }
      return prev.filter(img => img.id !== id)
    })
    setResult(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-surface-900 mb-4">
          {t('tools.jpgToPdf.name')}
        </h1>
        <p className="text-surface-800/70 max-w-xl mx-auto">
          {t('tools.jpgToPdf.longDesc')}
        </p>
      </div>

      <FileDropzone
        onFilesAdded={handleFilesAdded}
        accept={{
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/png': ['.png'],
          'image/gif': ['.gif'],
          'image/webp': ['.webp'],
        }}
        multiple={true}
        disabled={isProcessing}
        className="mb-8"
      />

      {images.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-lg">{t('common.files')} ({images.length})</h2>
            <div className="flex gap-2">
              {result && (
                <button onClick={handleDownload} className="btn-primary" data-testid="download-btn">
                  {t('common.download')}
                </button>
              )}
              {!result && (
                <button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className="btn-primary disabled:opacity-50"
                >
                  {isProcessing ? t('common.processing') : t('tools.jpgToPdf.action')}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map(img => (
              <div key={img.id} className="relative group" data-testid="image-item">
                <img
                  src={img.preview}
                  alt={img.file.name}
                  className="w-full h-32 object-cover rounded-lg border border-surface-200"
                />
                <button
                  onClick={() => handleRemoveImage(img.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <p className="text-xs text-surface-800/60 mt-1 truncate">{img.file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-16 prose prose-slate max-w-none">
        <h2 className="font-display">{t('tools.jpgToPdf.seoTitle')}</h2>
        <p>{t('tools.jpgToPdf.seoContent')}</p>
      </div>
    </div>
  )
}
