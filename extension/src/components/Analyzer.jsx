import { useState, useEffect } from 'react'
import { Upload, FileText, Globe, Sparkles, AlertCircle, CheckCircle } from 'lucide-react'
import TextInput from './TextInput'
import FileUpload from './FileUpload'
import PageAnalyzer from './PageAnalyzer'
import Results from './Results'

const Analyzer = ({ isAnalyzing, setIsAnalyzing }) => {
  const [activeTab, setActiveTab] = useState('page') // Make page analyzer the default
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [canAnalyze, setCanAnalyze] = useState(true)

  // Get the frontend URL from environment or use default
  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://readmytermsandconditions-frontend.vercel.app'

  const handleAnalysis = async (input) => {
    setIsAnalyzing(true)
    setError('')
    setResults(null)

    try {
      let data
      
      // If input is already results (from file upload), use it directly
      if (typeof input === 'object' && input.ThingsToKnow) {
        data = input
      } else {
        // Otherwise, analyze the text
        const API_URL = import.meta.env.VITE_API_URL || 'https://readmytermsandconditions.onrender.com'
        const response = await fetch(`${API_URL}/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: input }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to analyze text')
        }

        data = await response.json()
      }
      
      // Store results in Chrome storage with session-specific key
      const sessionKey = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const analysisTime = Date.now()
      await chrome.storage.local.set({ 
        [sessionKey]: {
          analysisResults: data,
          analysisTimestamp: analysisTime,
          sessionId: sessionKey
        }
      })
      
      // Store the current session key for this tab
      await chrome.storage.local.set({ 
        currentSessionKey: sessionKey
      })
      
      // Set results to show in extension
      setResults(data)
      setIsAnalyzing(false)
      setCanAnalyze(false)
      
      // Start the 30-minute timer
      startAnalysisTimer(analysisTime)
      
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the text')
      setIsAnalyzing(false)
    }
  }

  // Load previous results when component mounts (session-specific)
  useEffect(() => {
    const loadPreviousResults = async () => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        try {
          // Clean up old sessions first
          await cleanupOldSessions()
          
          // Get the current session key
          const sessionResult = await chrome.storage.local.get(['currentSessionKey'])
          
          if (sessionResult.currentSessionKey) {
            // Load data for the current session only
            const result = await chrome.storage.local.get([sessionResult.currentSessionKey])
            const sessionData = result[sessionResult.currentSessionKey]
            
            if (sessionData && sessionData.analysisResults) {
              // Check if results are recent (within last 30 minutes)
              const isRecent = sessionData.analysisTimestamp && 
                (Date.now() - sessionData.analysisTimestamp) < 30 * 60 * 1000
              
              if (isRecent) {
                setResults(sessionData.analysisResults)
                setCanAnalyze(false)
                // Restart the timer for the existing analysis
                startAnalysisTimer(sessionData.analysisTimestamp)
              } else {
                // Clear old session data
                await chrome.storage.local.remove([sessionResult.currentSessionKey, 'currentSessionKey'])
                setCanAnalyze(true)
              }
            }
          }
        } catch (error) {
          console.error('Error loading previous results:', error)
        }
      }
    }

    loadPreviousResults()
  }, [])

  // Start the 30-minute analysis timer
  const startAnalysisTimer = (analysisTime) => {
    const timer = setInterval(() => {
      const now = Date.now()
      const elapsed = now - analysisTime
      const remaining = (30 * 60 * 1000) - elapsed // 30 minutes in milliseconds
      
      if (remaining <= 0) {
        // Timer expired - reset everything
        setTimeRemaining(0)
        setCanAnalyze(true)
        setResults(null)
        clearInterval(timer)
        
        // Clear the current session
        chrome.storage.local.get(['currentSessionKey']).then((result) => {
          if (result.currentSessionKey) {
            chrome.storage.local.remove([result.currentSessionKey, 'currentSessionKey'])
          }
        })
      } else {
        // Update remaining time
        setTimeRemaining(remaining)
      }
    }, 1000) // Update every second
    
    // Store timer reference for cleanup
    return timer
  }

  // Format time remaining as MM:SS
  const formatTimeRemaining = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Clean up old sessions
  const cleanupOldSessions = async () => {
    try {
      const allData = await chrome.storage.local.get(null)
      const now = Date.now()
      const keysToRemove = []
      
      // Find old session keys (older than 1 hour)
      Object.keys(allData).forEach(key => {
        if (key.startsWith('analysis_') && allData[key] && allData[key].analysisTimestamp) {
          const age = now - allData[key].analysisTimestamp
          if (age > 60 * 60 * 1000) { // 1 hour
            keysToRemove.push(key)
          }
        }
      })
      
      // Remove old sessions
      if (keysToRemove.length > 0) {
        await chrome.storage.local.remove(keysToRemove)
        console.log(`Cleaned up ${keysToRemove.length} old sessions`)
      }
    } catch (error) {
      console.error('Error cleaning up old sessions:', error)
    }
  }

  const handleNewAnalysis = () => {
    setResults(null)
    setError('')
    // Clear current session storage when starting new analysis
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['currentSessionKey']).then((result) => {
        if (result.currentSessionKey) {
          chrome.storage.local.remove([result.currentSessionKey, 'currentSessionKey'])
        }
      })
    }
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
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Analysis Complete!</h2>
            <p className="text-xs text-gray-500">
              Found {Object.values(results).reduce((total, arr) => total + (Array.isArray(arr) ? arr.length : 0), 0)} key points
            </p>
          </div>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
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

            {/* User Rights */}
            {results.UserRights && results.UserRights.length > 0 && (
              <div className="bg-green-50 p-3 rounded-lg">
                <h3 className="text-sm font-semibold text-green-900 mb-2">Your Rights</h3>
                <ul className="text-xs text-green-800 space-y-1">
                  {results.UserRights.slice(0, 2).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {results.UserRights.length > 2 && (
                    <li className="text-green-600 text-xs italic">
                      +{results.UserRights.length - 2} more items
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="flex-shrink-0 space-y-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              // Pass results via URL parameter (session-specific)
              const encodedResults = encodeURIComponent(JSON.stringify(results))
              const url = `${FRONTEND_URL}/analyze?results=${encodedResults}&session=${Date.now()}`
              chrome.tabs.create({ url })
              window.close()
            }}
            className="w-full px-4 cursor-pointer py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>View Full Results</span>
          </button>

          {/* Timer Display */}
          {!canAnalyze && timeRemaining > 0 && (
            <div className="text-center py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-medium">
                Next analysis available in: {formatTimeRemaining(timeRemaining)}
              </p>
            </div>
          )}

          {/* Conditional New Analysis Button */}
          {canAnalyze ? (
            <button
              onClick={handleNewAnalysis}
              className="w-full px-4 py-2 cursor-pointer bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              New Analysis
            </button>
          ) : (
            <button
              disabled
              className="w-full px-4 py-2 cursor-pointer bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed"
            >
              New Analysis (30 min cooldown)
            </button>
          )}
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
        {!canAnalyze && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-sm text-yellow-800 font-medium">
              ⏰ Analysis cooldown active. Please wait {formatTimeRemaining(timeRemaining)} before next analysis.
            </p>
          </div>
        )}
        
        {activeTab === 'text' && (
          <TextInput onSubmit={handleAnalysis} isAnalyzing={isAnalyzing} disabled={!canAnalyze} />
        )}
        {activeTab === 'file' && (
          <FileUpload onSubmit={handleAnalysis} isAnalyzing={isAnalyzing} disabled={!canAnalyze} />
        )}
        {activeTab === 'page' && (
          <PageAnalyzer 
            onSubmit={handleAnalysis} 
            isAnalyzing={isAnalyzing}
            onDetection={handlePageDetection}
            disabled={!canAnalyze}
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