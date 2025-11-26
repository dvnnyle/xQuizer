import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NavigationMenu from '../pages/widget/navigationMenu'
import './uxLaws.css'

function UxLaws() {
  const [uxLaws, setUxLaws] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLaw, setSelectedLaw] = useState(null)
  const [selectedLawIndex, setSelectedLawIndex] = useState(null)

  useEffect(() => {
    // Load UX Laws data
    fetch('/dataBank/dataSub.json/uxData.json')
      .then(response => response.json())
      .then(data => setUxLaws(data))
      .catch(error => console.error('Error loading UX laws:', error))
  }, [])

  const filteredLaws = uxLaws.filter(law =>
    law.law.toLowerCase().includes(searchTerm.toLowerCase()) ||
    law.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (law) => {
    const idx = filteredLaws.findIndex(l => l.id === law.id)
    setSelectedLaw(law)
    setSelectedLawIndex(idx)
  }

  const closeModal = () => {
    setSelectedLaw(null)
    setSelectedLawIndex(null)
  }

  const showPreviousLaw = (e) => {
    e.stopPropagation()
    if (selectedLawIndex > 0) {
      const prevIdx = selectedLawIndex - 1
      setSelectedLaw(filteredLaws[prevIdx])
      setSelectedLawIndex(prevIdx)
    }
  }

  const showNextLaw = (e) => {
    e.stopPropagation()
    if (selectedLawIndex < filteredLaws.length - 1) {
      const nextIdx = selectedLawIndex + 1
      setSelectedLaw(filteredLaws[nextIdx])
      setSelectedLawIndex(nextIdx)
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
          <h1>UX Laws & Principles</h1>
          <p className="laws-subtitle">
            Essential principles that guide effective user experience design
          </p>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search UX laws..."
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
          {filteredLaws.map((law) => (
            <motion.div
              key={law.id}
              className="law-card"
              onClick={() => openModal(law)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: law.id * 0.05 }}
            >
              <div className="law-image-placeholder">
                <img 
                  src={law.image} 
                  alt={law.law}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="image-fallback" style={{ display: 'none' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h2"></path>
                    <path d="M11 13.6V16c0 1.1.9 2 2 2h2"></path>
                    <path d="M16 8V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v8"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                  </svg>
                </div>
              </div>
              
              <div className="law-number">#{law.id}</div>
              
              <div className="law-content">
                <h3 className="law-title">{law.law}</h3>
                <p className="law-description">{law.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredLaws.length === 0 && (
          <div className="no-results">
            <p>No UX laws found matching your search.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedLaw && (
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
            <div className="modal-image">
              <img 
                src={selectedLaw.image} 
                alt={selectedLaw.law}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="modal-image-fallback" style={{ display: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h2"></path>
                  <path d="M11 13.6V16c0 1.1.9 2 2 2h2"></path>
                  <path d="M16 8V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v8"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                </svg>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="modal-header">
                <h2>{selectedLaw.law}</h2>
                <span className="modal-number">#{selectedLaw.id}</span>
              </div>
              
              <div className="modal-description">
                <h4>Description</h4>
                <p>{selectedLaw.description}</p>
              </div>
              
              <div className="modal-example">
                <h4>Example</h4>
                <p>{selectedLaw.example}</p>
              </div>
              
              <div className="modal-actions">
                <a 
                  href={selectedLaw.image} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="learn-more-btn"
                >
                  Learn More
                </a>
              </div>
              
              <div className="modal-divider"></div>
            </div>
            
            <div className="modal-nav-group">
              <button 
                className="carousel-btn prev-btn" 
                onClick={showPreviousLaw}
                disabled={selectedLawIndex === 0}
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
                onClick={showNextLaw}
                disabled={selectedLawIndex === filteredLaws.length - 1}
              >
                Next &#8594;
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default UxLaws