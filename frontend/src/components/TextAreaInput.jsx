import { useState } from 'react'

const TextAreaInput = ({ onSubmit, disabled = false }) => {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  
  const MAX_CHARACTERS = 9000
  const MIN_CHARACTERS = 100
  const remainingChars = MAX_CHARACTERS - text.length
  const isNearLimit = remainingChars < 100
  const isOverLimit = remainingChars < 0
  const isUnderMin = text.trim().length < MIN_CHARACTERS

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!text.trim()) {
      setError('Please enter some text to analyze')
      return
    }
    
    if (text.trim().length < MIN_CHARACTERS) {
      setError(`Please enter at least ${MIN_CHARACTERS} characters for meaningful analysis`)
      return
    }
    
    if (text.length > MAX_CHARACTERS) {
      setError(`Text exceeds ${MAX_CHARACTERS} character limit`)
      return
    }
    
    setError('')
    onSubmit(text)
  }

  const handleTextChange = (e) => {
    const newText = e.target.value
    setText(newText)
    
    if (error) {
      setError('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label htmlFor="text-input" className="block text-sm font-semibold text-gray-700">
          Enter your terms and conditions text
        </label>
        <div className="relative">
          <textarea
            id="text-input"
            value={text}
            onChange={handleTextChange}
            rows={10}
            className={`w-full px-4 py-4 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all duration-200 ${
              isOverLimit ? 'border-red-300 bg-red-50' : 
              isNearLimit ? 'border-yellow-300 bg-yellow-50' : 
              isUnderMin ? 'border-orange-300 bg-orange-50' :
              'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Paste your terms and conditions text here... We'll analyze it and break it down into easy-to-understand sections. (Minimum 100 characters required)"
            maxLength={MAX_CHARACTERS}
          />
          
          {/* Character counter */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            {isUnderMin && (
              <div className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                Min {MIN_CHARACTERS} chars
              </div>
            )}
            {isNearLimit && !isUnderMin && (
              <div className={`text-xs px-2 py-1 rounded-full ${
                isOverLimit ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {isOverLimit ? 'Over limit!' : 'Approaching limit'}
              </div>
            )}
            <div className={`text-xs font-medium ${
              isOverLimit ? 'text-red-600' : 
              isNearLimit ? 'text-yellow-600' : 
              isUnderMin ? 'text-orange-600' :
              'text-gray-500'
            }`}>
              {text.length}/{MAX_CHARACTERS}
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverLimit ? 'bg-red-500' :
              isNearLimit ? 'bg-yellow-500' :
              isUnderMin ? 'bg-orange-500' :
              'bg-green-500'
            }`}
            style={{ 
              width: `${Math.min(100, (text.length / MAX_CHARACTERS) * 100)}%` 
            }}
          ></div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span className={isUnderMin ? 'text-orange-600 font-medium' : ''}>
            {text.trim().length < MIN_CHARACTERS ? `${MIN_CHARACTERS - text.trim().length} more chars needed` : 'Minimum met ✓'}
          </span>
          <span>
            {text.length}/{MAX_CHARACTERS} characters
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!text.trim() || text.length > MAX_CHARACTERS || text.trim().length < MIN_CHARACTERS || disabled}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>{disabled ? 'Cooldown Active' : 'Analyze Text'}</span>
        </div>
      </button>
    </form>
  )
}

export default TextAreaInput 