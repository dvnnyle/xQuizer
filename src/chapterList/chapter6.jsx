import { useState } from 'react'
import NavigationMenu from '../pages/widget/navigationMenu'
import questionsData from '../../dataBank/chapter6.json'
import '../chapterList/chapter3.css'

function Chapter6() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])

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
  }

  if (showResult) {
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
    <>
      <NavigationMenu />
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Chapter 6: Designing for experience</h2>
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
            <div className="question-image">
              <img src={currentQuestion.imageUrl} alt="Question illustration" />
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
    </>
  )
}

export default Chapter6
