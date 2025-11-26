import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import './chapter3.css'

// Import all chapter data
import chapter2Data from '../../dataBank/chapter2.json'
import chapter3Data from '../../dataBank/chapter3.json'
import chapter5Data from '../../dataBank/chapter5.json'
import chapter6Data from '../../dataBank/chapter6.json'
import chapter8Data from '../../dataBank/chapter8.json'
import chapter10Data from '../../dataBank/chapter10.json'

// Generate random questions once
const generateRandomQuestions = () => {
  const allQuestions = [
    ...chapter2Data,
    ...chapter3Data,
    ...chapter5Data,
    ...chapter6Data,
    ...chapter8Data,
    ...chapter10Data
  ]
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 30)
}

function RandomizerQuiz() {
  const [questionsData] = useState(generateRandomQuestions())
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showReview, setShowReview] = useState(false)

  const currentQuestion = questionsData[currentQuestionIndex]

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
      const existingData = localStorage.getItem('quiz_randomizer')
      const previousData = existingData ? JSON.parse(existingData) : { bestScore: 0, attempts: 0, attemptHistory: [] }
      
      const newAttempt = { score: finalScore, date: new Date().toISOString() }
      const attemptHistory = [...(previousData.attemptHistory || []), newAttempt]
      
      localStorage.setItem('quiz_randomizer', JSON.stringify({
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
    window.location.reload() // Reload to get new random questions
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
              <h2>Answer Review - 🎲 Random Quiz</h2>
              <div className="progress-info">
                <span>Score: {score}/{questionsData.length} ({percentage}%)</span>
              </div>
            </div>

            <div className="review-list">
              {questionsData.map((question, index) => {
                const userAnswerData = userAnswers[index]
                if (!userAnswerData) return null

                const isCorrect = userAnswerData.isCorrect

                return (
                  <div key={index} className="review-item">
                    <div className="review-question-header">
                      <span className="review-question-number">Q{index + 1}</span>
                      <span className={`review-status ${isCorrect ? 'correct' : 'wrong'}`}>
                        {isCorrect ? '✓ Correct' : '✗ Wrong'}
                      </span>
                    </div>

                    <h3 className="review-question">{question.question}</h3>

                    <div className="review-options">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswerData.selectedIndex === optionIndex
                        const isCorrectAnswer = question.answerIndex === optionIndex

                        let optionClass = 'review-option'
                        if (isCorrectAnswer) optionClass += ' correct'
                        if (isUserAnswer && !isCorrect) optionClass += ' wrong'

                        return (
                          <div key={optionIndex} className={optionClass}>
                            <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                            <span>{option}</span>
                            {isUserAnswer && <span className="badge">Your answer</span>}
                            {isCorrectAnswer && <span className="badge">Correct</span>}
                          </div>
                        )
                      })}
                    </div>

                    {question.explanation && (
                      <div className="review-explanation">
                        <strong>Explanation:</strong>
                        <div dangerouslySetInnerHTML={{ 
                          __html: question.explanation.replace(/'([^']+)'/g, "<span class='highlight'>$1</span>") 
                        }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="review-actions">
              <button onClick={handleBackToResults} className="next-button">
                ← Back to Results
              </button>
              <button onClick={handleRestart} className="restart-button">
                Try New Random Quiz
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
                Try New Random Quiz
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
          <h2>🎲 Random UX Quiz - 30 Questions (Chapters 2, 3, 5, 6, 8, 10)</h2>
          <div className="progress-info">
            <span>Question {currentQuestionIndex + 1} of {questionsData.length}</span>
            <span>Score: {score}/{answeredQuestions}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questionsData.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="question-card">
          <div className="section-badge">Random Mix</div>
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
              {currentQuestion.shortExplanation && (
                <p 
                  className="short-explanation"
                  dangerouslySetInnerHTML={{ 
                    __html: currentQuestion.shortExplanation.replace(
                      /'([^']+)'/g, 
                      "<span class='highlight'>$1</span>"
                    )
                  }}
                />
              )}
              <p 
                className="explanation-text"
                dangerouslySetInnerHTML={{ 
                  __html: currentQuestion.explanation.replace(
                    /'([^']+)'/g, 
                    "<span class='highlight'>$1</span>"
                  )
                }}
              />
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

export default RandomizerQuiz
