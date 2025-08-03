import { useState } from 'react'
import { Upload, FileText, Globe, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import TextInput from './TextInput'
import FileUpload from './FileUpload'
import PageAnalyzer from './PageAnalyzer'
import Results from './Results'

const Analyzer = ({ isAnalyzing, setIsAnalyzing }) => {
  const [activeTab, setActiveTab] = useState('text')
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const handleAnalysis = async (text) => {
    setIsAnalyzing(true)
    setError('')
    setResults(null)

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://readmytermsandconditions.onrender.com'
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze text')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the text')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNewAnalysis = () => {
    setResults(null)
    setError('')
  }

  // Handle page detection - auto-switch to page tab if legal content detected
  const handlePageDetection = (hasLegalContent) => {
    if (hasLegalContent) {
      setActiveTab('page')
    }
  }

  const tabs = [
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'file', label: 'File', icon: Upload },
    { id: 'page', label: 'Page', icon: Globe },
  ]

  if (results) {
    return (
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Analysis Results</h2>
          <button
            onClick={handleNewAnalysis}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            New Analysis
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Results results={results} />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex-shrink-0">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1 flex-shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {activeTab === 'text' && (
          <TextInput onSubmit={handleAnalysis} isAnalyzing={isAnalyzing} />
        )}
        {activeTab === 'file' && (
          <FileUpload onSubmit={handleAnalysis} isAnalyzing={isAnalyzing} />
        )}
        {activeTab === 'page' && (
          <PageAnalyzer 
            onSubmit={handleAnalysis} 
            isAnalyzing={isAnalyzing}
            onDetection={handlePageDetection}
          />
        )}
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 flex-shrink-0">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-800 font-medium">Analyzing...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analyzer 