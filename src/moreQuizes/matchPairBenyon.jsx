import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import CelebrationBackground from '../components/CelebrationBackground'
import '../chapterList/chapter3.css'

const principlePairs = [
  { id: 1, description: "Users should be able to see clearly what the system is doing and what options are available.", principle: "Visibility" },
  { id: 2, description: "Similar elements should look similar and behave in predictable, uniform ways throughout an interface.", principle: "Consistency" },
  { id: 3, description: "Leverage users' existing knowledge from the real world and prior system experiences.", principle: "Familiarity" },
  { id: 4, description: "Users should always know where they are in the system and how to get where they want to go.", principle: "Navigation" },
  { id: 5, description: "The interface should clearly communicate how it can be used without requiring explanation.", principle: "Affordance" },
  { id: 6, description: "Users should feel they are in charge of the system, able to initiate actions and make decisions.", principle: "Control" },
  { id: 7, description: "The system must clearly communicate the results and consequences of user actions.", principle: "Feedback" },
  { id: 8, description: "Provide safe, easy ways to fix mistakes when they happen.", principle: "Recovery" },
  { id: 9, description: "Strategically limit user actions to prevent errors before they occur.", principle: "Constraints" },
  { id: 10, description: "Offer multiple ways to accomplish tasks, accommodating different user preferences and skill levels.", principle: "Flexibility" },
  { id: 11, description: "Design with aesthetic and minimalist principles that communicate professionalism and respect.", principle: "Style" },
  { id: 12, description: "Design systems that are polite, respectful, friendly, and supportive to users.", principle: "Conviviality" },
]

