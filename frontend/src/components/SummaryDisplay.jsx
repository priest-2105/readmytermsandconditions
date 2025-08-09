import { useEffect, useMemo, useState, useCallback } from 'react'

const SummaryDisplay = ({ summary }) => {
  const sectionConfigs = [
    { key: 'ThingsToKnow', title: 'Things to Know', colorClass: 'bg-blue-50 border-blue-200' },
    { key: 'ImportantPoints', title: 'Important Points', colorClass: 'bg-yellow-50 border-yellow-200' },
    { key: 'Risks', title: 'Risks', colorClass: 'bg-red-50 border-red-200' },
    { key: 'UserObligations', title: 'Your Obligations', colorClass: 'bg-purple-50 border-purple-200' },
    { key: 'UserRights', title: 'Your Rights', colorClass: 'bg-green-50 border-green-200' },
    { key: 'OptionalNotes', title: 'Additional Notes', colorClass: 'bg-gray-50 border-gray-200' },
  ]

  const availableSections = useMemo(() => {
    return sectionConfigs
      .map((cfg) => ({
        ...cfg,
        items: (Array.isArray(summary?.[cfg.key]) ? summary[cfg.key] : [])
          .map((t) => String(t ?? '').trim())
          .filter(Boolean),
      }))
      .filter((s) => s.items.length > 0)
  }, [summary])

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)

  useEffect(() => {
    if (activeSectionIndex >= availableSections.length) {
      setActiveSectionIndex(0)
    }
  }, [availableSections.length, activeSectionIndex])

  const goPrevSection = useCallback(() => {
    setActiveSectionIndex((i) => (i > 0 ? i - 1 : 0))
  }, [])

  const goNextSection = useCallback(() => {
    setActiveSectionIndex((i) => (i < availableSections.length - 1 ? i + 1 : i))
  }, [availableSections.length])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        goNextSection()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        goPrevSection()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNextSection, goPrevSection])

  const current = availableSections[activeSectionIndex]
  const totalHighlights = useMemo(() => {
    return availableSections.reduce((sum, s) => sum + s.items.length, 0)
  }, [availableSections])

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Analysis Highlights</h2>
              <p className="text-sm text-gray-600">Use the sidebar or arrow keys to navigate</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">{totalHighlights} highlights</div>
        </div>
      </div>

      {availableSections.length === 0 ? (
        <div className="p-6 border-2 border-dashed rounded-2xl text-center text-gray-500">No highlights to display.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar with section headers (side tabs) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              {availableSections.map((section, idx) => {
                const isActive = idx === activeSectionIndex
                return (
                  <button
                    key={section.key}
                    onClick={() => setActiveSectionIndex(idx)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                      isActive ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200' : 'bg-white/80 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{section.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border">{section.items.length}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Main content for active section */}
          <section className="lg:col-span-3">
            <div className={`border rounded-2xl p-6 lg:p-8 ${current?.colorClass || 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white/70 text-gray-700 border">{current.title}</span>
                <span className="text-xs text-gray-600">{activeSectionIndex + 1} / {availableSections.length}</span>
              </div>

              <div className="bg-white/80 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{current.title}</h3>
                <ul className="space-y-3">
                  {current.items.map((item, idx) => (
                    <li key={`${current.key}-${idx}`} className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-blue-500"></span>
                      <p className="text-gray-800 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={goPrevSection}
                  disabled={activeSectionIndex === 0}
                  className="inline-flex items-center px-4 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Previous section
                </button>
                <button
                  onClick={goNextSection}
                  disabled={activeSectionIndex >= availableSections.length - 1}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow"
                >
                  Next section
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">Important Disclaimer</h4>
                  <p className="text-sm text-blue-800">This analysis is informational only and not legal advice.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default SummaryDisplay