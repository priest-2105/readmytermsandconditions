import { Globe, Sparkles } from 'lucide-react'

const PageAnalyzer = ({ onSubmit, isAnalyzing }) => {
  const handleAnalyzePage = async () => {
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      // Send message to content script to extract page text
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'analyzePage' })
      
      if (response && response.text) {
        onSubmit(response.text)
      } else {
        throw new Error('Could not extract text from this page')
      }
    } catch (error) {
      console.error('Error analyzing page:', error)
      // Fallback: try to get page title and URL
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      const fallbackText = `Page: ${tab.title}\nURL: ${tab.url}\n\nPlease paste the terms and conditions text manually.`
      onSubmit(fallbackText)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Globe className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-900">Analyze Current Page</h3>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900">Page Content Analysis</span>
        </div>
        
        <p className="text-xs text-gray-600 mb-4">
          Extract and analyze terms & conditions from the current webpage. This will attempt to find legal text on the page.
        </p>
        
        <button
          onClick={handleAnalyzePage}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Globe className="w-3 h-3" />
          <span>Analyze This Page</span>
        </button>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Note: This works best on pages with visible terms & conditions text
      </div>
    </div>
  )
}

export default PageAnalyzer 