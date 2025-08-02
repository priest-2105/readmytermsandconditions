import { useState } from 'react'
import { Link } from 'react-router-dom'
import FileUploadArea from '../components/FileUploadArea'
import TextAreaInput from '../components/TextAreaInput'
import SummaryDisplay from '../components/SummaryDisplay'

const AnalyzePage = () => {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Get API URL from environment or use default
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const handleTextSubmit = async (inputText) => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze')
      return
    }
    
    await processText(inputText)
  }

  const handleFileSubmit = async (analysis) => {
    setSummary(analysis)
  }

  const processText = async (inputText) => {
    setLoading(true)
    setError('')
    setSummary(null)

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze text')
      }

      const data = await response.json()
      setSummary(data)
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the text')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">TermsAnalyzer</span>
          </Link>
          <Link 
            to="/"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
            Terms & Conditions Analyzer
          </h1>
          <p className="text-xl text-gray-600">
            Upload a document or paste text to get an AI-powered analysis
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Input Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
                <p className="text-gray-600">Drag & drop or click to browse</p>
              </div>
            </div>
            <FileUploadArea onSubmit={handleFileSubmit} />
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Paste Text</h2>
                <p className="text-gray-600">Direct text input for quick analysis</p>
              </div>
            </div>
            <TextAreaInput onSubmit={handleTextSubmit} />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your document...</h3>
                <p className="text-gray-600">This may take a few moments</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {summary && <SummaryDisplay summary={summary} />}
      </div>
    </div>
  )
}

export default AnalyzePage 