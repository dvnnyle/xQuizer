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

  useEffect(() => {
    // Shuffle both arrays
    const shuffledDescriptions = [...lawPairs].sort(() => Math.random() - 0.5)
    const shuffledLaws = [...lawPairs].sort(() => Math.random() - 0.5)
    
    setDescriptions(shuffledDescriptions)
    setLaws(shuffledLaws)
  }, [])

  const handleDescriptionClick = (desc) => {
    if (correctMatches.has(desc.id)) return
    setSelectedDescription(desc)
  }

  const handleLawClick = (law) => {
    if (!selectedDescription) return
    if (correctMatches.has(law.id)) return

    setAttempts(attempts + 1)

    // Check if it's a correct match
    if (selectedDescription.id === law.id) {
      setMatches({ ...matches, [selectedDescription.id]: law.id })
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
      // Wrong match - show feedback
      setWrongMatches({ ...wrongMatches, [selectedDescription.id]: law.id })
      setTimeout(() => {
        const newWrongMatches = { ...wrongMatches }
        delete newWrongMatches[selectedDescription.id]
        setWrongMatches(newWrongMatches)
        setSelectedDescription(null)
      }, 1000)
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

        <div style={{ 
          padding: '2rem',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <p style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            color: '#aaa',
            fontSize: '1rem'
          }}>
            Click a description, then click the matching law name
          </p>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'start'
          }}>
            {/* Descriptions column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ 
                color: '#646cff', 
                marginBottom: '0.5rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                📝 Descriptions
              </h3>
              {descriptions.map((desc) => {
                const isSelected = selectedDescription?.id === desc.id
                const isCorrect = correctMatches.has(desc.id)
                const isWrong = wrongMatches[desc.id] !== undefined
                
                return (
                  <motion.div
                    key={desc.id}
                    onClick={() => handleDescriptionClick(desc)}
                    whileHover={!isCorrect ? { scale: 1.01 } : {}}
                    whileTap={!isCorrect ? { scale: 0.99 } : {}}
                    style={{
                      padding: '1.2rem',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #646cff' : 
                              isCorrect ? '2px solid #22c55e' :
                              isWrong ? '2px solid #ef4444' :
                              '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.08)' :
                                     isWrong ? 'rgba(239, 68, 68, 0.08)' :
                                     isSelected ? 'rgba(100, 108, 255, 0.08)' :
                                     'rgba(255, 255, 255, 0.02)',
                      cursor: isCorrect ? 'not-allowed' : 'pointer',
                      opacity: isCorrect ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      color: isCorrect ? '#22c55e' : '#ddd',
                      position: 'relative',
                      boxShadow: isSelected ? '0 0 0 3px rgba(100, 108, 255, 0.1)' : 
                                isCorrect ? '0 0 0 2px rgba(34, 197, 94, 0.1)' :
                                'none'
                    }}
                  >
                    {desc.description}
                    {isCorrect && (
                      <span style={{ 
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        fontSize: '1.3rem',
                        color: '#22c55e'
                      }}>✓</span>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Laws column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ 
                color: '#646cff', 
                marginBottom: '0.5rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                🎯 UX Laws
              </h3>
              {laws.map((law) => {
                const isMatched = correctMatches.has(law.id)
                const isWrongTarget = Object.values(wrongMatches).includes(law.id)
                
                return (
                  <motion.div
                    key={law.id}
                    onClick={() => handleLawClick(law)}
                    whileHover={!isMatched ? { scale: 1.01 } : {}}
                    whileTap={!isMatched ? { scale: 0.99 } : {}}
                    style={{
                      padding: '1.2rem',
                      borderRadius: '10px',
                      border: isMatched ? '2px solid #22c55e' :
                              isWrongTarget ? '2px solid #ef4444' :
                              '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: isMatched ? 'rgba(34, 197, 94, 0.08)' :
                                     isWrongTarget ? 'rgba(239, 68, 68, 0.08)' :
                                     'rgba(255, 255, 255, 0.02)',
                      cursor: isMatched ? 'not-allowed' : 'pointer',
                      opacity: isMatched ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      fontSize: '1rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      color: isMatched ? '#22c55e' : '#fff',
                      position: 'relative',
                      boxShadow: isMatched ? '0 0 0 2px rgba(34, 197, 94, 0.1)' : 'none'
                    }}
                  >
                    {law.law}
                    {isMatched && (
                      <span style={{ 
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        fontSize: '1.3rem',
                        color: '#22c55e'
                      }}>✓</span>
                    )}
                  </motion.div>
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
