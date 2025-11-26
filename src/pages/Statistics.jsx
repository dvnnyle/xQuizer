import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from './widget/navigationMenu'
import Footer from './widget/footer'
import './Statistics.css'

function Statistics() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    completedQuestions: 0,
    correctAnswers: 0,
    averageScore: 0,
    chapterProgress: []
  })

  useEffect(() => {
    // Load statistics from localStorage
    const chapters = [
      { id: 'chapter2', name: 'Chapter 2', total: 31 },
      { id: 'chapter3', name: 'Chapter 3', total: 29 },
      { id: 'chapter5', name: 'Chapter 5', total: 30 },
      { id: 'chapter6', name: 'Chapter 6', total: 33 },
      { id: 'chapter7', name: 'Chapter 7', total: 30 },
      { id: 'chapter8', name: 'Chapter 8', total: 26 },
      { id: 'chapter10', name: 'Chapter 10', total: 30 },
      { id: 'chaptertest', name: 'Test Chapter', total: 5 },
      { id: 'randomizer', name: '🎲 Random Quiz', total: 30 },
      { id: 'fulllist', name: '🔥 All Questions', total: 178 },
      { id: 'uxquiz1', name: '🎯 UX Laws Quiz', total: 21 },
      { id: 'uxquiz2', name: '🎯 UX Laws Quiz 2', total: 21 }
    ]

    const chapterProgress = chapters.map(chapter => {
      const savedData = localStorage.getItem(`quiz_${chapter.id}`)
      if (savedData) {
        const data = JSON.parse(savedData)
        const attemptHistory = data.attemptHistory || [{ score: data.score, date: data.lastAttempt }]
        return {
          ...chapter,
          completed: data.completed || data.total,
          correct: data.score || 0,
          lastScore: data.score || 0,
          attempts: attemptHistory.length,
          bestScore: data.bestScore || data.score || 0,
          attemptHistory: attemptHistory
        }
      }
      return {
        ...chapter,
        completed: 0,
        correct: 0,
        lastScore: 0,
        attempts: 0,
        bestScore: 0,
        attemptHistory: []
      }
    })

    const totalQuestions = chapters.reduce((sum, ch) => sum + ch.total, 0)
    const completedQuestions = chapterProgress.reduce((sum, ch) => sum + ch.completed, 0)
    const correctAnswers = chapterProgress.reduce((sum, ch) => sum + ch.correct, 0)

    setStats({
      totalQuestions,
      completedQuestions,
      correctAnswers,
      chapterProgress
    })
  }, [])

  const overallPercentage = stats.totalQuestions > 0 
    ? ((stats.completedQuestions / stats.totalQuestions) * 100).toFixed(1)
    : 0

  const accuracyPercentage = stats.completedQuestions > 0
    ? ((stats.correctAnswers / stats.completedQuestions) * 100).toFixed(1)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationMenu />
      <div className="statistics-container">
        <div className="stats-header">
          <h1>📊 Your Statistics</h1>
          <p>Track your progress and performance across all chapters</p>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-value">{stats.completedQuestions}</div>
              <div className="stat-label">Questions Completed</div>
              <div className="stat-sublabel">out of {stats.totalQuestions}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.correctAnswers}</div>
              <div className="stat-label">Correct Answers</div>
              <div className="stat-sublabel">{accuracyPercentage}% accuracy</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{overallPercentage}%</div>
              <div className="stat-label">Overall Progress</div>
              <div className="stat-sublabel">Keep going!</div>
            </div>
          </div>
        </div>

        <div className="chapter-stats">
          <h2>Chapter Performance - Attempt History</h2>
          <div className="bar-graph-container">
            {stats.chapterProgress.map((chapter) => {
              return (
                <div key={chapter.id} className="bar-graph-item">
                  <div className="bar-graph-label">
                    <span className="chapter-name">{chapter.name}</span>
                    <span className="chapter-score">
                      {chapter.attempts > 0 ? `${chapter.attempts} attempt${chapter.attempts > 1 ? 's' : ''}` : 'Not started'}
                    </span>
                  </div>
                  
                  {chapter.attemptHistory.length > 0 ? (
                    <div className="attempts-graph">
                      {[...chapter.attemptHistory].reverse().map((attempt, reverseIndex) => {
                        const index = chapter.attemptHistory.length - 1 - reverseIndex
                        const percentage = (attempt.score / chapter.total) * 100
                        const isLatest = index === chapter.attemptHistory.length - 1
                        const isBest = attempt.score === chapter.bestScore
                        
                        return (
                          <div key={index} className="attempt-bar-wrapper">
                            <span className="attempt-percentage">{percentage.toFixed(0)}%</span>
                            <div className="attempt-bar-container">
                              <div 
                                className={`attempt-bar ${isLatest ? 'latest' : ''} ${isBest ? 'best' : ''}`}
                                style={{ height: `${percentage}%` }}
                              />
                            </div>
                            <div className="attempt-label">
                              <span className="attempt-number">#{index + 1}</span>
                              <span className="attempt-score">{attempt.score}/{chapter.total}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="no-attempts">
                      <p>No attempts yet. Start the quiz to see your progress!</p>
                    </div>
                  )}
                  
                  <div className="bar-graph-stats">
                    {chapter.attempts > 0 && (
                      <>
                        <span>Best Score: {chapter.bestScore}/{chapter.total} ({((chapter.bestScore / chapter.total) * 100).toFixed(0)}%)</span>
                        <span>Latest: {chapter.lastScore}/{chapter.total}</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="chapter-stats">
          <h2>Detailed Progress</h2>
          <div className="chapter-stats-list">
            {stats.chapterProgress.map((chapter) => (
              <div key={chapter.id} className="chapter-stat-card">
                <div className="chapter-stat-header">
                  <h3>{chapter.name}</h3>
                  <span className="chapter-stat-score">
                    {chapter.attempts > 0 
                      ? `${chapter.lastScore}/${chapter.total} (${((chapter.lastScore / chapter.total) * 100).toFixed(0)}%)`
                      : 'Not started'
                    }
                  </span>
                </div>
                <div className="chapter-progress-bar">
                  <div 
                    className="chapter-progress-fill"
                    style={{ width: `${(chapter.lastScore / chapter.total) * 100}%` }}
                  />
                </div>
                <div className="chapter-stat-info">
                  <span>Total: {chapter.total} questions</span>
                  {chapter.attempts > 0 && (
                    <span className="chapter-accuracy">
                      {chapter.attempts} attempt{chapter.attempts > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-actions">
          <a href="/" className="stats-button primary">
            Continue Learning
          </a>
          <button 
            className="stats-button secondary"
            onClick={() => {
              if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
                localStorage.removeItem('quiz_chapter2')
                localStorage.removeItem('quiz_chapter3')
                localStorage.removeItem('quiz_chapter5')
                localStorage.removeItem('quiz_chapter6')
                localStorage.removeItem('quiz_chapter7')
                localStorage.removeItem('quiz_chapter8')
                localStorage.removeItem('quiz_chapter10')
                localStorage.removeItem('quiz_chaptertest')
                localStorage.removeItem('quiz_randomizer')
                localStorage.removeItem('quiz_fulllist')
                localStorage.removeItem('quiz_uxquiz1')
                localStorage.removeItem('quiz_uxquiz2')
                window.location.reload()
              }
            }}
          >
            Reset Statistics
          </button>
        </div>
      </div>
      <Footer />
    </motion.div>
  )
}

export default Statistics
