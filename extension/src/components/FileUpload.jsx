import { useState, useRef } from 'react'
import { Upload, File, X } from 'lucide-react'

const FileUpload = ({ onSubmit, isAnalyzing }) => {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (selectedFile) => {
    if (selectedFile.type === 'text/plain' || 
        selectedFile.type === 'application/pdf' ||
        selectedFile.name.endsWith('.txt') ||
        selectedFile.name.endsWith('.pdf')) {
      setFile(selectedFile)
    } else {
      alert('Please select a .txt or .pdf file')
    }
  }

  const handleSubmit = async () => {
    if (!file || isAnalyzing) return

    if (file.type === 'application/pdf') {
      // For PDF files, upload directly to API
      const formData = new FormData()
      formData.append('file', file)
      
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://readmytermsandconditions.onrender.com'
        const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to analyze PDF')
        }

        const data = await response.json()
        onSubmit(data) // Pass the results directly
      } catch (error) {
        alert(`Error analyzing PDF: ${error.message}`)
      }
      return
    }

    // For text files, read and analyze
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      onSubmit(text)
    }
    reader.readAsText(file)
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Upload className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-900">Upload Document</h3>
      </div>

      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            Drag & drop a file here, or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-gray-500">
            Supports .txt and .pdf files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {file && (
        <button
          onClick={handleSubmit}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-3 h-3" />
          <span>Analyze File</span>
        </button>
      )}
    </div>
  )
}

export default FileUpload 