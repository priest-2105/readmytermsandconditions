import { ArrowRight, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Navbar() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
      <motion.nav 
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <FileText className="w-5 h-5 text-white" />
                </motion.div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                TermsAnalyzer
              </span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-8">
              <motion.a 
                href="#features" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('features')
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Features
              </motion.a>
              <motion.a 
                href="#how-it-works" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('how-it-works')
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                How it Works
              </motion.a>
              <motion.a 
                href="#pricing" 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('pricing')
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Pricing
              </motion.a>
            </div>
            <Link to="/analyze">
              <motion.button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Analyzing
                <ArrowRight className="ml-2 w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
    </motion.nav>

  )
}
