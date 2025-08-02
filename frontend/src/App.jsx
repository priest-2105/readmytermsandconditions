import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AnalyzePage from './pages/AnalyzePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
      </Routes>
    </Router>
  )
}

export default App
