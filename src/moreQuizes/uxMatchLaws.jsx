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
        principle: law.principle,
        practice: law.practice,
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
        principle: law.principle,
        practice: law.practice,
        correctImage: law.image,
        options: allImages,
        answerIndex: correctIndex
      }
    })

    setQuestions(generatedQuestions)
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
              <h2>Answer Review - UX Laws Image Match</h2>
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
                    <h3>{question.question}</h3>
                    
                    <div className="review-images-container">
                      <div className="review-image-item">
                        <p className="review-label">Your Answer:</p>
                        <img 
                          src={imageMap[question.options[userAnswer?.selectedIndex]] || question.options[userAnswer?.selectedIndex]} 
                          alt="Your answer"
                          className="review-law-image"
                        />
                      </div>
                      {!isCorrect && (
                        <div className="review-image-item">
                          <p className="review-label">Correct Answer:</p>
                          <img 
                            src={imageMap[question.correctImage] || question.correctImage} 
                            alt="Correct answer"
                            className="review-law-image"
                          />
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
          <h2>UX Laws - Image Matching</h2>
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
          <h3 className="question-text">{currentQuestion.question}</h3>

          <div className="image-options-grid">
            {currentQuestion.options.map((imagePath, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === currentQuestion.answerIndex
              const showCorrect = selectedAnswer !== null && isCorrect
              const showWrong = selectedAnswer !== null && isSelected && !isCorrect

              return (
                <div
                  key={index}
                  className={`image-option ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''}`}
                  onClick={() => handleAnswerClick(index)}
                >
                  <img 
                    src={imageMap[imagePath] || imagePath} 
                    alt={`Option ${index + 1}`}
                    className="law-image"
                  />
                  {showCorrect && <span className="check-icon">✓</span>}
                  {showWrong && <span className="x-icon">✗</span>}
                </div>
              )
            })}
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
              {selectedAnswer === null ? '🔒 Select an answer' : (currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default UxMatchLaws
