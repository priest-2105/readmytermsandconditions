import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, ArrowLeft, Plus } from 'lucide-react'
import FileUploadArea from '../components/FileUploadArea'
import TextAreaInput from '../components/TextAreaInput'
import SummaryDisplay from '../components/SummaryDisplay'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
}

const AnalyzePage = () => {
  const location = useLocation()
  const [text, setText] = useState('')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showInputs, setShowInputs] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [canAnalyze, setCanAnalyze] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const setSummaryWithLogging = (data) => {
    setSummary(data)
  }

  const startAnalysisTimer = (analysisTime) => {
    const timer = setInterval(() => {
      const now = Date.now()
      const elapsed = now - analysisTime
      const remaining = (30 * 60 * 1000) - elapsed
      if (remaining <= 0) {
        setTimeRemaining(0)
        setCanAnalyze(true)
        setSummary(null)
        setShowInputs(true)
        clearInterval(timer)
        localStorage.removeItem('webAnalysisResults')
        localStorage.removeItem('webAnalysisTimestamp')
        localStorage.removeItem('webAnalysisTimer')
      } else {
        setTimeRemaining(remaining)
      }
    }, 1000)
    return timer
  }

  const formatTimeRemaining = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const checkLocalStorage = () => {
    try {
      const storedResults = localStorage.getItem('webAnalysisResults')
      const storedTimestamp = localStorage.getItem('webAnalysisTimestamp')
      if (storedResults && storedTimestamp) {
        const analysisTime = parseInt(storedTimestamp)
        const now = Date.now()
        const elapsed = now - analysisTime
        const remaining = (30 * 60 * 1000) - elapsed
        if (remaining > 0) {
          const results = JSON.parse(storedResults)
          setSummary(results)
          setShowInputs(false)
          setCanAnalyze(false)
          setTimeRemaining(remaining)
          startAnalysisTimer(analysisTime)
          return true
        } else {
          localStorage.removeItem('webAnalysisResults')
          localStorage.removeItem('webAnalysisTimestamp')
          localStorage.removeItem('webAnalysisTimer')
        }
      }
    } catch (error) {
      console.error('Error reading from local storage:', error)
    }
    return false
  }

  useEffect(() => {
    const checkForResults = async () => {
      const hasLocalResults = checkLocalStorage()
      if (hasLocalResults) return

      const urlParams = new URLSearchParams(window.location.search)
      const resultsParam = urlParams.get('results')
      if (resultsParam) {
        try {
          const decodedResults = JSON.parse(decodeURIComponent(resultsParam))
          setSummaryWithLogging(decodedResults)
          setShowInputs(false)
          const newUrl = window.location.pathname
          window.history.replaceState({}, document.title, newUrl)
          return
        } catch (error) {
          setError('Invalid results data received')
        }
      }

      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        try {
          const result = await chrome.storage.local.get(['analysisResults', 'analysisTimestamp'])
          if (result.analysisResults) {
            const isRecent = result.analysisTimestamp &&
              (Date.now() - result.analysisTimestamp) < 5 * 60 * 1000
            if (isRecent) {
              setSummaryWithLogging(result.analysisResults)
              setShowInputs(false)
              await chrome.storage.local.remove(['analysisResults', 'analysisTimestamp'])
              return
            } else {
              await chrome.storage.local.remove(['analysisResults', 'analysisTimestamp'])
            }
          }
        } catch (error) {
          console.error('Error reading from Chrome storage:', error)
        }
      }

      if (location.state?.fromLanding) {
        if (location.state.summary) {
          setSummaryWithLogging(location.state.summary)
          setShowInputs(false)
        } else if (location.state.textToAnalyze) {
          setShowInputs(false)
          processText(location.state.textToAnalyze)
        }
      }
    }

    checkForResults()
  }, [location.state])

  const handleTextSubmit = async (inputText) => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze')
      return
    }
    setShowInputs(false)
    await processText(inputText)
  }

  const handleFileSubmit = async (analysis) => {
    if (!canAnalyze) {
      setError('Please wait for the cooldown to expire before starting a new analysis')
      return
    }
    const analysisTime = Date.now()
    localStorage.setItem('webAnalysisResults', JSON.stringify(analysis))
    localStorage.setItem('webAnalysisTimestamp', analysisTime.toString())
    setSummaryWithLogging(analysis)
    setCanAnalyze(false)
    setShowInputs(false)
    startAnalysisTimer(analysisTime)
  }

  const processText = async (inputText) => {
    if (!canAnalyze) {
      setError('Please wait for the cooldown to expire before starting a new analysis')
      return
    }
    setLoading(true)
    setError('')
    setSummary(null)
    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze text')
      }
      const data = await response.json()
      const analysisTime = Date.now()
      localStorage.setItem('webAnalysisResults', JSON.stringify(data))
      localStorage.setItem('webAnalysisTimestamp', analysisTime.toString())
      setSummaryWithLogging(data)
      setCanAnalyze(false)
      setShowInputs(false)
      startAnalysisTimer(analysisTime)
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the text')
    } finally {
      setLoading(false)
    }
  }

  const handleNewAnalysis = () => {
    setSummary(null)
    setLoading(false)
    setError('')
    setShowInputs(true)
    setCanAnalyze(true)
    setTimeRemaining(0)
    localStorage.removeItem('webAnalysisResults')
    localStorage.removeItem('webAnalysisTimestamp')
    localStorage.removeItem('webAnalysisTimer')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c-bg)' }}>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              TermsAnalyzer
            </span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Page header */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-10"
        >
          <h1
            className="text-4xl text-gray-900 mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Document Analyzer
          </h1>
          <p className="text-gray-600">
            Upload a document or paste text to get an AI-powered breakdown.
          </p>
        </motion.div>

        {/* Extension results banner */}
        {summary && window.location.search.includes('results=') && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <p className="text-sm font-medium text-green-800">Analysis results received from extension.</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {summary && location.state?.fromLanding ? (
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <SummaryDisplay summary={summary} />
          </motion.div>
        ) : (
          <>
            {/* Cooldown notice */}
            {!canAnalyze && timeRemaining > 0 && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-amber-800">Cooldown active — please wait before starting a new analysis.</p>
                </div>
                <span className="text-base font-semibold text-amber-700 tabular-nums ml-4">
                  {formatTimeRemaining(timeRemaining)}
                </span>
              </div>
            )}

            {/* Input cards */}
            {showInputs && (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                className="grid lg:grid-cols-2 gap-6 mb-10"
              >
                <motion.div variants={fadeUp} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Upload Document</h2>
                      <p className="text-xs text-gray-500">PDF, DOCX, DOC, or TXT — max 5 MB</p>
                    </div>
                  </div>
                  <FileUploadArea onSubmit={handleFileSubmit} disabled={!canAnalyze} />
                </motion.div>

                <motion.div variants={fadeUp} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Paste Text</h2>
                      <p className="text-xs text-gray-500">Minimum 100 characters required</p>
                    </div>
                  </div>
                  <TextAreaInput onSubmit={handleTextSubmit} disabled={!canAnalyze} />
                </motion.div>
              </motion.div>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-20">
                <div className="inline-flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <div>
                    <p className="text-base font-medium text-gray-900">Analyzing your document</p>
                    <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {summary && (
              <motion.div initial="hidden" animate="show" variants={fadeUp}>
                {/* Timer when results shown */}
                {!canAnalyze && timeRemaining > 0 && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                    <p className="text-sm text-amber-800">Next analysis available in:</p>
                    <span className="text-base font-semibold text-amber-700 tabular-nums">
                      {formatTimeRemaining(timeRemaining)}
                    </span>
                  </div>
                )}

                <div className="mb-6 flex justify-end">
                  {canAnalyze ? (
                    <button
                      onClick={handleNewAnalysis}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      New Analysis
                    </button>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      New Analysis (cooldown)
                    </div>
                  )}
                </div>

                <SummaryDisplay summary={summary} />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AnalyzePage
