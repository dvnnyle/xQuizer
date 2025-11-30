import { useState } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import CelebrationBackground from '../components/CelebrationBackground'
import questionsData from '../../dataBank/raw/acronym_test_full.json'
import '../chapterList/chapter3.css'

function AcronymQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [streak, setStreak] = useState(0)

  const currentQuestion = questionsData[currentQuestionIndex]

  const handleAnswerClick = (index) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(index)
    const isCorrect = index === currentQuestion.answerIndex

    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = { selectedIndex: index, isCorrect }
    setUserAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
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
      
      const existingData = localStorage.getItem('quiz_acronym')
      const previousData = existingData ? JSON.parse(existingData) : { bestScore: 0, attempts: 0, attemptHistory: [] }
      
      const newAttempt = { score: score, date: new Date().toISOString() }
      const attemptHistory = [...(previousData.attemptHistory || []), newAttempt]
      
      localStorage.setItem('quiz_acronym', JSON.stringify({
        score: score,
        completed: questionsData.length,
        total: questionsData.length,
        bestScore: Math.max(score, previousData.bestScore || 0),
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
          className="quiz-container"
        >
          <NavigationMenu />
          <div className="result-screen">
            <h2>📝 Review Your Answers</h2>
            <div className="review-summary">
              <p>Score: {score}/{questionsData.length} ({percentage}%)</p>
            </div>
            <div className="review-list">
              {questionsData.map((question, index) => {
                const userAnswer = userAnswers[index]
                const isCorrect = userAnswer?.isCorrect
                return (
                  <div key={question.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <h3>Question {index + 1}</h3>
                    <p className="review-question">{question.question}</p>
                    <div className="review-answers">
                      <p className="your-answer">
                        Your answer: <span className={isCorrect ? 'correct-text' : 'incorrect-text'}>
                          {question.options[userAnswer?.selectedIndex]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="correct-answer">
                          Correct answer: <span className="correct-text">{question.answer}</span>
                        </p>
                      )}
                    </div>
                    <p className="explanation">{question.explanation}</p>
                  </div>
                )
              })}
            </div>
            <button onClick={handleBackToResults} className="back-button">
              Back to Results
            </button>
          </div>
        </motion.div>
      )
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="quiz-container"
      >
        <NavigationMenu />
        <CelebrationBackground />
        <div className="result-screen">
          <h2>🎉 Quiz Complete!</h2>
          <div className="score-display">
            <div className="score-circle">
              <span className="score-number">{score}</span>
              <span className="score-total">/ {questionsData.length}</span>
            </div>
            <p className="percentage">{percentage}%</p>
          </div>
          <div className="result-message">
            {percentage >= 90 ? (
              <p>🌟 Outstanding! You're an acronym master!</p>
            ) : percentage >= 70 ? (
              <p>👏 Great job! You know your acronyms!</p>
            ) : percentage >= 50 ? (
              <p>👍 Good effort! Keep practicing!</p>
            ) : (
              <p>📚 Review the acronyms and try again!</p>
            )}
          </div>
          <div className="result-actions">
            <button onClick={handleRestart} className="restart-button">
              Try Again
            </button>
            <button onClick={handleShowReview} className="review-button">
              Review Answers
            </button>
            <a href="/" className="home-button">
              Back to Home
            </a>
          </div>
        </div>
      </motion.div>
    )
  }

  const isAnswered = selectedAnswer !== null
  const isCorrect = isAnswered && selectedAnswer === currentQuestion.answerIndex

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="quiz-container"
    >
      <NavigationMenu />
      <div className="quiz-content">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / questionsData.length) * 100}%` }}
          />
        </div>
        
        <div className="question-header">
          <span className="question-number">
            Question {currentQuestionIndex + 1} of {questionsData.length}
          </span>
          {streak > 2 && (
            <span className="streak-badge">🔥 {streak} streak!</span>
          )}
        </div>

        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                className={`option-button ${
                  selectedAnswer === index
                    ? index === currentQuestion.answerIndex
                      ? 'correct'
                      : 'incorrect'
                    : selectedAnswer !== null && index === currentQuestion.answerIndex
                    ? 'correct'
                    : ''
                }`}
                onClick={() => handleAnswerClick(index)}
                disabled={selectedAnswer !== null}
                whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {selectedAnswer !== null && index === currentQuestion.answerIndex && (
                  <span className="checkmark">✓</span>
                )}
                {selectedAnswer === index && index !== currentQuestion.answerIndex && (
                  <span className="crossmark">✗</span>
                )}
              </motion.button>
            ))}
          </div>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="explanation-box"
            >
              <h3>{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</h3>
              <p>{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </div>

        <div className="navigation-buttons">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="nav-button prev-button"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="nav-button next-button"
          >
            {currentQuestionIndex === questionsData.length - 1 ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default AcronymQuiz
