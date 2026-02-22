import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import FileDropzone from '../components/FileDropzone'
import { mergePdfs, downloadBlob } from '../lib/pdfUtils'

interface FileItem {
  file: File
  id: string
}

export default function MergePdf() {
  const { t } = useTranslation()
  const [files, setFiles] = useState<FileItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<Blob | null>(null)

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    const fileItems = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
    }))
    setFiles(prev => [...prev, ...fileItems])
    setResult(null)
  }, [])

  const handleMerge = async () => {
    if (files.length < 2) return
    
    setIsProcessing(true)
    try {
      const pdfFiles = files.map(f => f.file)
      const merged = await mergePdfs(pdfFiles)
      setResult(merged)
    } catch (error) {
      console.error('Merge failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadBlob(result, 'merged.pdf')
    }
  }

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    setResult(null)
  }

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= files.length) return
    
    const newFiles = [...files]
    ;[newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]]
    setFiles(newFiles)
    setResult(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-surface-900 mb-4">
          {t('tools.merge.name')}
        </h1>
        <p className="text-surface-800/70 max-w-xl mx-auto">
          {t('tools.merge.longDesc')}
        </p>
      </div>

      <FileDropzone
        onFilesAdded={handleFilesAdded}
        multiple={true}
        disabled={isProcessing}
        className="mb-8"
      />

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-lg">
              {t('common.files')} ({files.length})
              {files.length < 2 && (
                <span className="text-sm text-surface-800/50 ml-2">
                  ({t('tools.merge.minFiles')})
                </span>
              )}
            </h2>
            <div className="flex gap-2">
              {result && (
                <button onClick={handleDownload} className="btn-primary" data-testid="download-btn">
                  {t('common.download')}
                </button>
              )}
              {!result && (
                <button
                  onClick={handleMerge}
                  disabled={isProcessing || files.length < 2}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? t('common.processing') : t('tools.merge.action')}
                </button>
              )}
            </div>
          </div>

          {files.map((fileItem, index) => (
            <div key={fileItem.id} className="file-item" data-testid="file-item">
              <div className="flex items-center gap-2 text-surface-800/50">
                <button
                  onClick={() => moveFile(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-surface-200 rounded disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveFile(index, 'down')}
                  disabled={index === files.length - 1}
                  className="p-1 hover:bg-surface-200 rounded disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <span className="text-sm">{index + 1}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{fileItem.file.name}</p>
                <p className="text-sm text-surface-800/60">
                  {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              <button
                onClick={() => handleRemoveFile(fileItem.id)}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                aria-label="Remove file"
              >
                <svg className="w-5 h-5 text-surface-800/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-16 prose prose-slate max-w-none">
        <h2 className="font-display">{t('tools.merge.seoTitle')}</h2>
        <p>{t('tools.merge.seoContent')}</p>
      </div>
    </div>
  )
}
