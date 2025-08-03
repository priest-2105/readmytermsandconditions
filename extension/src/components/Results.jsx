import { AlertTriangle, CheckCircle, Info, Shield, Clock, Users } from 'lucide-react'

const Results = ({ results }) => {
  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getRiskIcon = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />
      case 'medium':
        return <Info className="w-4 h-4" />
      case 'low':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      {results.summary && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Summary</h4>
              <p className="text-xs text-blue-800 leading-relaxed">{results.summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Points */}
      {results.keyPoints && results.keyPoints.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Key Points</h4>
          <div className="space-y-2">
            {results.keyPoints.map((point, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-xs text-gray-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risks */}
      {results.risks && results.risks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Identified Risks</h4>
          <div className="space-y-2">
            {results.risks.map((risk, index) => (
              <div key={index} className={`flex items-start space-x-2 p-2 rounded-lg border ${getRiskColor(risk.level)}`}>
                {getRiskIcon(risk.level)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{risk.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getRiskColor(risk.level)}`}>
                      {risk.level}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Obligations */}
      {results.obligations && results.obligations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Your Obligations</h4>
          <div className="space-y-2">
            {results.obligations.map((obligation, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                <Clock className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-orange-900 mb-1">{obligation.title}</p>
                  <p className="text-xs text-orange-800 leading-relaxed">{obligation.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rights */}
      {results.rights && results.rights.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Your Rights</h4>
          <div className="space-y-2">
            {results.rights.map((right, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-green-900 mb-1">{right.title}</p>
                  <p className="text-xs text-green-800 leading-relaxed">{right.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Collection */}
      {results.dataCollection && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Data Collection</h4>
          <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Users className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-purple-900 mb-1">Data Usage</p>
                <p className="text-xs text-purple-800 leading-relaxed">{results.dataCollection}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 text-center border-t pt-3">
        This analysis is for informational purposes only and should not be considered as legal advice.
      </div>
    </div>
  )
}

export default Results 