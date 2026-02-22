import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import FileDropzone from '../components/FileDropzone'
import { compressPdf, downloadBlob } from '../lib/pdfUtils'

interface FileState {
  file: File
  status: 'pending' | 'processing' | 'done' | 'error'
  result?: Blob
  originalSize: number
  compressedSize?: number
  error?: string
}

export default function CompressPdf() {
  const { t } = useTranslation()
  const [files, setFiles] = useState<FileState[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    const fileStates = newFiles.map(file => ({
      file,
      status: 'pending' as const,
      originalSize: file.size,
    }))
    setFiles(prev => [...prev, ...fileStates])
  }, [])

  const handleCompress = async () => {
    setIsProcessing(true)
    
    const updatedFiles = [...files]
    
    for (let i = 0; i < updatedFiles.length; i++) {
      if (updatedFiles[i].status !== 'pending') continue
      
      updatedFiles[i].status = 'processing'
      setFiles([...updatedFiles])
      
      try {
        const result = await compressPdf(updatedFiles[i].file)
        updatedFiles[i].status = 'done'
        updatedFiles[i].result = result
        updatedFiles[i].compressedSize = result.size
      } catch (error) {
        updatedFiles[i].status = 'error'
        updatedFiles[i].error = error instanceof Error ? error.message : 'Unknown error'
      }
      
      setFiles([...updatedFiles])
    }
    
    setIsProcessing(false)
  }

  const handleDownload = (fileState: FileState) => {
    if (fileState.result) {
      const newName = fileState.file.name.replace('.pdf', '-compressed.pdf')
      downloadBlob(fileState.result, newName)
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  const calculateSavings = (original: number, compressed?: number) => {
    if (!compressed) return 0
    return Math.round((1 - compressed / original) * 100)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-surface-900 mb-4">
          {t('tools.compress.name')}
        </h1>
        <p className="text-surface-800/70 max-w-xl mx-auto">
          {t('tools.compress.longDesc')}
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
            <h2 className="font-medium text-lg">{t('common.files')} ({files.length})</h2>
            <button
              onClick={handleCompress}
              disabled={isProcessing || files.every(f => f.status !== 'pending')}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? t('common.processing') : t('tools.compress.action')}
            </button>
          </div>

          {files.map((fileState, index) => (
            <div key={index} className="file-item" data-testid="file-item">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{fileState.file.name}</p>
                <div className="flex items-center gap-4 text-sm text-surface-800/60 mt-1">
                  <span>{formatSize(fileState.originalSize)}</span>
                  {fileState.compressedSize && (
                    <>
                      <span>→</span>
                      <span className="text-green-600 font-medium">
                        {formatSize(fileState.compressedSize)}
                      </span>
                      <span className="text-green-600">
                        (-{calculateSavings(fileState.originalSize, fileState.compressedSize)}%)
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {fileState.status === 'processing' && (
                  <div className="loading-spinner" />
                )}
                {fileState.status === 'done' && (
                  <button
                    onClick={() => handleDownload(fileState)}
                    className="btn-secondary text-sm py-2"
                    data-testid="download-btn"
                  >
                    {t('common.download')}
                  </button>
                )}
                {fileState.status === 'error' && (
                  <span className="text-red-500 text-sm">{fileState.error}</span>
                )}
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  aria-label="Remove file"
                >
                  <svg className="w-5 h-5 text-surface-800/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-16 prose prose-slate max-w-none">
        <h2 className="font-display">{t('tools.compress.seoTitle')}</h2>
        <p>{t('tools.compress.seoContent')}</p>
      </div>
    </div>
  )
}
