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

  // Get the frontend URL from environment or use default
  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://readmytermsandconditions-frontend.vercel.app'

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
      
      // Redirect to frontend with results
      const analysisData = encodeURIComponent(JSON.stringify(data))
      const redirectUrl = `${FRONTEND_URL}/analyze?results=${analysisData}`
      
      // Open the frontend in a new tab
      chrome.tabs.create({ url: redirectUrl })
      
      // Close the popup
      window.close()
      
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the text')
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

  // If we have results, show them briefly before redirecting
  if (results) {
    return (
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Analysis Complete!</h2>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="text-center py-8">
            <div className="mb-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Redirecting to Full Results</h3>
              <p className="text-sm text-gray-600">
                Opening detailed analysis in a new tab...
              </p>
            </div>
            <button
              onClick={() => {
                const analysisData = encodeURIComponent(JSON.stringify(results))
                const redirectUrl = `${FRONTEND_URL}/analyze?results=${analysisData}`
                chrome.tabs.create({ url: redirectUrl })
                window.close()
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Open Results
            </button>
          </div>
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