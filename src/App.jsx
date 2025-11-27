import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Statistics from './pages/Statistics'
import Chapter2 from './chapterList/chapter2'
import Chapter3 from './chapterList/chapter3'
import Chapter5 from './chapterList/chapter5'
import Chapter6 from './chapterList/chapter6'
import Chapter7 from './chapterList/chapter7'
import Chapter8 from './chapterList/chapter8'
import Chapter10 from './chapterList/chapter10'
import ChapterTest from './chapterList/chapterTest'
import RandomizerQuiz from './chapterList/randomnizerQuiz'
import FullQuestionList from './chapterList/fullQuestionList'
import UxLaws from './litterature/uxLaws'
import Benyon12Lit from './litterature/benyon12lit'
import UxQuiz1 from './moreQuizes/uxQuiz1'
import UxQuiz2 from './moreQuizes/uxQuiz2'
import QuizFindIncorrect from './moreQuizes/quizFindIncorrect'
import Benyon12Quiz from './moreQuizes/benyon12Quiz'
import QuizFindIncorrect2 from './moreQuizes/quizFindIncorrect2'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home key="home" />} />
        <Route path="/home" element={<Home key="home2" />} />
        <Route path="/statistics" element={<Statistics key="stats" />} />
        <Route path="/chapter2" element={<Chapter2 key="ch2" />} />
        <Route path="/chapter3" element={<Chapter3 key="ch3" />} />
        <Route path="/chapter5" element={<Chapter5 key="ch5" />} />
        <Route path="/chapter6" element={<Chapter6 key="ch6" />} />
        <Route path="/chapter7" element={<Chapter7 key="ch7" />} />
        <Route path="/chapter8" element={<Chapter8 key="ch8" />} />
        <Route path="/chapter10" element={<Chapter10 key="ch10" />} />
        <Route path="/chaptertest" element={<ChapterTest key="chtest" />} />
        <Route path="/randomquiz" element={<RandomizerQuiz key="random" />} />
        <Route path="/fullquestions" element={<FullQuestionList key="fullq" />} />
        <Route path="/uxlaws" element={<UxLaws key="uxlaws" />} />
        <Route path="/benyon12lit" element={<Benyon12Lit key="benyon12lit" />} />
        <Route path="/uxquiz1" element={<UxQuiz1 key="uxquiz1" />} />
        <Route path="/uxquiz2" element={<UxQuiz2 key="uxquiz2" />} />
        <Route path="/findincorrect" element={<QuizFindIncorrect key="findincorrect" />} />
        <Route path="/benyon12" element={<Benyon12Quiz key="benyon12" />} />
        <Route path="/findincorrect2" element={<QuizFindIncorrect2 key="findincorrect2" />} />
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
