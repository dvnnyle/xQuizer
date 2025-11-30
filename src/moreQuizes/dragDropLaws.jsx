import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import CelebrationBackground from '../components/CelebrationBackground'
import '../chapterList/chapter3.css'

const lawPairs = [
  { id: 1, description: "Elements close together are seen as related.", law: "Law of Proximity" },
  { id: 2, description: "Users prefer your product to work like other familiar products.", law: "Jakob's Law" },
  { id: 3, description: "People remember the first and last items best.", law: "Serial Position Effect" },
  { id: 4, description: "The time to reach a target depends on its size and distance.", law: "Fitts's Law" },
  { id: 5, description: "Decision time increases with the number of choices.", law: "Hick's Law" },
  { id: 6, description: "Similar items appear related.", law: "Law of Similarity" },
  { id: 7, description: "People can store about 7±2 items in short-term memory.", law: "Miller's Law" },
  { id: 8, description: "Distinct items are more memorable.", law: "Von Restorff Effect" },
  { id: 9, description: "Users perceive aesthetically pleasing design as easier to use.", law: "Aesthetic-Usability Effect" },
  { id: 10, description: "The simplest solution is usually the best.", law: "Occam's Razor" },
  { id: 11, description: "80% of the effects come from 20% of the causes.", law: "Pareto Principle" },
  { id: 12, description: "People judge an experience by its peak and end moments.", law: "Peak-End Rule" },
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
              Accuracy: {accuracy}% ({attempts} attempts)
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
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Descriptions column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ 
                color: '#646cff', 
                marginBottom: '0.5rem',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                Descriptions
              </h3>
              {descriptions.map((desc) => {
                const isSelected = selectedDescription?.id === desc.id
                const isCorrect = correctMatches.has(desc.id)
                const isWrong = wrongMatches[desc.id] !== undefined
                
                return (
                  <motion.div
                    key={desc.id}
                    onClick={() => handleDescriptionClick(desc)}
                    whileHover={!isCorrect ? { scale: 1.02 } : {}}
                    whileTap={!isCorrect ? { scale: 0.98 } : {}}
                    style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: isSelected ? '3px solid #646cff' : 
                              isCorrect ? '3px solid #10b981' :
                              isWrong ? '3px solid #ef4444' :
                              '2px solid #333',
                      backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.1)' :
                                     isWrong ? 'rgba(239, 68, 68, 0.1)' :
                                     '#1a1a1a',
                      cursor: isCorrect ? 'default' : 'pointer',
                      opacity: isCorrect ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      color: isCorrect ? '#10b981' : '#fff'
                    }}
                  >
                    {desc.description}
                    {isCorrect && (
                      <span style={{ 
                        marginLeft: '0.5rem',
                        fontSize: '1.2rem'
                      }}>✓</span>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Laws column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ 
                color: '#646cff', 
                marginBottom: '0.5rem',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                UX Laws
              </h3>
              {laws.map((law) => {
                const isMatched = correctMatches.has(law.id)
                const isWrongTarget = Object.values(wrongMatches).includes(law.id)
                
                return (
                  <motion.div
                    key={law.id}
                    onClick={() => handleLawClick(law)}
                    whileHover={!isMatched ? { scale: 1.02 } : {}}
                    whileTap={!isMatched ? { scale: 0.98 } : {}}
                    style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: isMatched ? '3px solid #10b981' :
                              isWrongTarget ? '3px solid #ef4444' :
                              '2px solid #333',
                      backgroundColor: isMatched ? 'rgba(16, 185, 129, 0.1)' :
                                     isWrongTarget ? 'rgba(239, 68, 68, 0.1)' :
                                     '#1a1a1a',
                      cursor: isMatched ? 'default' : 'pointer',
                      opacity: isMatched ? 0.6 : 1,
                      transition: 'all 0.3s ease',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      color: isMatched ? '#10b981' : '#fff'
                    }}
                  >
                    {law.law}
                    {isMatched && (
                      <span style={{ 
                        marginLeft: '0.5rem',
                        fontSize: '1.2rem'
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
