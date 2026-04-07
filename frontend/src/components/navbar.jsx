import { FileText, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function Navbar() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              TermsAnalyzer
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              How it Works
            </button>
          </div>

          <Link to="/analyze">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              Start Analyzing
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
