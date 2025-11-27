import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import benyon12Data from '../../dataBank/dataSub/benyon12lit.json'
import './uxLaws.css'

function Benyon12Lit() {
  const [principles, setPrinciples] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPrinciple, setSelectedPrinciple] = useState(null)
  const [selectedPrincipleIndex, setSelectedPrincipleIndex] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 300))
      setPrinciples(benyon12Data)
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  const filteredPrinciples = principles.filter(principle =>
    principle.principle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    principle.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (principle) => {
    const idx = filteredPrinciples.findIndex(p => p.id === principle.id)
    setSelectedPrinciple(principle)
    setSelectedPrincipleIndex(idx)
  }

  const closeModal = () => {
    setSelectedPrinciple(null)
    setSelectedPrincipleIndex(null)
  }

  const showPreviousPrinciple = (e) => {
    e.stopPropagation()
    if (selectedPrincipleIndex > 0) {
      const prevIdx = selectedPrincipleIndex - 1
      setSelectedPrinciple(filteredPrinciples[prevIdx])
      setSelectedPrincipleIndex(prevIdx)
    }
  }

  const showNextPrinciple = (e) => {
    e.stopPropagation()
    if (selectedPrincipleIndex < filteredPrinciples.length - 1) {
      const nextIdx = selectedPrincipleIndex + 1
      setSelectedPrinciple(filteredPrinciples[nextIdx])
      setSelectedPrincipleIndex(nextIdx)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationMenu />
      
      <div className="ux-laws-container">
        <div className="laws-header">
          <h1>Benyon's 12 Principles</h1>
          <p className="laws-subtitle">
            Fundamental principles for designing effective user experiences
          </p>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search principles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>

        <div className="laws-grid">
          {isLoading ? (
            Array(12).fill(0).map((_, index) => (
              <div key={index} className="law-card skeleton-card">
                <div className="skeleton-number"></div>
                <div className="law-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-description"></div>
                  <div className="skeleton-description short"></div>
                </div>
              </div>
            ))
          ) : (
            filteredPrinciples.map((principle) => (
              <motion.div
                key={principle.id}
                className="law-card"
                onClick={() => openModal(principle)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: principle.id * 0.05 }}
              >
                <div className="law-number">#{principle.id}</div>
                
                <div className="law-content">
                  <h3 className="law-title">{principle.principle}</h3>
                  <p className="law-description">{principle.description}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {!isLoading && filteredPrinciples.length === 0 && (
          <div className="no-results">
            <p>No principles found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPrinciple && (
        <motion.div
          className="modal-overlay"
          onClick={closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Floating nav group */}
            <div className="modal-nav-group floating-nav">
              <button 
                className="carousel-btn prev-btn" 
                onClick={showPreviousPrinciple}
                disabled={selectedPrincipleIndex === 0}
              >
                &#8592; Previous
              </button>
              <button className="close-btn" onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <button 
                className="carousel-btn next-btn" 
                onClick={showNextPrinciple}
                disabled={selectedPrincipleIndex === filteredPrinciples.length - 1}
              >
                Next &#8594;
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-header">
                <h2>{selectedPrinciple.principle}</h2>
                <span className="modal-number">#{selectedPrinciple.id}</span>
              </div>

              <div className="modal-description">
                <h4>Description</h4>
                <p>{selectedPrinciple.description}</p>
              </div>

              {selectedPrinciple.whyItMatters && (
                <div className="modal-why-matters" style={{ marginTop: '1em' }}>
                  <h4>Why It Matters</h4>
                  <p>{selectedPrinciple.whyItMatters}</p>
                </div>
              )}

              {selectedPrinciple.takeaways && selectedPrinciple.takeaways.length > 0 && (
                <div className="modal-takeaways" style={{ marginTop: '1em' }}>
                  <h4>Key Takeaways</h4>
                  <ul>
                    {selectedPrinciple.takeaways.map((takeaway, idx) => (
                      <li key={idx}>{takeaway}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-example" style={{ marginTop: '1em' }}>
                <h4>Example</h4>
                <p>{selectedPrinciple.example}</p>
              </div>

              <div className="modal-actions">
                <a
                  href="/benyon12"
                  className="learn-more-btn"
                >
                  Take the Quiz
                </a>
              </div>
              
              <div className="modal-divider"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Benyon12Lit
