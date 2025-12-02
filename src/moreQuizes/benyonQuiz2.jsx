import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import CelebrationBackground from '../components/CelebrationBackground'
import questionsData from '../../dataBank/dataSub/benyonQuiz2Data.json'
import '../chapterList/chapter3.css'

function BenyonQuiz2() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showReview, setShowReview] = useState(false)
  const [mergedData, setMergedData] = useState([])

  useEffect(() => {
    // Shuffle questions to prevent pattern recognition
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5)
    setMergedData(shuffled)
  }, [])

  const currentQuestion = mergedData[currentQuestionIndex] || questionsData[currentQuestionIndex]

  // Function to normalize string for comparison
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

  // Function to check if answer is correct (allows for typos)
  const isAnswerCorrect = (userAnswer, correctAnswer) => {
    const normalizedUser = normalizeString(userAnswer)
    const normalizedCorrect = normalizeString(correctAnswer)
    
    // Exact match
    if (normalizedUser === normalizedCorrect) {
      return true
    }
    
    // Extract the core name (remove parentheses content)
    const removeParentheses = (str) => {
      return str.replace(/\([^)]*\)/g, '').trim().toLowerCase().replace(/['\s-]/g, '')
    }
    
    const coreUser = removeParentheses(userAnswer)
    const coreCorrect = removeParentheses(correctAnswer)
    
    // Check if core names match
    if (coreUser === coreCorrect && coreUser.length >= 3) {
      return true
    }
    
    // Check if user's answer is contained in the correct answer or vice versa
    if (normalizedCorrect.includes(normalizedUser) || normalizedUser.includes(normalizedCorrect)) {
      const matchRatio = Math.min(normalizedUser.length, normalizedCorrect.length) / 
                        Math.max(normalizedUser.length, normalizedCorrect.length)
      if (matchRatio >= 0.5) {
        return true
      }
    }
    
    // Allow typos with Levenshtein distance
    if (normalizedUser.length >= 3 && normalizedCorrect.length >= 3) {
      const distance = levenshteinDistance(normalizedUser, normalizedCorrect)
      if (normalizedCorrect.length > 10 && distance <= 3) {
        return true
      }
      if (normalizedCorrect.length > 6 && distance <= 2) {
        return true
      }
      if (distance <= 1) {
        return true
      }
    }
    
    // Also check distance on core names
    if (coreUser.length >= 3 && coreCorrect.length >= 3) {
      const distance = levenshteinDistance(coreUser, coreCorrect)
      if (coreCorrect.length > 8 && distance <= 3) {
        return true
      }
      if (coreCorrect.length >= 4 && distance <= 2) {
        return true
      }
      if (distance <= 1) {
        return true
      }
    }
    
    return false
  }

  const handleSubmit = () => {
    if (isAnswered) return

    const isCorrect = isAnswerCorrect(userInput, currentQuestion.answer)

    // Store the answer
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = { 
      userAnswer: userInput, 
      correctAnswer: currentQuestion.answer,
      isCorrect 
    }
    setUserAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + 1)
    }
    
    setIsAnswered(true)

    // Refocus after submit to keep keyboard shortcuts active
    setTimeout(() => {
      const container = document.querySelector('[tabindex="-1"]')
      container?.focus()
    }, 10)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      const nextAnswer = userAnswers[currentQuestionIndex + 1]
      setUserInput(nextAnswer ? nextAnswer.userAnswer : '')
      setIsAnswered(!!nextAnswer)
      setAnsweredQuestions(answeredQuestions + 1)
      
      // Auto-focus input on next question
      setTimeout(() => {
        const input = document.querySelector('.answer-input')
        input?.focus()
      }, 50)
    } else {
      setAnsweredQuestions(answeredQuestions + 1)
      const finalScore = score + (isAnswered && userAnswers[currentQuestionIndex]?.isCorrect ? 1 : 0)
      
      // Save to localStorage
      const existingData = localStorage.getItem('quiz_benyonquiz2')
      const previousData = existingData ? JSON.parse(existingData) : { bestScore: 0, attempts: 0, attemptHistory: [] }
      
      const newAttempt = { score: finalScore, date: new Date().toISOString() }
      const attemptHistory = [...(previousData.attemptHistory || []), newAttempt]
      
      localStorage.setItem('quiz_benyonquiz2', JSON.stringify({
        score: finalScore,
        completed: questionsData.length,
        total: questionsData.length,
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
      setIsAnswered(!!prevAnswer)
      
      // Auto-focus input on previous question
      setTimeout(() => {
        const input = document.querySelector('.answer-input')
        input?.focus()
      }, 50)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setUserInput('')
    setIsAnswered(false)
    setShowResult(false)
    setShowReview(false)
    setScore(0)
    setAnsweredQuestions(0)
    setUserAnswers([])
    
    // Reshuffle questions
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5)
    setMergedData(shuffled)
  }

  const handleShowReview = () => {
    setShowReview(true)
  }

  const handleBackToResults = () => {
    setShowReview(false)
  }

  if (showResult) {
    const percentageNum = Math.round((score / questionsData.length) * 100)
    const percentage = percentageNum.toFixed(1)
    
    // Determine celebration level and message
    let title = 'Quiz Complete!'
    let message = ''
    
    if (percentageNum === 100) {
      title = 'Perfect Score!'
      message = 'Absolutely outstanding! You know Benyon\'s principles perfectly! 🌟'
    } else if (percentageNum >= 90) {
      title = 'Excellent Work!'
      message = 'Amazing job! You really know your principles! 💪'
    } else if (percentageNum >= 75) {
      title = 'Great Job!'
      message = 'Well done! You have a solid understanding of Benyon\'s principles!'
    } else if (percentageNum >= 60) {
      title = 'Good Effort!'
      message = 'Not bad! Keep practicing and you\'ll master these!'
    } else {
      title = 'Keep Learning!'
      message = 'Every expert was once a beginner. Review and try again!'
    }
    
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
              <h2>Answer Review - Name the Principle</h2>
              <div className="progress-info">
                <span>Score: {score}/{questionsData.length} ({percentage}%)</span>
              </div>
            </div>

            <div className="review-container">
              {mergedData.map((question, qIndex) => {
                const userAnswer = userAnswers[qIndex]
                const isCorrect = userAnswer?.isCorrect

                return (
                  <div key={question.id} className="review-question-card">
                    <div className="review-header">
                      <span className="question-number">Question {qIndex + 1}</span>
                      <span className={`result-badge ${isCorrect ? 'correct-badge' : 'wrong-badge'}`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    </div>
                    
                    <h3 className="question-text">{question.question}</h3>
                    
                    <div className="review-answer-section">
                      <div className={`user-answer ${isCorrect ? 'correct' : 'wrong'}`}>
                        <strong>Your answer:</strong> {userAnswer?.userAnswer || '(No answer)'}
                      </div>
                      {!isCorrect && (
                        <div className="correct-answer-display">
                          <strong>Correct answer:</strong> {question.answer}
                        </div>
                      )}
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
            <h1>{title}</h1>
            {message && (
              <p style={{ 
                fontSize: '1.1rem', 
                color: 'rgba(255, 255, 255, 0.8)', 
                marginTop: '1rem',
                marginBottom: '2rem',
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.6'
              }}>
                {message}
              </p>
            )}
            <div className="score-display">
              <div className="score-number">{score}</div>
              <div className="score-total">out of {questionsData.length}</div>
            </div>
            <div className="score-percentage">
              {percentageNum}%
            </div>
            <div className="button-group">
              <button onClick={handleShowReview} className="next-button" style={{ marginBottom: '10px' }}>
                📋 Review Answers
              </button>
              <button onClick={handleRestart} className="restart-button">
                {percentageNum >= 90 ? 'Challenge Yourself Again' : 'Try Again'}
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
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
          e.preventDefault()
          handlePrevious()
        } else if ((e.key === 'ArrowRight' || e.key === 'Enter') && isAnswered) {
          e.preventDefault()
          handleNext()
        } else if (e.key === 'ArrowDown' && !isAnswered && userInput.trim() === '') {
          e.preventDefault()
          // Skip: mark as wrong and show explanation
          const newAnswers = [...userAnswers]
          newAnswers[currentQuestionIndex] = { 
            userAnswer: '', 
            correctAnswer: currentQuestion.answer,
            isCorrect: false 
          }
          setUserAnswers(newAnswers)
          setIsAnswered(true)
        } else if (e.key === 'Enter' && !isAnswered && document.activeElement?.className !== 'answer-input') {
          e.preventDefault()
          // Focus input field when pressing Enter
          const input = document.querySelector('.answer-input')
          input?.focus()
        }
      }}
      tabIndex={-1}
      style={{ outline: 'none' }}
    >
      <NavigationMenu />
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Name the Principle - Benyon's 12</h2>
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
          
          <div className="type-in-section">
            <label htmlFor="answer-input" className="input-label">
              Type the principle name:
            </label>
            <input
              id="answer-input"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (!isAnswered && userInput.trim() !== '') {
                    handleSubmit()
                  } else if (isAnswered) {
                    handleNext()
                  }
                }
              }}
              disabled={isAnswered}
              placeholder="Enter your answer..."
              className={`answer-input ${isAnswered ? (userAnswers[currentQuestionIndex]?.isCorrect ? 'correct-input' : 'wrong-input') : ''}`}
              autoFocus
            />
            <button 
              onClick={() => {
                if (userInput.trim() === '' && !isAnswered) {
                  // Skip: mark as wrong and show explanation
                  const newAnswers = [...userAnswers]
                  newAnswers[currentQuestionIndex] = { 
                    userAnswer: '', 
                    correctAnswer: currentQuestion.answer,
                    isCorrect: false 
                  }
                  setUserAnswers(newAnswers)
                  setIsAnswered(true)
                }
              }}
              className="submit-button skip-button"
              disabled={userInput.trim() !== '' || isAnswered}
            >
              Skip
            </button>
          </div>

          {isAnswered && (
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
                {currentQuestion.answer}
              </div>
              {!userAnswers[currentQuestionIndex]?.isCorrect && (
                <p className="your-answer-text">Your answer: <span className="wrong-text">{userInput || '(skipped)'}</span></p>
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

          <div className="navigation-buttons">
            {currentQuestionIndex > 0 && (
              <button onClick={handlePrevious} className="previous-button">
                Previous
              </button>
            )}
            <button 
              onClick={!isAnswered ? handleSubmit : handleNext}
              className="next-button"
              disabled={!isAnswered && userInput.trim() === ''}
            >
              {!isAnswered ? 'Submit Answer' : (currentQuestionIndex < questionsData.length - 1 ? 'Next Question' : 'See Results')}
            </button>
          </div>

          {!isAnswered && (
            <p className="keyboard-hint">💡 Press Enter to submit • Arrow keys to navigate • Arrow Down to skip</p>
          )}
          {isAnswered && (
            <p className="keyboard-hint">💡 Press Enter or Arrow Right for next question</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default BenyonQuiz2
