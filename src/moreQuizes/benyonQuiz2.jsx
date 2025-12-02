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

  const normalizeAnswer = (text) => {
    return text.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ')
  }

  const handleSubmit = () => {
    if (isAnswered) return

    const normalizedInput = normalizeAnswer(userInput)
    const normalizedCorrect = normalizeAnswer(currentQuestion.answer)
    
    // Also check against alternative answers (without parentheses content)
    const alternativeAnswer = currentQuestion.answer.includes('(') 
      ? normalizeAnswer(currentQuestion.answer.split('(')[0])
      : null

    const isCorrect = normalizedInput === normalizedCorrect || 
                     (alternativeAnswer && normalizedInput === alternativeAnswer)

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
  }

  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      const nextAnswer = userAnswers[currentQuestionIndex + 1]
      setUserInput(nextAnswer ? nextAnswer.userAnswer : '')
      setIsAnswered(!!nextAnswer)
      setAnsweredQuestions(answeredQuestions + 1)
    } else {
      setAnsweredQuestions(answeredQuestions + 1)
      
      // Save to localStorage
      const existingData = localStorage.getItem('quiz_benyonquiz2')
      const previousData = existingData ? JSON.parse(existingData) : { bestScore: 0, attempts: 0, attemptHistory: [] }
      
      const newAttempt = { score: score, date: new Date().toISOString() }
      const attemptHistory = [...(previousData.attemptHistory || []), newAttempt]
      
      localStorage.setItem('quiz_benyonquiz2', JSON.stringify({
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
      setUserInput(prevAnswer ? prevAnswer.userAnswer : '')
      setIsAnswered(!!prevAnswer)
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
              onKeyPress={(e) => {
                if (e.key === 'Enter' && userInput.trim() && !isAnswered) {
                  handleSubmit()
                }
              }}
              disabled={isAnswered}
              placeholder="Enter your answer..."
              className={`answer-input ${isAnswered ? (userAnswers[currentQuestionIndex]?.isCorrect ? 'correct-input' : 'wrong-input') : ''}`}
              autoFocus
            />
            {!isAnswered && (
              <button 
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="submit-button"
              >
                Submit Answer
              </button>
            )}
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
              disabled={!isAnswered}
            >
              {!isAnswered ? '🔒 Submit your answer first' : (currentQuestionIndex < questionsData.length - 1 ? 'Next Question' : 'See Results')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BenyonQuiz2
