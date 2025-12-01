import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import CelebrationBackground from '../components/CelebrationBackground'
import questionsData from '../../dataBank/dataSub/uxDataQBank.json'
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
import serialpostionEffect from '../assets/uxImg/serialpostionEffect.png'
import teslerLaw from '../assets/uxImg/teslerLaw.png'
import vonRestorffEffect from '../assets/uxImg/vonRestorffEffect.png'
import ZeigarnikEffect from '../assets/uxImg/ZeigarnikEffect.png'

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
  '/src/assets/uxImg/serialpostionEffect.png': serialpostionEffect,
  '/src/assets/uxImg/teslerLaw.png': teslerLaw,
  '/src/assets/uxImg/vonRestorffEffect.png': vonRestorffEffect,
  '/src/assets/uxImg/ZeigarnikEffect.png': ZeigarnikEffect
}

function UxQuiz1() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [mergedData, setMergedData] = useState([])
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    // Merge questionsData with uxData to get description, principle, and practice
    const merged = questionsData.map((question, index) => {
      const uxLaw = uxData[index] // Match by index since they're in same order
      return {
        ...question,
        description: uxLaw?.description,
        principle: uxLaw?.principle,
        practice: uxLaw?.practice
      }
    })
    setMergedData(merged)
  }, [])

  useEffect(() => {
    // Reset image loaded state when question changes
    setImageLoaded(false)
  }, [currentQuestionIndex])

  const currentQuestion = mergedData[currentQuestionIndex] || questionsData[currentQuestionIndex]

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
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      const nextAnswer = userAnswers[currentQuestionIndex + 1]
      setSelectedAnswer(nextAnswer ? nextAnswer.selectedIndex : null)
      setAnsweredQuestions(answeredQuestions + 1)
    } else {
      setAnsweredQuestions(answeredQuestions + 1)
      const finalScore = score + (currentQuestion.answerIndex === selectedAnswer ? 1 : 0)
      
      // Save to localStorage
      const existingData = localStorage.getItem('quiz_uxquiz1')
      const previousData = existingData ? JSON.parse(existingData) : { bestScore: 0, attempts: 0, attemptHistory: [] }
      
      const newAttempt = { score: finalScore, date: new Date().toISOString() }
      const attemptHistory = [...(previousData.attemptHistory || []), newAttempt]
      
      localStorage.setItem('quiz_uxquiz1', JSON.stringify({
        score: finalScore,
        completed: questionsData.length,
        total: questionsData.length,
        bestScore: Math.max(finalScore, previousData.bestScore || 0),
        attempts: attemptHistory.length,
        lastAttempt: new Date().toISOString(),
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
    setShowReview(false)
    setScore(0)
    setAnsweredQuestions(0)
    setUserAnswers([])
  }

  const handleShowReview = () => {
    setShowReview(true)
  }

  const handleBackToResults = () => {
    setShowReview(false)
  }

  if (showResult) {
    const percentage = ((score / questionsData.length) * 100).toFixed(1)
    
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
              <h2>Answer Review - UX Laws Quiz</h2>
              <div className="progress-info">
                <span>Score: {score}/{questionsData.length} ({percentage}%)</span>
              </div>
            </div>

            <div className="review-container">
              {mergedData.map((question, qIndex) => {
                const userAnswer = userAnswers[qIndex]
                const isCorrect = userAnswer?.isCorrect
                const userSelectedIndex = userAnswer?.selectedIndex

                return (
                  <div key={question.id} className="review-question-card">
                    <div className="review-header">
                      <span className="question-number">Question {qIndex + 1}</span>
                      <span className={`result-badge ${isCorrect ? 'correct-badge' : 'wrong-badge'}`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    
                    <h3 className="question-text">{question.question}</h3>
                    
                    <div className="review-options">
                      {question.options.map((option, optIndex) => {
                        const isCorrectOption = optIndex === question.answerIndex
                        const isUserSelection = optIndex === userSelectedIndex
                        
                        let optionClass = 'review-option'
                        if (isCorrectOption) optionClass += ' correct-option'
                        if (isUserSelection && !isCorrect) optionClass += ' wrong-option'
                        
                        return (
                          <div key={optIndex} className={optionClass}>
                            <span className="option-letter">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span className="option-text">{option}</span>
                            {isUserSelection && (
                              <span className="selection-badge">Your answer</span>
                            )}
                            {isCorrectOption && (
                              <span className="correct-badge-mini">Correct</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="review-explanation">
                      <strong>Explanation:</strong>
                      <p className="explanation-text" style={{ marginTop: '12px' }}>
                        <strong>Description:</strong><br />{question.description}
                      </p>
                      <p className="explanation-text" style={{ marginTop: '12px' }}>
                        <strong>Principle:</strong><br />{question.principle}
                      </p>
                      <p className="explanation-text" style={{ marginTop: '12px' }}>
                        <strong>In Practice:</strong><br />{question.practice}
                      </p>
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
        <CelebrationBackground score={score} total={questionsData.length} />
        <div className="quiz-container">
          <div className="result-card">
            <h1>Quiz Complete!</h1>
            <div className="score-display">
              <div className="score-number">{score}</div>
              <div className="score-total">out of {questionsData.length}</div>
            </div>
            <div className="score-percentage">
              {Math.round((score / questionsData.length) * 100)}%
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
          <h2>UX Laws Quiz</h2>
          <div className="progress-info">
            <span>Question {currentQuestionIndex + 1} of {questionsData.length}</span>
            <span>Score: {score}/{answeredQuestions}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questionsData.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="question-card">
          <div className="section-badge">Section {currentQuestion.section}</div>
          <h3 className="question-text">{currentQuestion.question}</h3>
          
          {currentQuestion.imageUrl && (
            <div className="question-image" style={{ position: 'relative', width: '100%' }}>
              {!imageLoaded && (
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '12px',
                  zIndex: 1
                }}></div>
              )}
              <img 
                src={imageMap[currentQuestion.imageUrl] || currentQuestion.imageUrl} 
                alt="Question illustration"
                onLoad={() => setImageLoaded(true)}
                style={{ 
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.2s ease-in-out',
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  position: 'relative',
                  zIndex: 2
                }}
              />
            </div>
          )}
          
          <div className="options-list">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.answerIndex
              const showCorrect = selectedAnswer !== null && isCorrect
              const showWrong = selectedAnswer !== null && isSelected && !isCorrect

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={`option-button ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''}`}
                  disabled={selectedAnswer !== null}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                  {isSelected && <span className="you-chose">You chose</span>}
                </button>
              )
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="explanation-box">
              <div className="explanation-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Explanation</span>
              </div>
              <div className="correct-answer">
                The correct answer is: {currentQuestion.answer}
              </div>
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
              {selectedAnswer === null ? '🔒 Select an answer' : (currentQuestionIndex < questionsData.length - 1 ? 'Next Question' : 'See Results')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default UxQuiz1
