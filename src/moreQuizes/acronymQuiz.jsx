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
          transition={{ duration: 0.5 }}
        >
          <NavigationMenu />
          <div className="quiz-container">
            <div className="quiz-header">
              <h2>Answer Review - Acronym Quiz</h2>
              <div className="progress-info">
                <span>Score: {score}/{questionsData.length} ({percentage}%)</span>
              </div>
            </div>

            <div className="review-container">
              {questionsData.map((question, qIndex) => {
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
                      <strong>Explanation:</strong> {question.explanation}
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
                Review Answers
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
          <h2>Acronym Quiz</h2>
          <div className="progress-info">
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span>Question {currentQuestionIndex + 1} of {questionsData.length}</span>
              <div style={{ flex: 1 }}></div>
              {streak >= 2 && (
                <span className="streak-fire" style={{ marginRight: '1.5rem' }}>🔥 {streak}</span>
              )}
              <span>Score: {score}/{answeredQuestions}</span>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questionsData.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="question-card">
          <h3 className="question-text">{currentQuestion.question}</h3>
          
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
              <p className="explanation-text">{currentQuestion.explanation}</p>
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

export default AcronymQuiz
