import React, { useEffect, useState, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
import Home from './pages/Home.tsx'
import About from './pages/About.tsx'
import Projects from './pages/Projects.tsx'
import Ideas from './pages/Ideas.tsx'
import Contact from './pages/Contact.tsx'
import DevOps from './pages/DevOps.tsx'
import FluidBackground from './components/FluidBackground.tsx'

// Scroll restoration hook
function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any })
  }, [pathname])
  
  return null
}

// Staggered animated transition wrapper for all sub-pages
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 w-full pointer-events-none-layout"
    >
      <div className="pointer-events-auto-elements">
        {children}
      </div>
    </motion.main>
  )
}

interface FrozenRouteWrapperProps {
  renderRoutes: (location: any) => React.ReactNode
}

function FrozenRouteWrapper({ renderRoutes }: FrozenRouteWrapperProps) {
  const location = useLocation()
  const preservedLocation = useRef(location)
  return <>{renderRoutes(preservedLocation.current)}</>
}

export default function App() {
  const location = useLocation()
  // Retrieve saved theme preference or default to dark
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('portfolio-theme')
    if (saved === 'dark' || saved === 'light') return saved
    return 'dark'
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="relative flex min-h-screen flex-col font-sans selection:bg-neutral-500 selection:text-white transition-colors duration-300">
      {/* Interactive WebGL Fluid Canvas Background */}
      <FluidBackground theme={theme} />

      <ScrollToTop />
      
      {/* Navigation Headers */}
      <div className="relative z-20">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
      </div>
      
      {/* Route Switcher wrapped in AnimatePresence */}
      <div className="relative z-10 flex-1 flex flex-col pointer-events-none-layout">
        <AnimatePresence mode="wait">
          <FrozenRouteWrapper key={location.pathname} renderRoutes={(frozenLocation) => (
            <Routes location={frozenLocation}>
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                }
              />
              <Route
                path="/about"
                element={
                  <PageWrapper>
                    <About />
                  </PageWrapper>
                }
              />
              <Route
                path="/projects"
                element={
                  <PageWrapper>
                    <Projects />
                  </PageWrapper>
                }
              />
              <Route
                path="/ideas"
                element={
                  <PageWrapper>
                    <Ideas />
                  </PageWrapper>
                }
              />
              <Route
                path="/contact"
                element={
                  <PageWrapper>
                    <Contact />
                  </PageWrapper>
                }
              />
              <Route
                path="/devops"
                element={
                  <PageWrapper>
                    <DevOps />
                  </PageWrapper>
                }
              />
              {/* Fallback to Home */}
              <Route
                path="*"
                element={
                  <PageWrapper>
                    <Home />
                  </PageWrapper>
                }
              />
            </Routes>
          )} />
        </AnimatePresence>
      </div>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  )
}
