import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import CelebrationBackground from '../components/CelebrationBackground'
import '../chapterList/chapter3.css'

const lawPairs = [
  { id: 1, description: "Users perceive aesthetically pleasing design as easier to use.", law: "Aesthetic-Usability Effect" },
  { id: 2, description: "Productivity increases when a system responds in less than 400ms.", law: "Doherty Threshold" },
  { id: 3, description: "The time to reach a target depends on its size and distance.", law: "Fitts's Law" },
  { id: 4, description: "Decision time increases with the number of choices.", law: "Hick's Law" },
  { id: 5, description: "Users prefer your product to work like other familiar products.", law: "Jakob's Law" },
  { id: 6, description: "Elements sharing a boundary are perceived as grouped.", law: "Law of Common Region" },
  { id: 7, description: "People perceive complex forms in the simplest way possible.", law: "Law of Prägnanz" },
  { id: 8, description: "Elements close together are seen as related.", law: "Law of Proximity" },
  { id: 9, description: "Similar items appear related.", law: "Law of Similarity" },
  { id: 10, description: "Connected items are seen as more related than unconnected items.", law: "Law of Uniform Connectedness" },
  { id: 11, description: "People can store about 7±2 items in short-term memory.", law: "Miller's Law" },
  { id: 12, description: "The simplest solution is usually the best.", law: "Occam's Razor" },
  { id: 13, description: "80% of the effects come from 20% of the causes.", law: "Pareto Principle" },
  { id: 14, description: "Work expands to fill the time available.", law: "Parkinson's Law" },
  { id: 15, description: "People judge an experience by its peak and end moments.", law: "Peak-End Rule" },
  { id: 16, description: "Be liberal in what you accept, and conservative in what you send.", law: "Postel's Law" },
  { id: 17, description: "People remember the first and last items best.", law: "Serial Position Effect" },
  { id: 18, description: "Every system has irreducible complexity—manage it wisely.", law: "Tesler's Law" },
  { id: 19, description: "Distinct items are more memorable.", law: "Von Restorff Effect" },
  { id: 20, description: "People remember incomplete tasks better than completed ones.", law: "Zeigarnik Effect" },
  { id: 21, description: "Breaking content into small units improves understanding.", law: "Chunking" },
]

function DragDropLaws() {
  const [descriptions, setDescriptions] = useState([])
  const [laws, setLaws] = useState([])
  const [matches, setMatches] = useState({})
  const [selectedDescription, setSelectedDescription] = useState(null)
  const [correctMatches, setCorrectMatches] = useState(new Set())
  const [wrongMatches, setWrongMatches] = useState({})
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [swapColumns, setSwapColumns] = useState(false)
  const [flashEffect, setFlashEffect] = useState(null) // 'correct' or 'wrong'

  useEffect(() => {
    // Shuffle both arrays
    const shuffledDescriptions = [...lawPairs].sort(() => Math.random() - 0.5)
    const shuffledLaws = [...lawPairs].sort(() => Math.random() - 0.5)
    
    setDescriptions(shuffledDescriptions)
    setLaws(shuffledLaws)
  }, [])

  const handleLawClick = (law) => {
    if (correctMatches.has(law.id)) return
    
    // If clicking the same law, deselect it
    if (selectedDescription?.id === law.id) {
      setSelectedDescription(null)
      setFlashEffect(null)
      return
    }
    
    // Show yellow flash when selecting
    setFlashEffect('selected')
    setTimeout(() => setFlashEffect(null), 400)
    
    setSelectedDescription(law)
  }

  const handleDescriptionClick = (desc) => {
    if (!selectedDescription) return
    if (correctMatches.has(desc.id)) return

    setAttempts(attempts + 1)

    // Check if it's a correct match
    if (selectedDescription.id === desc.id) {
      // Show correct flash effect
      setFlashEffect('correct')
      setTimeout(() => setFlashEffect(null), 600)
      
      setMatches({ ...matches, [selectedDescription.id]: desc.id })
      setCorrectMatches(new Set([...correctMatches, selectedDescription.id]))
      setScore(score + 1)
      setSelectedDescription(null)
      
      // Remove wrong match if exists
      const newWrongMatches = { ...wrongMatches }
      delete newWrongMatches[selectedDescription.id]
      setWrongMatches(newWrongMatches)

      // Check if all matched
      if (correctMatches.size + 1 === lawPairs.length) {
        setTimeout(() => setShowResult(true), 500)
      }
    } else {
      // Show wrong flash effect
      setFlashEffect('wrong')
      setTimeout(() => setFlashEffect(null), 600)
      
      // Wrong match - show feedback
      setWrongMatches({ ...wrongMatches, [selectedDescription.id]: desc.id })
      setTimeout(() => {
        const newWrongMatches = { ...wrongMatches }
        delete newWrongMatches[selectedDescription.id]
        setWrongMatches(newWrongMatches)
        setSelectedDescription(null)
      }, 1000)
    }
  }

  const handleBackgroundClick = (e) => {
    // Only deselect if clicking the background, not the buttons
    if (e.target === e.currentTarget) {
      setSelectedDescription(null)
    }
  }

  const handleRestart = () => {
    const shuffledDescriptions = [...lawPairs].sort(() => Math.random() - 0.5)
    const shuffledLaws = [...lawPairs].sort(() => Math.random() - 0.5)
    
    setDescriptions(shuffledDescriptions)
    setLaws(shuffledLaws)
    setMatches({})
    setSelectedDescription(null)
    setCorrectMatches(new Set())
    setWrongMatches({})
    setScore(0)
    setShowResult(false)
    setAttempts(0)
  }

  if (showResult) {
    const accuracy = ((score / attempts) * 100).toFixed(1)
    
    return (
      <>
        <NavigationMenu />
        <CelebrationBackground score={score} total={lawPairs.length} />
        <div className="quiz-container">
          <div className="result-card">
            <h1>All Matched!</h1>
            <div className="score-display">
              <div className="score-number">{score}</div>
              <div className="score-total">out of {lawPairs.length}</div>
            </div>
            <div className="score-percentage">
              {Math.round((score / lawPairs.length) * 100)}%
            </div>
            <p style={{ color: '#888', fontSize: '1rem', marginTop: '1rem' }}>
              Accuracy: {accuracy}% • {attempts} attempts
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
          <h2>UX Laws - Match Pairs</h2>
          <div className="progress-info">
            <span>Matched: {correctMatches.size}/{lawPairs.length}</span>
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
              {swapColumns ? 'Click a description, then click its matching UX law' : 'Click a UX law, then click its matching description'}
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
                {swapColumns ? 'Descriptions' : 'UX Laws'}
              </h3>
              {(swapColumns ? descriptions : laws).map((item) => {
                const isSelected = selectedDescription?.id === item.id
                const isCorrect = correctMatches.has(item.id)
                const isWrong = wrongMatches[item.id] !== undefined
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleLawClick(item)}
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
                      height: '70px',
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
                    {swapColumns ? item.description : item.law}
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
                {swapColumns ? 'UX Laws' : 'Descriptions'}
              </h3>
              {(swapColumns ? laws : descriptions).map((item) => {
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
                      height: '70px',
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
                    {swapColumns ? item.law : item.description}
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

export default DragDropLaws