function MatchPairBenyon() {
  const [descriptions, setDescriptions] = useState([])
  const [principles, setPrinciples] = useState([])
  const [matches, setMatches] = useState({})
  const [selectedPrinciple, setSelectedPrinciple] = useState(null)
  const [correctMatches, setCorrectMatches] = useState(new Set())
  const [wrongMatches, setWrongMatches] = useState({})
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [swapColumns, setSwapColumns] = useState(false)
  const [flashEffect, setFlashEffect] = useState(null)

  useEffect(() => {
    // Shuffle both arrays
    const shuffledDescriptions = [...principlePairs].sort(() => Math.random() - 0.5)
    const shuffledPrinciples = [...principlePairs].sort(() => Math.random() - 0.5)
    
    setDescriptions(shuffledDescriptions)
    setPrinciples(shuffledPrinciples)
  }, [])

  const handlePrincipleClick = (principle) => {
    if (correctMatches.has(principle.id)) return
    
    if (selectedPrinciple?.id === principle.id) {
      setSelectedPrinciple(null)
      setFlashEffect(null)
      return
    }
    
    setFlashEffect('selected')
    setTimeout(() => setFlashEffect(null), 400)
    
    setSelectedPrinciple(principle)
  }

  const handleDescriptionClick = (desc) => {
    if (!selectedPrinciple) return
    if (correctMatches.has(desc.id)) return

    setAttempts(attempts + 1)

    if (selectedPrinciple.id === desc.id) {
      setFlashEffect('correct')
      setTimeout(() => setFlashEffect(null), 600)
      
      setMatches({ ...matches, [selectedPrinciple.id]: desc.id })
      setCorrectMatches(new Set([...correctMatches, selectedPrinciple.id]))
      setScore(score + 1)
      setSelectedPrinciple(null)
      
      const newWrongMatches = { ...wrongMatches }
      delete newWrongMatches[selectedPrinciple.id]
      setWrongMatches(newWrongMatches)

      if (correctMatches.size + 1 === principlePairs.length) {
        const finalAttempts = attempts + 1
        const finalMistakes = mistakes
        setTimeout(() => {
          const savedData = localStorage.getItem('quiz_matchpairbenyon')
          const currentScore = principlePairs.length
          const currentAccuracy = ((currentScore / finalAttempts) * 100).toFixed(1)
          
          if (savedData) {
            const data = JSON.parse(savedData)
            const attemptHistory = data.attemptHistory || []
            attemptHistory.push({
              score: currentScore,
              accuracy: parseFloat(currentAccuracy),
              mistakes: finalMistakes,
              date: new Date().toISOString()
            })
            
            const bestAccuracy = Math.max(...attemptHistory.map(a => a.accuracy))
            
            localStorage.setItem('quiz_matchpairbenyon', JSON.stringify({
              score: currentScore,
              bestScore: currentScore,
              accuracy: parseFloat(currentAccuracy),
              bestAccuracy: bestAccuracy,
              mistakes: finalMistakes,
              total: principlePairs.length,
              completed: true,
              attemptHistory: attemptHistory,
              lastAttempt: new Date().toISOString()
            }))
          } else {
            localStorage.setItem('quiz_matchpairbenyon', JSON.stringify({
              score: currentScore,
              bestScore: currentScore,
              accuracy: parseFloat(currentAccuracy),
              bestAccuracy: parseFloat(currentAccuracy),
              mistakes: finalMistakes,
              total: principlePairs.length,
              completed: true,
              attemptHistory: [{
                score: currentScore,
                accuracy: parseFloat(currentAccuracy),
                mistakes: finalMistakes,
                date: new Date().toISOString()
              }],
              lastAttempt: new Date().toISOString()
            }))
          }
          
          setShowResult(true)
        }, 500)
      }
    } else {
      setFlashEffect('wrong')
      setTimeout(() => setFlashEffect(null), 600)
      
      setMistakes(mistakes + 1)
      
      setWrongMatches({ ...wrongMatches, [selectedPrinciple.id]: desc.id })
      setTimeout(() => {
        const newWrongMatches = { ...wrongMatches }
        delete newWrongMatches[selectedPrinciple.id]
        setWrongMatches(newWrongMatches)
        setSelectedPrinciple(null)
      }, 1000)
    }
  }

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedPrinciple(null)
    }
  }

  const handleRestart = () => {
    const shuffledDescriptions = [...principlePairs].sort(() => Math.random() - 0.5)
    const shuffledPrinciples = [...principlePairs].sort(() => Math.random() - 0.5)
    
    setDescriptions(shuffledDescriptions)
    setPrinciples(shuffledPrinciples)
    setMatches({})
    setSelectedPrinciple(null)
    setCorrectMatches(new Set())
    setWrongMatches({})
    setScore(0)
    setShowResult(false)
    setAttempts(0)
    setMistakes(0)
  }

  if (showResult) {
    const accuracy = ((principlePairs.length / attempts) * 100).toFixed(1)
    
    return (
      <>
        <NavigationMenu />
        <CelebrationBackground score={score} total={principlePairs.length} />
        <div className="quiz-container">
          <div className="result-card">
            <h1>All Matched!</h1>
            <div className="score-display">
              <div className="score-number">{score}</div>
              <div className="score-total">out of {principlePairs.length}</div>
            </div>
            <div className="score-percentage">
              {Math.round((score / principlePairs.length) * 100)}%
            </div>
            <p style={{ color: '#888', fontSize: '1rem', marginTop: '1rem' }}>
              Accuracy: {accuracy}% • {attempts} attempts • {mistakes} mistake{mistakes !== 1 ? 's' : ''}
            </p>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationMenu />
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Benyon's 12 Principles - Match Pairs</h2>
          <div className="progress-info">
            <span>Matched: {correctMatches.size}/{principlePairs.length}</span>
            <span>Attempts: {attempts}</span>
          </div>
        </div>

        <div className="question-card" onClick={handleBackgroundClick}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <p style={{ 
              color: '#888',
              fontSize: '0.95rem',
              margin: 0
            }}>
              {swapColumns ? 'Click a description, then click its matching principle' : 'Click a principle, then click its matching description'}
            </p>
            <button
              onClick={() => setSwapColumns(!swapColumns)}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(100, 108, 255, 0.1)',
                border: '1px solid rgba(100, 108, 255, 0.3)',
                borderRadius: '8px',
                color: '#646cff',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(100, 108, 255, 0.2)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(100, 108, 255, 0.1)'
              }}
            >
              ⇄ Swap Columns
            </button>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ 
                color: '#646cff', 
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                {swapColumns ? 'Descriptions' : 'Principles'}
              </h3>
              {(swapColumns ? descriptions : principles).map((item) => {
                const isSelected = selectedPrinciple?.id === item.id
                const isCorrect = correctMatches.has(item.id)
                const isWrong = wrongMatches[item.id] !== undefined
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handlePrincipleClick(item)}
                    className={`option-button ${isWrong ? 'wrong' : ''}`}
                    disabled={isCorrect}
                    animate={{
                      boxShadow: isSelected && flashEffect === 'selected'
                        ? ['0 0 0 0px rgba(251, 191, 36, 0)', '0 0 0 3px rgba(251, 191, 36, 0.8)', '0 0 0 0px rgba(251, 191, 36, 0)']
                        : '0 0 0 0px rgba(0, 0, 0, 0)',
                      borderColor: isSelected ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)'
                    }}
                    transition={{
                      duration: 0.4,
                      ease: 'easeInOut'
                    }}
                    style={{
                      height: '100px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      fontWeight: swapColumns ? '400' : '500',
                      position: 'relative',
                      padding: '0.75rem',
                      opacity: isCorrect ? 0.3 : 1
                    }}
                  >
                    {swapColumns ? item.description : item.principle}
                  </motion.button>
                )
              })}
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ 
                color: '#646cff', 
                marginBottom: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                {swapColumns ? 'Principles' : 'Descriptions'}
              </h3>
              {(swapColumns ? principles : descriptions).map((item) => {
                const isMatched = correctMatches.has(item.id)
                const isWrongTarget = Object.values(wrongMatches).includes(item.id)
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleDescriptionClick(item)}
                    className={`option-button ${isWrongTarget ? 'wrong' : ''}`}
                    disabled={isMatched}
                    animate={{
                      boxShadow: flashEffect === 'correct' && Object.keys(matches).includes(String(item.id))
                        ? ['0 0 0 0px rgba(34, 197, 94, 0)', '0 0 0 3px rgba(34, 197, 94, 0.8)', '0 0 0 0px rgba(34, 197, 94, 0)']
                        : flashEffect === 'wrong' && isWrongTarget
                        ? ['0 0 0 0px rgba(239, 68, 68, 0)', '0 0 0 3px rgba(239, 68, 68, 0.8)', '0 0 0 0px rgba(239, 68, 68, 0)']
                        : '0 0 0 0px rgba(0, 0, 0, 0)'
                    }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeInOut'
                    }}
                    style={{
                      height: '100px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      fontWeight: swapColumns ? '500' : '400',
                      position: 'relative',
                      padding: '0.75rem',
                      opacity: isMatched ? 0.3 : 1
                    }}
                  >
                    {swapColumns ? item.principle : item.description}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MatchPairBenyon
