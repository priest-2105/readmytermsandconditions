import { useState } from 'react'
import { Send, FileText } from 'lucide-react'

const TextInput = ({ onSubmit, isAnalyzing }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim() && !isAnalyzing) {
      onSubmit(text.trim())
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <FileText className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-900">Paste Terms & Conditions</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your terms and conditions text here..."
          className="w-full h-32 p-3 text-sm border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isAnalyzing}
        />
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {text.length} characters
          </span>
          <button
            type="submit"
            disabled={!text.trim() || isAnalyzing}
            className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-3 h-3" />
            <span>Analyze</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default TextInput 