import CollapsibleSection from './CollapsibleSection'

const SummaryDisplay = ({ summary }) => {
  const sectionConfigs = [
    {
      key: 'ThingsToKnow',
      title: 'Things to Know',
      colorClass: 'bg-blue-50 border-blue-200',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      key: 'ImportantPoints',
      title: 'Important Points',
      colorClass: 'bg-yellow-50 border-yellow-200',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    {
      key: 'Risks',
      title: 'Risks',
      colorClass: 'bg-red-50 border-red-200',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    {
      key: 'UserObligations',
      title: 'Your Obligations',
      colorClass: 'bg-purple-50 border-purple-200',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      key: 'UserRights',
      title: 'Your Rights',
      colorClass: 'bg-green-50 border-green-200',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      key: 'OptionalNotes',
      title: 'Additional Notes',
      colorClass: 'bg-gray-50 border-gray-200',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analysis Results
        </h2>
        <p className="text-gray-600">
          Your document has been analyzed and categorized into the following sections:
        </p>
      </div>

      <div className="space-y-4">
        {sectionConfigs.map((config) => (
          <CollapsibleSection
            key={config.key}
            title={config.title}
            items={summary[config.key]}
            icon={config.icon}
            colorClass={config.colorClass}
          />
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-800">
              <strong>Disclaimer:</strong> This analysis is provided for informational purposes only. 
              It should not be considered as legal advice. Always consult with a legal professional 
              for specific legal matters.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryDisplay 