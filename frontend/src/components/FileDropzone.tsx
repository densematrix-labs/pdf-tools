import { useCallback } from 'react'
import { useDropzone, Accept } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

interface FileDropzoneProps {
  onFilesAdded: (files: File[]) => void
  accept?: Accept
  multiple?: boolean
  maxSize?: number
  disabled?: boolean
  className?: string
}

export default function FileDropzone({
  onFilesAdded,
  accept = { 'application/pdf': ['.pdf'] },
  multiple = false,
  maxSize = 100 * 1024 * 1024, // 100MB
  disabled = false,
  className = '',
}: FileDropzoneProps) {
  const { t } = useTranslation()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesAdded(acceptedFiles)
    }
  }, [onFilesAdded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={`drop-zone cursor-pointer ${isDragActive ? 'active' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      data-testid="file-dropzone"
    >
      <input {...getInputProps()} data-testid="file-input" />
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-surface-800">
            {isDragActive ? t('dropzone.drop') : t('dropzone.drag')}
          </p>
          <p className="text-sm text-surface-800/60 mt-1">
            {t('dropzone.or')} <span className="text-primary-500 font-medium">{t('dropzone.browse')}</span>
          </p>
        </div>
        <p className="text-xs text-surface-800/50">
          {t('dropzone.maxSize', { size: Math.round(maxSize / 1024 / 1024) })}
        </p>
      </div>
    </div>
  )
}
