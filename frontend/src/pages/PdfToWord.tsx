import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import FileDropzone from '../components/FileDropzone'
import { convertPdfToWord, downloadBlob } from '../lib/pdfUtils'

interface FileState {
  file: File
  status: 'pending' | 'processing' | 'done' | 'error'
  result?: Blob
  error?: string
}

export default function PdfToWord() {
  const { t } = useTranslation()
  const [fileState, setFileState] = useState<FileState | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFilesAdded = useCallback((files: File[]) => {
    if (files.length > 0) {
      setFileState({
        file: files[0],
        status: 'pending',
      })
    }
  }, [])

  const handleConvert = async () => {
    if (!fileState) return
    
    setIsProcessing(true)
    setFileState(prev => prev ? { ...prev, status: 'processing' } : null)
    
    try {
      const result = await convertPdfToWord(fileState.file)
      setFileState(prev => prev ? {
        ...prev,
        status: 'done',
        result,
      } : null)
    } catch (error) {
      setFileState(prev => prev ? {
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Conversion failed',
      } : null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (fileState?.result) {
      const newName = fileState.file.name.replace('.pdf', '.docx')
      downloadBlob(fileState.result, newName)
    }
  }

  const handleReset = () => {
    setFileState(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-surface-900 mb-4">
          {t('tools.pdfToWord.name')}
        </h1>
        <p className="text-surface-800/70 max-w-xl mx-auto">
          {t('tools.pdfToWord.longDesc')}
        </p>
      </div>

      {!fileState && (
        <FileDropzone
          onFilesAdded={handleFilesAdded}
          multiple={false}
          disabled={isProcessing}
          className="mb-8"
        />
      )}

      {fileState && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-surface-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium">{fileState.file.name}</p>
              <p className="text-sm text-surface-800/60">
                {(fileState.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4">
            {fileState.status === 'pending' && (
              <button onClick={handleConvert} className="btn-primary">
                {t('tools.pdfToWord.action')}
              </button>
            )}
            {fileState.status === 'processing' && (
              <div className="flex items-center gap-3">
                <div className="loading-spinner" />
                <span>{t('common.processing')}</span>
              </div>
            )}
            {fileState.status === 'done' && (
              <button onClick={handleDownload} className="btn-primary" data-testid="download-btn">
                {t('common.download')} .docx
              </button>
            )}
            {fileState.status === 'error' && (
              <div className="text-red-500">{fileState.error}</div>
            )}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-16 prose prose-slate max-w-none">
        <h2 className="font-display">{t('tools.pdfToWord.seoTitle')}</h2>
        <p>{t('tools.pdfToWord.seoContent')}</p>
      </div>
    </div>
  )
}
