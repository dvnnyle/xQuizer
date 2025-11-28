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

// Function to normalize string for comparison (remove spaces, apostrophes, make lowercase)
const normalizeString = (str) => {
  return str.toLowerCase().replace(/['\s-]/g, '')
}

// Function to calculate Levenshtein distance for fuzzy matching
const levenshteinDistance = (str1, str2) => {
  const matrix = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}

// Function to check if answer is correct (allows for slight typos)
const isAnswerCorrect = (userAnswer, correctAnswer) => {
  const normalizedUser = normalizeString(userAnswer)
  const normalizedCorrect = normalizeString(correctAnswer)
  
  // Exact match
  if (normalizedUser === normalizedCorrect) {
    return true
  }
  
  // Extract the core name (remove common words like "law", "effect", "principle", "rule", "of", "threshold")
  const removeCommonWords = (str) => {
    return str.replace(/\b(law|effect|principle|rule|the|of|threshold)\b/gi, '').replace(/\s+/g, '').toLowerCase()
  }
  
  const coreUser = removeCommonWords(userAnswer)
  const coreCorrect = removeCommonWords(correctAnswer)
  
  // Check if core names match (handles "parkinsons" vs "parkinsons law" vs "law of parkinsons")
  if (coreUser === coreCorrect && coreUser.length >= 4) {
    return true
  }
  
  // Check if user's core answer is contained in the correct core answer
  // This handles partial matches like "aesthetic" matching "aestheticusability"
  // or "restorff" matching "vonrestorff", "doherty" matching "doherty"
  if (coreCorrect.includes(coreUser) && coreUser.length >= 4) {
    return true
  }
  
  // Check if correct core answer is contained in user's answer
  // This handles cases where user adds extra words
  if (coreUser.includes(coreCorrect) && coreCorrect.length >= 4) {
    return true
  }
  
  // Check if user answer is contained in correct answer or vice versa
  // This handles cases like "zeigarnik" matching "Zeigarnik Effect"
  // or "pareto" matching "Pareto Principle"
  if (normalizedCorrect.includes(normalizedUser) || normalizedUser.includes(normalizedCorrect)) {
    // Only accept if it's a substantial match (at least 50% of the correct answer)
    const matchRatio = Math.min(normalizedUser.length, normalizedCorrect.length) / 
                       Math.max(normalizedUser.length, normalizedCorrect.length)
    if (matchRatio >= 0.5) {
      return true
    }
  }
  
  // Allow typos: max distance of 2 for strings longer than 5 chars
  if (normalizedCorrect.length > 5) {
    const distance = levenshteinDistance(normalizedUser, normalizedCorrect)
    return distance <= 2
  }
  
  // For shorter strings, allow distance of 1
  if (normalizedCorrect.length > 3) {
    const distance = levenshteinDistance(normalizedUser, normalizedCorrect)
    return distance <= 1
  }
  
  return false
}

function NameTheLaw() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [loadedImages, setLoadedImages] = useState({})

  // Generate shuffled questions
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    // Preload all images
    Object.values(imageMap).forEach((src) => {
      const img = new Image()
      img.src = src
    })

    // Shuffle the laws for random order
    const shuffled = [...uxData].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
  }, [])

  const currentQuestion = questions[currentQuestionIndex]

  const handleSubmit = () => {
    if (userInput.trim() === '' || selectedAnswer !== null) return

    const isCorrect = isAnswerCorrect(userInput, currentQuestion.law)
    
    // Store the answer
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = { 
      userAnswer: userInput, 
      correctAnswer: currentQuestion.law,
      isCorrect 
    }
    setUserAnswers(newAnswers)
    setSelectedAnswer(isCorrect)

    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      const nextAnswer = userAnswers[currentQuestionIndex + 1]
      setUserInput(nextAnswer ? nextAnswer.userAnswer : '')
      setSelectedAnswer(nextAnswer ? nextAnswer.isCorrect : null)
      setAnsweredQuestions(answeredQuestions + 1)
    } else {
      setAnsweredQuestions(answeredQuestions + 1)
      const finalScore = score + (selectedAnswer ? 1 : 0)
      
      // Save to localStorage
      const existingData = localStorage.getItem('quiz_namedlaw')
      const previousData = existingData ? JSON.parse(existingData) : { bestScore: 0, attempts: 0, attemptHistory: [] }
      
      const newAttempt = { score: finalScore, date: new Date().toISOString() }
      const attemptHistory = [...(previousData.attemptHistory || []), newAttempt]
      
      localStorage.setItem('quiz_namedlaw', JSON.stringify({
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
      setUserInput(prevAnswer ? prevAnswer.userAnswer : '')
      setSelectedAnswer(prevAnswer ? prevAnswer.isCorrect : null)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setUserInput('')
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnsweredQuestions(0)
    setUserAnswers([])
    setShowReview(false)
    setLoadedImages({})
    
    // Reshuffle questions
    const shuffled = [...uxData].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
  }

  const handleShowReview = () => {
    setShowReview(true)
  }

  const handleBackToResults = () => {
    setShowReview(false)
  }

  if (questions.length === 0) {
    return <div className="loading">Loading quiz...</div>
  }

  if (showResult) {
    const percentage = ((score / questions.length) * 100).toFixed(1)
    
    if (showReview) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <NavigationMenu />
          <div className="quiz-container">
            <div className="quiz-header">
              <h2>Answer Review - Name the UX Law</h2>
              <p className="question-counter">
                Review all {questions.length} questions and their correct answers
              </p>
            </div>

            <div className="review-list">
              {questions.map((question, qIndex) => {
                const userAnswer = userAnswers[qIndex]
                const isCorrect = userAnswer?.isCorrect || false

                return (
                  <div key={qIndex} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-question-header">
                      <span className="review-question-number">Question {qIndex + 1}</span>
                      <span className={`review-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    
                    <div className="name-law-review-image">
                      <img 
                        src={imageMap[question.image] || question.image} 
                        alt="UX Law diagram"
                        className="review-law-image"
                      />
                    </div>

                    <div className="review-answer-comparison">
                      <div className="answer-box">
                        <strong>Your Answer:</strong>
                        <p className={isCorrect ? 'correct-answer' : 'wrong-answer'}>
                          {userAnswer?.userAnswer || '(No answer)'}
                        </p>
                      </div>
                      {!isCorrect && (
                        <div className="answer-box">
                          <strong>Correct Answer:</strong>
                          <p className="correct-answer">{question.law}</p>
                        </div>
                      )}
                    </div>

                    <div className="review-explanation">
                      <strong>{question.law}</strong>
                      <p style={{ marginTop: '12px' }}><strong>Description:</strong><br />{question.description}</p>
                      <p style={{ marginTop: '12px' }}><strong>Principle:</strong><br />{question.principle}</p>
                      <p style={{ marginTop: '12px' }}><strong>In Practice:</strong><br />{question.practice}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="review-actions">
              <button onClick={handleBackToResults} className="next-button">
                ← Back to Results
              </button>
              <button onClick={handleRestart} className="restart-button">
                Try Again
              </button>
            </div>
          </div>
        </motion.div>
      )
    }
    
    return (
      <>
        <NavigationMenu />
        <div className="quiz-container">
          <div className="result-card">
            <h1>Quiz Complete! 🎉</h1>
            <div className="score-display">
              <div className="score-number">{score}</div>
              <div className="score-total">out of {questions.length}</div>
            </div>
            <div className="score-percentage">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <div className="button-group">
              <button onClick={handleShowReview} className="next-button" style={{ marginBottom: '10px' }}>
                📋 Review Answers
              </button>
              <button onClick={handleRestart} className="restart-button">
                Try Again
              </button>
              <a href="/" className="home-link">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationMenu />
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Name the UX Law</h2>
          <div className="progress-info">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Score: {score}/{answeredQuestions}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="question-card">
          <h3 className="question-text">What UX law does this diagram represent?</h3>

          <div className="name-law-image-container">
            {!loadedImages[currentQuestion.image] && <div className="image-skeleton"></div>}
            <img 
              src={imageMap[currentQuestion.image] || currentQuestion.image} 
              alt="UX Law diagram"
              className={`name-law-image ${loadedImages[currentQuestion.image] ? 'loaded' : 'loading'}`}
              onLoad={() => setLoadedImages(prev => ({ ...prev, [currentQuestion.image]: true }))}
              loading="eager"
            />
          </div>

          <div className="input-answer-section">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userInput.trim() !== '' && selectedAnswer === null) {
                  handleSubmit()
                } else if (e.key === 'Enter' && selectedAnswer !== null) {
                  handleNext()
                } else if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
                  handlePrevious()
                } else if (e.key === 'ArrowRight' && selectedAnswer !== null) {
                  handleNext()
                }
              }}
              placeholder="Type the name of the law..."
              className={`law-name-input ${selectedAnswer !== null ? (selectedAnswer ? 'correct-input' : 'wrong-input') : ''}`}
              disabled={selectedAnswer !== null}
            />
            {selectedAnswer === null && (
              <button 
                onClick={handleSubmit}
                className="submit-button"
                disabled={userInput.trim() === ''}
              >
                Submit
              </button>
            )}
          </div>

          {selectedAnswer !== null && (
            <div className="explanation-box">
              <div className="explanation-header">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Explanation</span>
              </div>
              <div className="correct-answer">
                {currentQuestion.law}
              </div>
              {!selectedAnswer && (
                <p className="your-answer-text">Your answer: <span className="wrong-text">{userInput}</span></p>
              )}
              <p className="explanation-text" style={{ marginTop: '12px' }}>
                <strong>Description:</strong><br />{currentQuestion.description}
              </p>
              <p className="explanation-text" style={{ marginTop: '12px' }}>
                <strong>Principle:</strong><br />{currentQuestion.principle}
              </p>
              <p className="explanation-text" style={{ marginTop: '12px' }}>
                <strong>In Practice:</strong><br />{currentQuestion.practice}
              </p>
            </div>
          )}

          {selectedAnswer === null && (
            <p className="keyboard-hint">💡 Press Enter to submit • Arrow keys to navigate</p>
          )}

          <div className="navigation-buttons">
            {currentQuestionIndex > 0 && (
              <button onClick={handlePrevious} className="previous-button">
                Previous
              </button>
            )}
            <button 
              onClick={handleNext} 
              className="next-button"
              disabled={selectedAnswer === null}
            >
              {selectedAnswer === null ? '🔒 Submit your answer first' : (currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NameTheLaw
