import { useState } from 'react'

const CollapsibleSection = ({ title, items, icon, colorClass = 'bg-blue-50 border-blue-200' }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className={`border rounded-lg ${colorClass}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-opacity-75 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-5 h-5">
              {icon}
            </div>
          )}
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">
            {items.length}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CollapsibleSection 