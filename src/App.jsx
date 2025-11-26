import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Statistics from './pages/Statistics'
import Chapter3 from './chapterList/chapter3'
import Chapter5 from './chapterList/chapter5'
import Chapter6 from './chapterList/chapter6'
import Chapter8 from './chapterList/chapter8'
import Chapter10 from './chapterList/chapter10'
import ChapterTest from './chapterList/chapterTest'
import RandomizerQuiz from './chapterList/randomnizerQuiz'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home key="home" />} />
        <Route path="/home" element={<Home key="home2" />} />
        <Route path="/statistics" element={<Statistics key="stats" />} />
        <Route path="/chapter3" element={<Chapter3 key="ch3" />} />
        <Route path="/chapter5" element={<Chapter5 key="ch5" />} />
        <Route path="/chapter6" element={<Chapter6 key="ch6" />} />
        <Route path="/chapter8" element={<Chapter8 key="ch8" />} />
        <Route path="/chapter10" element={<Chapter10 key="ch10" />} />
        <Route path="/chaptertest" element={<ChapterTest key="chtest" />} />
        <Route path="/randomquiz" element={<RandomizerQuiz key="random" />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
