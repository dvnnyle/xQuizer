import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import uxData from '../../dataBank/dataSub.json/uxData.json'
import '../chapterList/chapter3.css'

// Import all UX law images
import AestheticUsabilityEffect from '../assets/uxImg/AestheticUsabilityEffect.png'
import DohertyThreshold from '../assets/uxImg/DohertyThreshold.png'
import FittsLaw from '../assets/uxImg/FittsLaw.png'
import hicksLaw from '../assets/uxImg/hicksLaw.png'
import jakobLaw from '../assets/uxImg/jakobLaw.png'
import lawofcommenregion from '../assets/uxImg/lawofcommenregion.png'
import lawofpragnaz from '../assets/uxImg/lawofpragnaz.png'
import lawofproximity from '../assets/uxImg/lawofproximity.png'
import lawofsimilaraity from '../assets/uxImg/lawofsimilaraity.png'
import lawofuniformconectedneess from '../assets/uxImg/lawofuniformconectedneess.png'
import millersLaw from '../assets/uxImg/millersLaw.png'
import occamRazor from '../assets/uxImg/occamRazor.png'
import ParetoPrinciple from '../assets/uxImg/ParetoPrinciple.png'
import parkinsonslaw from '../assets/uxImg/parkinsonslaw.png'
import peakEndrule from '../assets/uxImg/peakEndrule.png'
import postelslaw from '../assets/uxImg/postelslaw.png'
import SerialpostitonEffect from '../assets/uxImg/SerialpostitonEffect.png'
import teslerLaw from '../assets/uxImg/teslerLaw.png'
import vonRestorffEffect from '../assets/uxImg/vonRestorffEffect.png'
import ZeigarnikEffect from '../assets/uxImg/ZeigarnikEffect.png'
import chunking from '../assets/uxImg/chunking.png'

const imageMap = {
  '/src/assets/uxImg/AestheticUsabilityEffect.png': AestheticUsabilityEffect,
  '/src/assets/uxImg/DohertyThreshold.png': DohertyThreshold,
  '/src/assets/uxImg/FittsLaw.png': FittsLaw,
  '/src/assets/uxImg/hicksLaw.png': hicksLaw,
  '/src/assets/uxImg/jakobLaw.png': jakobLaw,
  '/src/assets/uxImg/lawofcommenregion.png': lawofcommenregion,
  '/src/assets/uxImg/lawofpragnaz.png': lawofpragnaz,
  '/src/assets/uxImg/lawofproximity.png': lawofproximity,
  '/src/assets/uxImg/lawofsimilaraity.png': lawofsimilaraity,
  '/src/assets/uxImg/lawofuniformconectedneess.png': lawofuniformconectedneess,
  '/src/assets/uxImg/millersLaw.png': millersLaw,
  '/src/assets/uxImg/occamRazor.png': occamRazor,
  '/src/assets/uxImg/ParetoPrinciple.png': ParetoPrinciple,
  '/src/assets/uxImg/parkinsonslaw.png': parkinsonslaw,
  '/src/assets/uxImg/peakEndrule.png': peakEndrule,
  '/src/assets/uxImg/postelslaw.png': postelslaw,
  '/src/assets/uxImg/SerialpostitonEffect.png': SerialpostitonEffect,
  '/src/assets/uxImg/teslerLaw.png': teslerLaw,
  '/src/assets/uxImg/vonRestorffEffect.png': vonRestorffEffect,
  '/src/assets/uxImg/ZeigarnikEffect.png': ZeigarnikEffect,
  '/src/assets/uxImg/chunking.png': chunking
}

