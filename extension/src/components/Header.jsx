import { FileText, Zap } from 'lucide-react'

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Terms Analyzer</h1>
            <p className="text-xs text-blue-100">AI-Powered Analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Zap className="w-4 h-4 text-yellow-300" />
          <span className="text-xs font-medium">AI</span>
        </div>
      </div>
    </div>
  )
}

export default Header 