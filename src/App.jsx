import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chapter3 from './chapterList/chapter3'
import Chapter5 from './chapterList/chapter5'
import Chapter6 from './chapterList/chapter6'
import Chapter8 from './chapterList/chapter8'
import Chapter10 from './chapterList/chapter10'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chapter3" element={<Chapter3 />} />
        <Route path="/chapter5" element={<Chapter5 />} />
        <Route path="/chapter6" element={<Chapter6 />} />
        <Route path="/chapter8" element={<Chapter8 />} />
        <Route path="/chapter10" element={<Chapter10 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
