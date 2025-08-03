import { useState } from 'react'
import Analyzer from './components/Analyzer'
import Header from './components/Header'

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <div className="w-96 h-96 bg-white">
      <Header />
      <Analyzer isAnalyzing={isAnalyzing} setIsAnalyzing={setIsAnalyzing} />
    </div>
  )
}

export default App
