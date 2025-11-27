import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import '../App.css'
import './Home.css'
import NavigationMenu from './widget/navigationMenu'
import CustomMenu from './widget/customMenu'
import Footer from './widget/footer'

function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleTocClick = (e) => {
      const link = e.target.closest('.toc-link')
      if (!link) return
      
      e.preventDefault()
      const targetId = link.getAttribute('href').substring(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        // Smooth scroll
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // Add pulse effect
        targetElement.classList.add('pulse-effect')
        setTimeout(() => {
          targetElement.classList.remove('pulse-effect')
        }, 1500)
      }
    }

    const tocNav = document.querySelector('.toc-nav')
    if (tocNav) {
      tocNav.addEventListener('click', handleTocClick)
    }

    return () => {
      if (tocNav) {
        tocNav.removeEventListener('click', handleTocClick)
      }
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavigationMenu />
      <CustomMenu />
      <aside className="table-of-contents">
        <h3>List</h3>
        <nav className="toc-nav">
          <a href="#randomquiz" className="toc-link">Random Mix</a>
          <a href="#fullquestions" className="toc-link">All Questions</a>
          <a href="#chapter2" className="toc-link">Chapter 2</a>
          <a href="#chapter3" className="toc-link">Chapter 3</a>
          <a href="#chapter5" className="toc-link">Chapter 5</a>
          <a href="#chapter6" className="toc-link">Chapter 6</a>
          <a href="#chapter7" className="toc-link">Chapter 7</a>
          <a href="#chapter8" className="toc-link">Chapter 8</a>
          <a href="#chapter10" className="toc-link">Chapter 10</a>
          <a href="#uxlaws" className="toc-link">UX Laws</a>
          <a href="#benyon12lit" className="toc-link">Benyon's Principles</a>
          <a href="#uxquiz1" className="toc-link">UX Quiz</a>
          <a href="#uxquiz2" className="toc-link">UX Quiz 2</a>
          <a href="#findincorrect" className="toc-link">Find Incorrect</a>
          <a href="#benyon12" className="toc-link">Benyon's 12 Principles</a>
          <a href="#findincorrect2" className="toc-link">Find All Incorrect</a>
        </nav>
      </aside>
      <div className="home-content">
        <h1 className="home-title"> UXUI Design</h1>
        <p>Select to start practicing</p>
        <div className="chapter-list">
          <a href="/randomquiz" className="chapter-button featured" id="randomquiz">
            <h3>🎲 Random Mix</h3>
            <p>Chapters 2, 3, 5, 6, 7, 8, 10</p>
            <span className="question-count">30 random questions </span>
          </a>
          <a href="/fullquestions" className="chapter-button featured red-theme" id="fullquestions">
            <h3>🔥 All Questions</h3>
            <p>Every question from chapters 2, 3, 5, 6, 7, 8, and 10</p>
            <span className="question-count">178 questions total</span>
          </a>
          <div className="chapter-divider">
            <span>Chapters</span>
          </div>
          <a href="/chapter2" className="chapter-button" id="chapter2">
            <h3>Chapter 2</h3>
            <p>PACT: A Framework for Designing UX</p>
            <span className="question-count">31 questions</span>
          </a>
          <a href="/chapter3" className="chapter-button" id="chapter3">
            <h3>Chapter 3</h3>
            <p>The process of human-centred UX design</p>
            <span className="question-count">29 questions</span>
          </a>
          <a href="/chapter5" className="chapter-button" id="chapter5">
            <h3>Chapter 5</h3>
            <p>Designing for people</p>
            <span className="question-count">30 questions</span>
          </a>
          <a href="/chapter6" className="chapter-button" id="chapter6">
            <h3>Chapter 6</h3>
            <p>Designing for experience</p>
            <span className="question-count">33 questions</span>
          </a>
          <a href="/chapter7" className="chapter-button" id="chapter7">
            <h3>Chapter 7</h3>
            <p>Understanding</p>
            <span className="question-count">30 questions</span>
          </a>
          <a href="/chapter8" className="chapter-button" id="chapter8">
            <h3>Chapter 8</h3>
            <p>Envisionment</p>
            <span className="question-count">26 questions</span>
          </a>
          <a href="/chapter10" className="chapter-button" id="chapter10">
            <h3>Chapter 10</h3>
            <p>Evaluation</p>
            <span className="question-count">30 questions</span>
          </a>
          <div className="chapter-divider">
            <span>UX Laws</span>
          </div>
          <a href="/uxlaws" className="chapter-button green-theme" id="uxlaws">
            <h3>📚 UX Laws</h3>
            <p>Read about essential principles for user experience design</p>
            <span className="question-count">21 laws</span>
          </a>
          <div className="quiz-grid">
            <a href="/uxquiz1" className="chapter-button" id="uxquiz1">
              <h3>🎯 UX Laws Quiz</h3>
              <p>Test your knowledge of UX principles</p>
              <span className="question-count">21 questions</span>
            </a>
            <a href="/uxquiz2" className="chapter-button" id="uxquiz2">
              <h3>🎯 UX Laws Quiz 2</h3>
              <p>Match laws with descriptions</p>
              <span className="question-count">21 questions</span>
            </a>
          </div>
          <div className="chapter-divider">
            <span>Extra</span>
          </div>
          <a href="/benyon12lit" className="chapter-button green-theme" id="benyon12lit">
            <h3>📖 Benyon's Principles</h3>
            <p>Learn the 12 fundamental principles of UX design</p>
            <span className="question-count">12 principles</span>
          </a>
          <a href="/benyon12" className="chapter-button" id="benyon12">
            <h3>📐 Benyon's 12 Principles</h3>
            <p>Master fundamental UX design principles</p>
            <span className="question-count">20 questions</span>
          </a>
          <div className="chapter-divider">
            <span>Challenge</span>
          </div>
          <div className="quiz-grid">
            <a href="/findincorrect" className="chapter-button" id="findincorrect">
              <h3>❌ Find Incorrect</h3>
              <p>Identify incorrect statements about design concepts</p>
              <span className="question-count">6 questions</span>
            </a>
            <a href="/findincorrect2" className="chapter-button" id="findincorrect2">
              <h3>🎯 Find All Incorrect</h3>
              <p>Select multiple incorrect statements per question</p>
              <span className="question-count">4 questions</span>
            </a>
          </div>
        </div>
      </div>
      <Footer />
      
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
          ↑
        </button>
      )}
    </motion.div>
  )
}

export default Home
