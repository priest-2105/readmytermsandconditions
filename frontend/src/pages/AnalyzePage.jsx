import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import FileUploadArea from '../components/FileUploadArea'
import TextAreaInput from '../components/TextAreaInput'
import SummaryDisplay from '../components/SummaryDisplay'

const AnalyzePage = () => {
  const location = useLocation()
  const [text, setText] = useState('')
  const [summary, setSummary] = useState(null)
  
  // Wrapper for setSummary with logging
  const setSummaryWithLogging = (data) => {
    console.log('🎯 Setting summary state:', data)
    setSummary(data)
  }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showInputs, setShowInputs] = useState(true)

  // Get API URL from environment or use default
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  }

  // Check for results from Chrome storage or URL parameters
  useEffect(() => {
    const checkForResults = async () => {
      console.log('=== FRONTEND: Checking for analysis results ===')
      
      // First, check if we're in a Chrome extension context
      if (typeof chrome !== 'undefined' && chrome.storage) {
        console.log('✅ Chrome storage is available')
        try {
          const result = await chrome.storage.local.get(['analysisResults', 'analysisTimestamp'])
          console.log('📦 Chrome storage result:', result)
          
          if (result.analysisResults) {
            console.log('📊 Found analysis results in storage')
            console.log('📊 Results data:', result.analysisResults)
            console.log('⏰ Timestamp:', result.analysisTimestamp)
            
            // Check if results are recent (within last 5 minutes)
            const isRecent = result.analysisTimestamp && 
              (Date.now() - result.analysisTimestamp) < 5 * 60 * 1000
            
            console.log('⏰ Results are recent:', isRecent)
            console.log('⏰ Time difference:', Date.now() - result.analysisTimestamp, 'ms')
            
            if (isRecent) {
              console.log('✅ Setting summary from Chrome storage')
              setSummaryWithLogging(result.analysisResults)
              setShowInputs(false)
              
              // Clear the storage after reading
              await chrome.storage.local.remove(['analysisResults', 'analysisTimestamp'])
              console.log('🗑️ Cleared Chrome storage')
              return
            } else {
              console.log('⏰ Results are too old, clearing storage')
              // Clear old results
              await chrome.storage.local.remove(['analysisResults', 'analysisTimestamp'])
            }
          } else {
            console.log('❌ No analysis results found in Chrome storage')
          }
        } catch (error) {
          console.error('❌ Error reading from Chrome storage:', error)
        }
      } else {
        console.log('❌ Chrome storage is not available')
      }

      // Fallback: Check for results in URL parameters (for backward compatibility)
      const urlParams = new URLSearchParams(window.location.search)
      const resultsParam = urlParams.get('results')
      
      if (resultsParam) {
        console.log('📊 Found results in URL parameters')
        try {
          const decodedResults = JSON.parse(decodeURIComponent(resultsParam))
          console.log('📊 URL results data:', decodedResults)
          setSummaryWithLogging(decodedResults)
          setShowInputs(false)
          return
        } catch (error) {
          console.error('❌ Failed to parse results from URL:', error)
          setError('Invalid results data received')
        }
      } else {
        console.log('❌ No results found in URL parameters')
      }

      // Handle data passed from landing page
      if (location.state?.fromLanding) {
        console.log('📊 Found data from landing page:', location.state)
        if (location.state.summary) {
          console.log('📊 Setting summary from landing page state')
          // If we have results from file upload, display them
          setSummaryWithLogging(location.state.summary)
          setShowInputs(false)
        } else if (location.state.textToAnalyze) {
          console.log('📝 Processing text from landing page state')
          // If we have text to analyze, process it automatically
          setShowInputs(false)
          processText(location.state.textToAnalyze)
        }
      } else {
        console.log('❌ No landing page state found')
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
    setSummaryWithLogging(analysis)
    setShowInputs(false)
  }

  const processText = async (inputText) => {
    setLoading(true)
    setError('')
    setSummary(null)

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze text')
      }

      const data = await response.json()
      setSummaryWithLogging(data)
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
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Navigation */}
      <motion.nav 
        className="relative z-10 px-6 py-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </motion.div>
            <span className="text-xl font-bold text-gray-900">TermsAnalyzer</span>
          </Link>
          <Link 
            to="/"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6"
            variants={scaleIn}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </motion.div>
          <motion.h1 
            className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4"
            variants={fadeInUp}
          >
            Terms & Conditions Analyzer
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600"
            variants={fadeInUp}
          >
            Upload a document or paste text to get an AI-powered analysis
          </motion.p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div 
            className="mb-8 p-6 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Show results if we have them from landing page */}
        {summary && location.state?.fromLanding ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SummaryDisplay summary={summary} />
          </motion.div>
        ) : (
          <>
            {/* Input Sections - Only show when showInputs is true */}
            {showInputs && (
              <motion.div 
                className="grid lg:grid-cols-2 gap-8 mb-12"
                initial="initial"
                animate="animate"
                variants={staggerContainer}
              >
                <motion.div 
                  className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
                  variants={scaleIn}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-6">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
                      <p className="text-gray-600">Drag & drop or click to browse</p>
                    </div>
                  </div>
                  <FileUploadArea onSubmit={handleFileSubmit} />
                </motion.div>

                <motion.div 
                  className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
                  variants={scaleIn}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-6">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Paste Text</h2>
                      <p className="text-gray-600">Direct text input for quick analysis</p>
                    </div>
                  </div>
                  <TextAreaInput onSubmit={handleTextSubmit} />
                </motion.div>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex flex-col items-center space-y-4">
                  <div className="relative">
                    <motion.div 
                      className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    <motion.div 
                      className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your document...</h3>
                    <p className="text-gray-600">This may take a few moments</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results */}
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="mb-8 text-center">
                  <motion.button
                    onClick={handleNewAnalysis}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Analysis
                  </motion.button>
                </div>
                <SummaryDisplay summary={summary} />
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

export default AnalyzePage 