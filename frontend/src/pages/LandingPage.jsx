import { ArrowRight, Upload, CheckCircle, FileText, Shield, Clock, Users } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/navbar"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import FileUploadArea from "../components/FileUploadArea"
import TextAreaInput from "../components/TextAreaInput"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
}

const AnalysisPreview = () => {
  const categories = [
    {
      label: "Things to Know",
      colorClass: "bg-blue-50 border-blue-100 text-blue-800",
      dotClass: "bg-blue-400",
      items: [
        "Data is retained for up to 24 months after account closure",
        "Service availability is not guaranteed at all times",
      ],
    },
    {
      label: "Risks",
      colorClass: "bg-red-50 border-red-100 text-red-800",
      dotClass: "bg-red-400",
      items: [
        "Third-party data sharing is permitted without individual notification",
        "Arbitration clause limits your ability to pursue legal action",
      ],
    },
    {
      label: "Your Rights",
      colorClass: "bg-green-50 border-green-100 text-green-800",
      dotClass: "bg-green-500",
      items: [
        "You may request deletion of your personal data at any time",
        "You can opt out of marketing communications",
      ],
    },
    {
      label: "Your Obligations",
      colorClass: "bg-orange-50 border-orange-100 text-orange-800",
      dotClass: "bg-orange-400",
      items: [
        "Keep account credentials confidential",
        "You are liable for all activity under your account",
      ],
    },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          <span className="text-sm font-medium text-gray-900">Analysis complete</span>
        </div>
        <span className="text-xs text-gray-400">6 categories · 18 highlights</span>
      </div>
      <div className="p-5 space-y-3">
        {categories.map((cat) => (
          <div key={cat.label} className={`rounded-md border p-3 ${cat.colorClass}`}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-60">
              {cat.label}
            </div>
            {cat.items.map((item, i) => (
              <div key={i} className="flex items-start gap-2 mb-1 last:mb-0">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${cat.dotClass}`} />
                <span className="text-xs leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        ))}
        <p className="text-center text-xs text-gray-400 pt-1">+ Important Points and Additional Notes</p>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [canAnalyze, setCanAnalyze] = useState(true)

  const startAnalysisTimer = () => {
    const cooldownDuration = 30 * 60 * 1000
    const endTime = Date.now() + cooldownDuration
    localStorage.setItem('analysisCooldownEnd', endTime.toString())
    setCanAnalyze(false)
    setTimeRemaining(cooldownDuration)
    const timer = setInterval(() => {
      const remaining = endTime - Date.now()
      if (remaining <= 0) {
        clearInterval(timer)
        setCanAnalyze(true)
        setTimeRemaining(0)
        localStorage.removeItem('analysisCooldownEnd')
      } else {
        setTimeRemaining(remaining)
      }
    }, 1000)
  }

  const formatTimeRemaining = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const checkLocalStorage = () => {
    const storedEndTime = localStorage.getItem('analysisCooldownEnd')
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime)
      const remaining = endTime - Date.now()
      if (remaining > 0) {
        setCanAnalyze(false)
        setTimeRemaining(remaining)
        const timer = setInterval(() => {
          const currentRemaining = endTime - Date.now()
          if (currentRemaining <= 0) {
            clearInterval(timer)
            setCanAnalyze(true)
            setTimeRemaining(0)
            localStorage.removeItem('analysisCooldownEnd')
          } else {
            setTimeRemaining(currentRemaining)
          }
        }, 1000)
      } else {
        localStorage.removeItem('analysisCooldownEnd')
        setCanAnalyze(true)
        setTimeRemaining(0)
      }
    }
  }

  useEffect(() => {
    checkLocalStorage()
  }, [])

  const handleFileSubmit = async (analysis) => {
    if (!canAnalyze) return
    setIsProcessing(true)
    localStorage.setItem('analysisResults', JSON.stringify(analysis))
    startAnalysisTimer()
    navigate('/analyze', { state: { summary: analysis, fromLanding: true } })
  }

  const handleTextSubmit = async (inputText) => {
    if (!canAnalyze) return
    setIsProcessing(true)
    localStorage.setItem('textToAnalyze', inputText)
    startAnalysisTimer()
    navigate('/analyze', { state: { textToAnalyze: inputText, fromLanding: true } })
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--c-bg)' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="dot-grid-bg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left column */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="pt-4"
            >
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                AI Legal Analysis
              </motion.span>

              <motion.h1
                variants={fadeUp}
                className="text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Read the Terms.
                <br />
                <span className="italic">Know the Risks.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Paste or upload any terms and conditions document. Get a plain-English breakdown
                of risks, obligations, and rights — organized into six clear categories.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500"
              >
                <span>No signup required</span>
                <span className="text-gray-300">·</span>
                <span>Free to use</span>
                <span className="text-gray-300">·</span>
                <span>Secure and private</span>
              </motion.div>
            </motion.div>

            {/* Right column — upload widget */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                {/* Tab switcher */}
                <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('upload')}
                    disabled={!canAnalyze}
                    className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 ${
                      activeTab === 'upload'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    } ${!canAnalyze ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                  </button>
                  <button
                    onClick={() => setActiveTab('text')}
                    disabled={!canAnalyze}
                    className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 ${
                      activeTab === 'text'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    } ${!canAnalyze ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Paste Text
                  </button>
                </div>

                {/* Cooldown warning */}
                {!canAnalyze && (
                  <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Cooldown active</p>
                        <p className="text-xs text-amber-600">Wait before starting a new analysis</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-amber-700 tabular-nums">
                      {formatTimeRemaining(timeRemaining)}
                    </span>
                  </div>
                )}

                {/* Tab content */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'upload' ? (
                    <FileUploadArea onSubmit={handleFileSubmit} disabled={!canAnalyze} />
                  ) : (
                    <TextAreaInput onSubmit={handleTextSubmit} disabled={!canAnalyze} />
                  )}
                </motion.div>

                {/* Processing state */}
                {isProcessing && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    <span className="text-sm font-medium text-blue-800">Processing your document...</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="how-it-works" className="py-24 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mb-14"
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
              Process
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl text-gray-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Three steps to clarity
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                step: "01",
                icon: <Upload className="w-5 h-5 text-blue-600" />,
                title: "Upload your document",
                body: "Upload a PDF, DOCX, or TXT file, or paste the text directly. Files are processed in memory and never stored.",
              },
              {
                step: "02",
                icon: <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
                title: "AI reads and extracts",
                body: "The AI scans every clause, identifies meaningful language, and maps findings to six structured categories.",
              },
              {
                step: "03",
                icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
                title: "Review plain-English insights",
                body: "Navigate the results by category — risks, obligations, rights, and more — and decide what matters to you.",
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-semibold text-gray-200 tabular-nums" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24" style={{ backgroundColor: 'var(--c-bg)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left: feature list */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">
                What you get
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-4xl text-gray-900 mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Built for people,
                <br />
                <span className="italic">not lawyers</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-600 mb-10 leading-relaxed max-w-md">
                Legal documents are designed to be comprehensive, not readable.
                TermsAnalyzer bridges that gap without requiring any legal expertise.
              </motion.p>

              <div className="space-y-6">
                {[
                  {
                    icon: <Shield className="w-5 h-5 text-blue-600" />,
                    bg: "bg-blue-50",
                    title: "Risk identification",
                    body: "Surfaces clauses that could expose you to liability, data sharing, or loss of rights.",
                  },
                  {
                    icon: <Users className="w-5 h-5 text-gray-700" />,
                    bg: "bg-gray-100",
                    title: "Plain-English translation",
                    body: "Every finding is written in plain language — no legal training needed to understand it.",
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-gray-700" />,
                    bg: "bg-gray-100",
                    title: "Structured six-category output",
                    body: "Results are always organized into the same six categories so you know where to look.",
                  },
                  {
                    icon: <FileText className="w-5 h-5 text-gray-700" />,
                    bg: "bg-gray-100",
                    title: "Multiple input formats",
                    body: "Accepts PDF, DOCX, TXT files up to 5 MB, or direct text paste with no character limit on uploads.",
                  },
                ].map((f) => (
                  <motion.div
                    key={f.title}
                    variants={fadeUp}
                    className="flex items-start gap-4"
                  >
                    <div className={`w-10 h-10 ${f.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{f.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: real analysis preview */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Example output
              </p>
              <AnalysisPreview />
              <p className="mt-3 text-xs text-gray-400 text-center">
                Sample analysis — actual results depend on the document analyzed.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center px-6"
        >
          <h2
            className="text-4xl lg:text-5xl text-white mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Stop agreeing to things
            <br />
            <span className="italic">you haven't read.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Upload your next terms and conditions document before you accept.
            It takes less than a minute.
          </p>
          <Link to="/analyze">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-base transition-colors inline-flex items-center gap-2.5"
            >
              <FileText className="w-4 h-4" />
              Analyze a Document
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  TermsAnalyzer
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                AI-powered analysis of legal documents.
                For informational purposes only — not legal advice.
              </p>
            </div>

            <div className="flex gap-16">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Navigate</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>
                    <button
                      onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                      className="hover:text-gray-300 transition-colors"
                    >
                      Features
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                      className="hover:text-gray-300 transition-colors"
                    >
                      How it Works
                    </button>
                  </li>
                  <li>
                    <Link to="/analyze" className="hover:text-gray-300 transition-colors">
                      Analyzer
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-xs text-gray-600">
              &copy; 2025 TermsAnalyzer. This tool is for informational purposes only and does not constitute legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
