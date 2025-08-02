import { ArrowRight, Upload, Zap, CheckCircle, FileText, Shield, Clock, Users, Star, Play } from "lucide-react"
import { Link } from "react-router-dom"
import Navbar from "../components/navbar"
import { motion } from "framer-motion"

export default function LandingPage() {
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

  const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  return (
    <div className="min-h-screen bg-white">
    
    <Navbar/>

      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

        {/* Floating Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className="absolute top-40 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-500"
          animate={{ 
            y: [0, -15, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        ></motion.div>

        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <motion.div className="text-center lg:text-left" variants={slideInLeft}>
              {/* Badge */}
              <motion.span 
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 mb-6"
                variants={scaleIn}
              >
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Legal Analysis
              </motion.span>

              {/* Main Heading */}
              <motion.h1 
                className="text-5xl lg:text-6xl font-bold tracking-tight mb-8"
                variants={fadeInUp}
              >
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Decode Legal Jargon
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  in Seconds
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed"
                variants={fadeInUp}
              >
                Transform complex terms & conditions into clear, actionable insights. Our AI breaks down legal documents
                so you can make informed decisions with confidence.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12"
                variants={fadeInUp}
              >
                <Link to="/analyze">
                  <motion.button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FileText className="mr-2 w-5 h-5" />
                    Analyze Document Free
                  </motion.button>
                </Link>
                {/* <button className="border-2 border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-6 rounded-2xl font-semibold text-lg bg-transparent transition-all duration-300 flex items-center">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </button> */}
              </motion.div>

              {/* Social Proof */}
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-sm text-gray-500"
                variants={fadeInUp}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-white"></div>
                  </div>
                  <span>Trusted by 10,000+ users</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span>4.9/5 rating</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Interactive Preview */}
            <motion.div className="relative" variants={slideInRight}>
              <motion.div 
                className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
                // whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Mock Browser Header */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-4 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    termsanalyzer.com/analyze
                  </div>
                </div>

                {/* Upload Area */}
                <motion.div 
                  className="border-2 border-dashed border-blue-200 rounded-2xl p-8 mb-6 bg-blue-50/30 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <motion.div 
                      className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Upload className="w-8 h-8 text-blue-600" />
                    </motion.div>
                    <p className="text-gray-700 font-medium mb-2">Drop your terms & conditions here</p>
                    <p className="text-sm text-gray-500">PDF, DOCX, TXT or paste text directly</p>
                  </div>
                </motion.div>

                {/* Sample Analysis Results */}
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-800">Analysis Complete</p>
                      <p className="text-sm text-green-600">Document processed in 2.3 seconds</p>
                    </div>
                  </motion.div>

                  <div className="space-y-3">
                    <motion.div 
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-red-800">High Risk Clause Found</span>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Critical
                      </span>
                    </motion.div>

                    <motion.div 
                      className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-yellow-800">Data Collection Terms</span>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Review
                      </span>
                    </motion.div>

                    <motion.div 
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1, duration: 0.5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-800">Cancellation Policy</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Clear
                      </span>
                    </motion.div>
                  </div>

                  {/* Action Button */}
                  <motion.button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold mt-6 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                  >
                    <FileText className="mr-2 w-4 h-4" />
                    View Full Analysis
                  </motion.button>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium">AI Processing</span>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">100% Secure</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-white border-y border-gray-100"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-gray-600 font-medium">Free to Use</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <Clock className="w-10 h-10 mx-auto mb-2 text-green-600" />
              <div className="text-gray-600 font-medium">Instant Results</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                AI
              </div>
              <div className="text-gray-600 font-medium">Powered Analysis</div>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <Shield className="w-10 h-10 mx-auto mb-2 text-orange-600" />
              <div className="text-gray-600 font-medium">Secure & Private</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        id="how-it-works" 
        className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-20" variants={fadeInUp}>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200 mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get clear insights from any legal document in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <motion.div 
              className="relative bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              variants={scaleIn}
              whileHover={{ y: -10 }}
            >
              <div className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Upload className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <div className="pt-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-blue-200 text-blue-600 mb-4">
                    Step 1
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Upload PDF, DOCX, or TXT files, or paste your terms and conditions text directly into our secure
                    platform.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="relative bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              variants={scaleIn}
              whileHover={{ y: -10 }}
            >
              <div className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Zap className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <div className="pt-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-green-200 text-green-600 mb-4">
                    Step 2
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Analysis</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our advanced AI processes the document, identifying key clauses, risks, and important terms in
                    seconds.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              className="relative bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              variants={scaleIn}
              whileHover={{ y: -10 }}
            >
              <div className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <div className="pt-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-purple-200 text-purple-600 mb-4">
                    Step 3
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Clear Insights</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Receive a comprehensive breakdown of risks, obligations, rights, and key points in plain English.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features" 
        className="py-24 bg-white"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={slideInLeft}>
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 mb-4">
                Powerful Features
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Why Choose TermsAnalyzer?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Our AI-powered platform makes legal documents accessible to everyone, not just lawyers.
              </p>

              <div className="space-y-6">
                <motion.div 
                  className="flex items-start gap-4"
                  variants={fadeInUp}
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Risk Assessment</h3>
                    <p className="text-gray-600">
                      Automatically identifies potential risks and red flags in legal documents.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-4"
                  variants={fadeInUp}
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Plain English Translation</h3>
                    <p className="text-gray-600">Converts complex legal jargon into clear, understandable language.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-4"
                  variants={fadeInUp}
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Instant Processing</h3>
                    <p className="text-gray-600">Get comprehensive analysis results in seconds, not hours.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div className="relative" variants={slideInRight}>
              <motion.div 
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="TermsAnalyzer Dashboard"
                  width={500}
                  height={400}
                  className="rounded-2xl shadow-lg"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section 
        className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Understand Your Terms?</h2>
          <p className="text-xl lg:text-2xl mb-12 opacity-90">
            Join thousands of users who trust TermsAnalyzer to decode legal documents. Start your free analysis today.
          </p>
          <Link to="/analyze">
            <motion.button 
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="mr-2 w-5 h-5" />
              Start Analyzing Now
            </motion.button>
          </Link>
          <p className="text-sm mt-6 opacity-75">No signup required • 100% free • Secure & private</p>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 text-white py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TermsAnalyzer</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Making legal terms understandable for everyone. Empowering users to make informed decisions with
                confidence.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 TermsAnalyzer. This tool is for informational purposes only and should not be considered as legal
              advice.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
