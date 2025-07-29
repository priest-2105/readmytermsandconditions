import { useState } from 'react'
import FileUploadArea from './components/FileUploadArea'
import TextAreaInput from './components/TextAreaInput'
import SummaryDisplay from './components/SummaryDisplay'

function App() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      const response = await fetch('http://localhost:3001/api/analyze', {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Terms & Conditions Analyzer
          </h1>
          <p className="text-gray-600">
            Upload a document or paste text to get an AI-powered analysis
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Document
            </h2>
            <FileUploadArea onSubmit={handleFileSubmit} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Paste Text
            </h2>
            <TextAreaInput onSubmit={handleTextSubmit} />
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-white transition ease-in-out duration-150 cursor-not-allowed">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing your document...
            </div>
          </div>
        )}

        {summary && <SummaryDisplay summary={summary} />}
      </div>
    </div>
  )
}

export default App
