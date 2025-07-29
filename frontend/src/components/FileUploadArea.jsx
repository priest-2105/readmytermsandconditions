import { useState, useRef } from 'react'

const FileUploadArea = ({ onSubmit }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  // Get API URL from environment or use default
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const SUPPORTED_TYPES = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/msword': 'DOC',
    'text/plain': 'TXT'
  }

  const uploadFileToBackend = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload and analyze file')
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw new Error(`Failed to process file: ${error.message}`)
    }
  }

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit')
    }

    if (!SUPPORTED_TYPES[file.type]) {
      throw new Error('Unsupported file type. Please upload PDF, DOCX, DOC, or TXT files.')
    }

    return true
  }

  const handleFile = async (file) => {
    setError('')
    setIsProcessing(true)

    try {
      validateFile(file)
      const analysis = await uploadFileToBackend(file)
      onSubmit(analysis)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50/50 scale-105 shadow-lg'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 hover:scale-[1.02]'
        } ${isProcessing ? 'pointer-events-none opacity-75' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl"></div>
        </div>

        <div className="relative space-y-6">
          <div className="mx-auto w-20 h-20 text-gray-400 transition-transform duration-300 group-hover:scale-110">
            {isProcessing ? (
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
              </div>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          
          <div className="space-y-3">
            <p className="text-xl font-semibold text-gray-900">
              {isProcessing ? 'Processing your file...' : isDragOver ? 'Drop your file here' : 'Drop your file here'}
            </p>
            <p className="text-gray-500">
              {isProcessing ? 'Please wait while we extract and analyze the content' : 'or click to browse files'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
            <span className="px-3 py-1 bg-gray-100 rounded-full">PDF</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">DOCX</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">DOC</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">TXT</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">Max 5MB</span>
          </div>
        </div>

        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500/10 rounded-2xl flex items-center justify-center">
            <div className="text-blue-600 font-semibold text-lg">Drop to upload</div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.doc,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain"
        onChange={handleFileInput}
      />

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center space-x-3 text-blue-600 bg-blue-50 rounded-lg p-4">
          <div className="relative">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <span className="text-sm font-medium">Extracting text from file...</span>
        </div>
      )}
    </div>
  )
}

export default FileUploadArea 