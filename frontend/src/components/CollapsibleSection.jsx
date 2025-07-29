import { useState } from 'react'

const CollapsibleSection = ({ title, items, icon, colorClass = 'bg-blue-50 border-blue-200' }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className={`border-2 rounded-2xl ${colorClass} shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-opacity-75 transition-all duration-200 group"
      >
        <div className="flex items-center space-x-4">
          {icon && (
            <div className="w-8 h-8 text-gray-600 group-hover:scale-110 transition-transform duration-200">
              {icon}
            </div>
          )}
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
              {title}
            </h3>
            <span className="text-sm font-semibold text-gray-600 bg-white/80 px-3 py-1 rounded-full shadow-sm">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <svg
            className={`w-5 h-5 text-gray-500 transition-all duration-300 group-hover:text-gray-700 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors duration-200"
              >
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollapsibleSection 