import { useEffect, useState } from 'react'
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
    <>
      <NavigationMenu />
      <CustomMenu />
      <aside className="table-of-contents">
        <h3>List</h3>
        <nav className="toc-nav">
          <a href="#chapter3" className="toc-link">Chapter 3</a>
          <a href="#chapter5" className="toc-link">Chapter 5</a>
          <a href="#chapter6" className="toc-link">Chapter 6</a>
          <a href="#chapter8" className="toc-link">Chapter 8</a>
          <a href="#chapter10" className="toc-link">Chapter 10</a>
          <a href="#uxlaws" className="toc-link">UX Laws</a>
        </nav>
      </aside>
      <div className="home-content">
        <h1 className="home-title"> X Interaction Design</h1>
        <p>Select a chapter to start practicing</p>
        <div className="chapter-list">
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
          <div className="chapter-button" id="uxlaws">
            <h3>UX Laws</h3>
            <p>Coming Soon</p>
          </div>
        </div>
      </div>
      <Footer />
      
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
          ↑
        </button>
      )}
    </>
  )
}

export default Home
