import { useState, useEffect } from 'react'
import { Globe, Sparkles, AlertTriangle, CheckCircle, Search, FileText } from 'lucide-react'

const PageAnalyzer = ({ onSubmit, isAnalyzing, onDetection }) => {
  const [pageInfo, setPageInfo] = useState(null)
  const [detectionStatus, setDetectionStatus] = useState('checking') 
  const [extractedText, setExtractedText] = useState('')

  
  const legalKeywords = [
    'terms', 'conditions', 'terms of service', 'terms and conditions',
    'privacy policy', 'user agreement', 'service agreement', 'legal',
    'liability', 'disclaimer', 'copyright', 'trademark', 'governing law',
    'dispute resolution', 'arbitration', 'jurisdiction', 'waiver',
    'indemnification', 'limitation of liability', 'force majeure'
  ]

  // Check page for legal content
  const detectLegalContent = (text) => {
    const lowerText = text.toLowerCase()
    const keywordMatches = legalKeywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    )
    return keywordMatches.length > 0
  }

  // Clean and process text
  const cleanText = (text) => {
    return text
      .replace(/\s+/g, ' ') 
      .replace(/\t+/g, ' ')
      .replace(/\n+/g, ' ') 
      .trim()
      .substring(0, 20000) 
  }

  // Analyze current page
  const analyzeCurrentPage = async () => {
    try {
      setDetectionStatus('checking')
      
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      // Check URL and title for legal keywords
      const urlLower = tab.url.toLowerCase()
      const titleLower = tab.title.toLowerCase()
      const urlTitleMatch = legalKeywords.some(keyword => 
        urlLower.includes(keyword) || titleLower.includes(keyword)
      )

      if (urlTitleMatch) {
        setPageInfo({
          title: tab.title,
          url: tab.url,
          detectionMethod: 'URL/Title Match'
        })
        setDetectionStatus('detected')
        // Notify parent component about legal content detection
        if (onDetection) {
          onDetection(true)
        }
        return
      }

      // Extract page content
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'extractPageContent' 
      })
      
      if (response && response.text) {
        const cleanedText = cleanText(response.text)
        const hasLegalContent = detectLegalContent(cleanedText)
        
        setPageInfo({
          title: tab.title,
          url: tab.url,
          detectionMethod: hasLegalContent ? 'Content Analysis' : 'Manual Review',
          textLength: cleanedText.length
        })
        
        setExtractedText(cleanedText)
        setDetectionStatus(hasLegalContent ? 'detected' : 'not-detected')
        
        // Notify parent component about legal content detection
        if (onDetection && hasLegalContent) {
          onDetection(true)
        }
      } else {
        throw new Error('Could not extract page content')
      }
    } catch (error) {
      console.error('Error analyzing page:', error)
      setDetectionStatus('error')
    }
  }

  // Handle analysis submission
  const handleAnalyzePage = () => {
    if (extractedText) {
      onSubmit(extractedText)
    } else {
      // Fallback: try to get basic page info
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0]
        const fallbackText = `Page: ${tab.title}\nURL: ${tab.url}\n\nPlease paste the terms and conditions text manually.`
        onSubmit(fallbackText)
      })
    }
  }

  useEffect(() => {
    analyzeCurrentPage()
  }, [])

  const getStatusIcon = () => {
    switch (detectionStatus) {
      case 'checking':
        return <Search className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'detected':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'not-detected':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Search className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = () => {
    switch (detectionStatus) {
      case 'checking':
        return 'Analyzing page content...'
      case 'detected':
        return 'Legal content detected!'
      case 'not-detected':
        return 'No legal content automatically detected'
      case 'error':
        return 'Error analyzing page'
      default:
        return 'Checking page...'
    }
  }

  const getStatusColor = () => {
    switch (detectionStatus) {
      case 'checking':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'detected':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'not-detected':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-900">Smart Page Analysis</h3>
      </div>
      
      {/* Page Info */}
      {/* {pageInfo && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Page Title</span>
              <span className="text-xs text-gray-600 truncate max-w-48">{pageInfo.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Detection Method</span>
              <span className="text-xs text-blue-600">{pageInfo.detectionMethod}</span>
            </div>
            {pageInfo.textLength && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Content Length</span>
                <span className="text-xs text-gray-600">{pageInfo.textLength.toLocaleString()} chars</span>
              </div>
            )}
          </div>
        </div>
      )} */}

      {/* Detection Status */}
      <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-xs font-medium">{getStatusText()}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-3">
        {detectionStatus === 'detected' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-800">Legal Content Found</span>
            </div>
            <p className="text-xs text-green-700 mb-3">
              We detected legal content on this page. Click analyze to process the terms and conditions.
            </p>
            <button
              onClick={handleAnalyzePage}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-3 h-3" />
              <span>Analyze Legal Content</span>
            </button>
          </div>
        )}

        {detectionStatus === 'not-detected' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-xs font-medium text-yellow-800">Manual Review Required</span>
            </div>
            <p className="text-xs text-yellow-700 mb-3">
              No legal content was automatically detected. You can still analyze the page content manually.
            </p>
            <button
              onClick={handleAnalyzePage}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-3 h-3" />
              <span>Analyze Page Content</span>
            </button>
          </div>
        )}

        {detectionStatus === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-800">Analysis Error</span>
            </div>
            <p className="text-xs text-red-700 mb-3">
              Unable to analyze this page. Please try refreshing the page or use the text input method.
            </p>
            <button
              onClick={analyzeCurrentPage}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              <Search className="w-3 h-3" />
              <span>Retry Analysis</span>
            </button>
          </div>
        )}

        {detectionStatus === 'checking' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-blue-800 font-medium">Analyzing page content...</span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>Smart detection analyzes URL, title, and page content for legal keywords.</p>
        <p>Works best on pages with visible terms & conditions text.</p>
      </div>
    </div>
  )
}

export default PageAnalyzer 