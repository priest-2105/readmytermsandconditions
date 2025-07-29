import { useState } from 'react'

const TextAreaInput = ({ onSubmit }) => {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  
  const MAX_CHARACTERS = 800
  const remainingChars = MAX_CHARACTERS - text.length

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!text.trim()) {
      setError('Please enter some text to analyze')
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your terms and conditions text
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={handleTextChange}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Paste your terms and conditions text here..."
          maxLength={MAX_CHARACTERS}
        />
        <div className="flex justify-between items-center mt-2">
          <div className="text-sm text-gray-500">
            {remainingChars} characters remaining
          </div>
          {remainingChars < 50 && (
            <div className={`text-sm ${remainingChars < 0 ? 'text-red-600' : 'text-yellow-600'}`}>
              {remainingChars < 0 ? 'Over limit!' : 'Approaching limit'}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!text.trim() || text.length > MAX_CHARACTERS}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Analyze Text
      </button>
    </form>
  )
}

export default TextAreaInput 