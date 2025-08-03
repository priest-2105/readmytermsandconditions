import { useState } from 'react'
import { Upload, FileText, Globe, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import TextInput from './TextInput'
import FileUpload from './FileUpload'
import PageAnalyzer from './PageAnalyzer'
import Results from './Results'

const Analyzer = ({ isAnalyzing, setIsAnalyzing }) => {
  const [activeTab, setActiveTab] = useState('page') // Make page analyzer the default
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
      
      // Store results in Chrome storage
      await chrome.storage.local.set({ 
        analysisResults: data,
        analysisTimestamp: Date.now()
      })
      
      // Set results to show in extension
      setResults(data)
      setIsAnalyzing(false)
      
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
    { id: 'page', label: 'Page', icon: Globe },
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'file', label: 'File', icon: Upload },
  ]

  // If we have results, show limited results with option to view full results
  if (results) {
    return (
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Analysis Complete!</h2>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Limited Results Display */}
          <div className="space-y-3">
            {/* Things to Know */}
            {results.ThingsToKnow && results.ThingsToKnow.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Key Things to Know</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  {results.ThingsToKnow.slice(0, 2).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {results.ThingsToKnow.length > 2 && (
                    <li className="text-blue-600 text-xs italic">
                      +{results.ThingsToKnow.length - 2} more items
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Important Points */}
            {results.ImportantPoints && results.ImportantPoints.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h3 className="text-sm font-semibold text-yellow-900 mb-2">Important Points</h3>
                <ul className="text-xs text-yellow-800 space-y-1">
                  {results.ImportantPoints.slice(0, 2).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {results.ImportantPoints.length > 2 && (
                    <li className="text-yellow-600 text-xs italic">
                      +{results.ImportantPoints.length - 2} more items
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Risks */}
            {results.Risks && results.Risks.length > 0 && (
              <div className="bg-red-50 p-3 rounded-lg">
                <h3 className="text-sm font-semibold text-red-900 mb-2">Potential Risks</h3>
                <ul className="text-xs text-red-800 space-y-1">
                  {results.Risks.slice(0, 2).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {results.Risks.length > 2 && (
                    <li className="text-red-600 text-xs italic">
                      +{results.Risks.length - 2} more items
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* View Full Results Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                chrome.tabs.create({ url: `${FRONTEND_URL}/analyze` })
                window.close()
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>View Full Results</span>
            </button>
          </div>

          {/* New Analysis Button */}
          <button
            onClick={handleNewAnalysis}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            New Analysis
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 h-full flex flex-col relative">
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

      {/* Loading State - Show only spinner when analyzing */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-600 font-medium">Analyzing...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analyzer 