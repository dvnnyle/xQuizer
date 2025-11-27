import { useState } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import questionsData from '../../dataBank/dataSub/quizinc2.json'
import '../chapterList/chapter3.css'

function QuizFindIncorrect2() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [streak, setStreak] = useState(0)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const currentQuestion = questionsData[currentQuestionIndex]

  const handleAnswerClick = (optionKey) => {
    if (hasSubmitted) return // Already submitted this question

    setSelectedAnswers(prev => {
      if (prev.includes(optionKey)) {
        return prev.filter(key => key !== optionKey)
      } else {
        return [...prev, optionKey]
      }
    })
  }

  const handleSubmit = () => {
    if (selectedAnswers.length === 0) return

    const correctAnswers = currentQuestion.incorrectAnswers.sort()
    const userSelectedSorted = [...selectedAnswers].sort()
    const isCorrect = JSON.stringify(correctAnswers) === JSON.stringify(userSelectedSorted)

    // Store the answer
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = { 
      selectedAnswers: [...selectedAnswers], 
      isCorrect 
    }
    setUserAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }

    setHasSubmitted(true)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      const nextAnswer = userAnswers[currentQuestionIndex + 1]
      setSelectedAnswers(nextAnswer ? nextAnswer.selectedAnswers : [])
      setHasSubmitted(!!nextAnswer)
      setAnsweredQuestions(answeredQuestions + 1)
    } else {
      setAnsweredQuestions(answeredQuestions + 1)
      const finalScore = score + (hasSubmitted ? 0 : 0)
      
      // Save to localStorage
      const existingData = localStorage.getItem('quiz_findincorrect2')
      const previousData = existingData ? JSON.parse(existingData) : { bestScore: 0, attempts: 0, attemptHistory: [] }
      
      const newAttempt = { score: finalScore, date: new Date().toISOString() }
      const attemptHistory = [...(previousData.attemptHistory || []), newAttempt]
      
      localStorage.setItem('quiz_findincorrect2', JSON.stringify({
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
      setSelectedAnswers(prevAnswer ? prevAnswer.selectedAnswers : [])
      setHasSubmitted(!!prevAnswer)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setShowResult(false)
    setShowReview(false)
    setScore(0)
    setAnsweredQuestions(0)
    setUserAnswers([])
    setStreak(0)
    setHasSubmitted(false)
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
              <h2>Answer Review - Find All Incorrect Statements</h2>
              <div className="progress-info">
                <span>Score: {score}/{questionsData.length} ({percentage}%)</span>
              </div>
            </div>

            <div className="review-container">
              {questionsData.map((question, qIndex) => {
                const userAnswer = userAnswers[qIndex]
                const isCorrect = userAnswer?.isCorrect
                const userSelectedAnswers = userAnswer?.selectedAnswers || []

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
                      {Object.entries(question.options).map(([key, text]) => {
                        const isCorrectOption = question.incorrectAnswers.includes(key)
                        const isUserSelection = userSelectedAnswers.includes(key)
                        
                        let optionClass = 'review-option'
                        if (isCorrectOption) optionClass += ' correct-option'
                        if (isUserSelection && !isCorrectOption) optionClass += ' wrong-option'
                        if (!isUserSelection && isCorrectOption) optionClass += ' missed-option'
                        
                        return (
                          <div key={key} className={optionClass}>
                            <span className="option-letter">{key.toUpperCase()}</span>
                            <span className="option-text">{text}</span>
                            {isUserSelection && (
                              <span className="selection-badge">You selected</span>
                            )}
                            {isCorrectOption && (
                              <span className="correct-badge-mini">Incorrect statement</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="review-explanation">
                      <div className="explanation-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <span>Explanation</span>
                      </div>
                      {Object.entries(question.explanation).map(([key, text]) => (
                        <p
                          key={key}
                          className="explanation-text"
                          dangerouslySetInnerHTML={{
                            __html: `<strong>Option ${key.toUpperCase()}:</strong> ${text}`
                          }}
                        />
                      ))}
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
          <h2>Find All Incorrect Statements</h2>
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
          <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '1rem' }}>
            Select all incorrect statements (multiple answers possible)
          </p>
          
          <div className="options-list">
            {Object.entries(currentQuestion.options).map(([key, text]) => {
              const isSelected = selectedAnswers.includes(key)
              const isCorrect = currentQuestion.incorrectAnswers.includes(key)
              const showCorrect = hasSubmitted && isCorrect
              const showWrong = hasSubmitted && isSelected && !isCorrect
              const showMissed = hasSubmitted && !isSelected && isCorrect

              return (
                <button
                  key={key}
                  onClick={() => handleAnswerClick(key)}
                  className={`option-button ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''} ${showMissed ? 'missed' : ''}`}
                  disabled={hasSubmitted}
                >
                  <span className="option-letter">{key.toUpperCase()}</span>
                  <span className="option-text">{text}</span>
                  {isSelected && !hasSubmitted && <span className="you-chose">Selected</span>}
                  {hasSubmitted && isSelected && <span className="you-chose">You selected</span>}
                </button>
              )
            })}
          </div>

          {hasSubmitted && (
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
                The incorrect statements are: {currentQuestion.incorrectAnswers.map(a => a.toUpperCase()).join(', ')}
              </div>
              {Object.entries(currentQuestion.explanation).map(([key, text]) => (
                <p
                  key={key}
                  className="explanation-text"
                  dangerouslySetInnerHTML={{
                    __html: `<strong>Option ${key.toUpperCase()}:</strong> ${text}`
                  }}
                  style={{ marginBottom: '0.5rem' }}
                />
              ))}
            </div>
          )}

          <div className="navigation-buttons">
            {currentQuestionIndex > 0 && (
              <button onClick={handlePrevious} className="previous-button">
                Previous
              </button>
            )}
            {!hasSubmitted ? (
              <button 
                onClick={handleSubmit} 
                className="next-button"
                disabled={selectedAnswers.length === 0}
              >
                {selectedAnswers.length === 0 ? '🔒 Select answer(s)' : 'Submit Answer'}
              </button>
            ) : (
              <button 
                onClick={handleNext} 
                className="next-button"
              >
                {currentQuestionIndex < questionsData.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default QuizFindIncorrect2