// Function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function UxMatchLaws() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [imageOptions, setImageOptions] = useState([])

  // Generate shuffled questions with image options
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    // Create questions from uxData
    const generatedQuestions = uxData.map((law) => {
      // Get 3 random wrong images
      const wrongImages = uxData
        .filter(l => l.id !== law.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(l => l.image)

      // Combine with correct image and shuffle
      const allImages = shuffleArray([law.image, ...wrongImages])
      const correctIndex = allImages.indexOf(law.image)

      return {
        id: law.id,
        question: `Which image represents ${law.law}?`,
        law: law.law,
        description: law.description,
        example: law.example,
        correctImage: law.image,
        options: allImages,
        answerIndex: correctIndex
      }
    })

    setQuestions(generatedQuestions)
  }, [])

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerClick = (index) => {
    if (selectedAnswer !== null) return // Already answered

    setSelectedAnswer(index)
    const isCorrect = index === currentQuestion.answerIndex

    // Store the answer
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = { selectedIndex: index, isCorrect }
    setUserAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      const nextAnswer = userAnswers[currentQuestionIndex + 1]
      setSelectedAnswer(nextAnswer ? nextAnswer.selectedIndex : null)
      setAnsweredQuestions(answeredQuestions + 1)
    } else {
      setAnsweredQuestions(answeredQuestions + 1)
      const finalScore = score + (currentQuestion.answerIndex === selectedAnswer ? 1 : 0)
      
      // Save to localStorage
      const existingData = localStorage.getItem('quiz_uxmatchlaws')
      const previousData = existingData ? JSON.parse(existingData) : { bestScore: 0, attempts: 0, attemptHistory: [] }
      
      const newAttempt = { score: finalScore, date: new Date().toISOString() }
      const attemptHistory = [...(previousData.attemptHistory || []), newAttempt]
      
      localStorage.setItem('quiz_uxmatchlaws', JSON.stringify({
        score: finalScore,
        completed: questions.length,
        total: questions.length,
        bestScore: Math.max(finalScore, previousData.bestScore || 0),
        attempts: (previousData.attempts || 0) + 1,
        attemptHistory: attemptHistory
      }))
      
      setShowResult(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      const prevAnswer = userAnswers[currentQuestionIndex - 1]
      setSelectedAnswer(prevAnswer ? prevAnswer.selectedIndex : null)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnsweredQuestions(0)
    setUserAnswers([])
    setShowReview(false)
    
    // Regenerate questions with new shuffled options
    const generatedQuestions = uxData.map((law) => {
      const wrongImages = uxData
        .filter(l => l.id !== law.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(l => l.image)

      const allImages = shuffleArray([law.image, ...wrongImages])
      const correctIndex = allImages.indexOf(law.image)

      return {
        id: law.id,
        question: `Which image represents ${law.law}?`,
        law: law.law,
        description: law.description,
        example: law.example,
        correctImage: law.image,
        options: allImages,
        answerIndex: correctIndex
      }
    })

    setQuestions(generatedQuestions)
  }

  const handleReview = () => {
    setShowReview(true)
    setShowResult(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(userAnswers[0] ? userAnswers[0].selectedIndex : null)
  }

  const handleBackToHome = () => {
    window.location.href = '/'
  }

  if (questions.length === 0) {
    return <div className="loading">Loading quiz...</div>
  }

  if (showResult && !showReview) {
    const percentage = ((score / questions.length) * 100).toFixed(0)
    return (
      <div className="quiz-container">
        <NavigationMenu />
        <motion.div
          className="result-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Quiz Complete! 🎉</h2>
          <div className="score-display">
            <div className="score-number">{score}/{questions.length}</div>
            <div className="score-percentage">{percentage}%</div>
          </div>
          <div className="button-group">
            <button onClick={handleReview} className="review-btn">
              Review Answers
            </button>
            <button onClick={handleRestart} className="restart-btn">
              Try Again
            </button>
            <button onClick={handleBackToHome} className="home-btn">
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <NavigationMenu />
      <div className="quiz-content">
        <div className="quiz-header">
          <h1>UX Laws - Image Matching</h1>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="question-counter">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        <motion.div
          key={currentQuestionIndex}
          className="question-card"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="question-text">{currentQuestion.question}</h2>

          <div className="image-options-grid">
            {currentQuestion.options.map((imagePath, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.answerIndex
              const showCorrect = selectedAnswer !== null && isCorrect
              const showWrong = selectedAnswer !== null && isSelected && !isCorrect

              return (
                <motion.div
                  key={index}
                  className={`image-option ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''}`}
                  onClick={() => handleAnswerClick(index)}
                  whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                  whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                >
                  <img 
                    src={imageMap[imagePath] || imagePath} 
                    alt={`Option ${index + 1}`}
                    className="law-image"
                  />
                  {showCorrect && <span className="check-icon">✓</span>}
                  {showWrong && <span className="x-icon">✗</span>}
                </motion.div>
              )
            })}
          </div>

          {selectedAnswer !== null && (
            <motion.div
              className="explanation-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3>{currentQuestion.law}</h3>
              <p className="explanation-description">
                <strong>Description:</strong> {currentQuestion.description}
              </p>
              <p className="explanation-example">
                <strong>Example:</strong> {currentQuestion.example}
              </p>
            </motion.div>
          )}
        </motion.div>

        <div className="navigation-buttons">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="nav-btn prev-btn"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="nav-btn next-btn"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next →'}
          </button>
        </div>

        {showReview && (
          <div className="review-indicator">
            Review Mode - Question {currentQuestionIndex + 1}/{questions.length}
          </div>
        )}
      </div>
    </div>
  )
}

export default UxMatchLaws
