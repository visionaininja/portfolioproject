import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, Sun, Moon, Home, User, Briefcase, Lightbulb, Mail } from 'lucide-react'

interface NavbarProps {
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

const navLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'About', path: '/about', icon: User },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Ideas', path: '/ideas', icon: Lightbulb },
  { name: 'Contact Me', path: '/contact', icon: Mail }
]

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Prevent background scrolling when menu drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Auto-close drawer on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b theme-border bg-black/10 dark:bg-black/40 light:bg-white/40 backdrop-blur-md pointer-events-auto-elements transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        {/* Left Side: Mobile Hamburger Menu & Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger menu icon (positioned on left on mobile/iPad) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border theme-border bg-white/5 dark:bg-white/5 light:bg-black/5 theme-text-primary hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 active-spring-scale md:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="group flex items-center gap-1 font-display text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-tight theme-text-primary active-spring-scale">
            <span>RYAN DANIELLE UBANA</span>
            <span className="text-neutral-500 group-hover:theme-text-primary transition-colors duration-300">.</span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-300 theme-text-secondary hover:text-current"
                style={{ color: isActive ? 'var(--color-foreground)' : '' }}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-current"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Action Controls (Theme switch & CTAs) */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button (Desktop & Mobile header) */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border theme-border bg-white/5 dark:bg-white/5 light:bg-black/5 theme-text-primary hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 active-spring-scale cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-yellow-300 animate-pulse" />
            ) : (
              <Moon className="h-4 w-4 text-blue-600" />
            )}
          </button>

          {/* Hire Me CTA (Visible on desktop) */}
          <Link
            to="/contact"
            className="group hidden items-center gap-2 rounded-full bg-[#0171E3] hover:bg-blue-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 active-spring-scale shadow-lg shadow-blue-500/20 md:flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            Hire Me
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Mobile/iPad Drawer Overlay (Left Side Slide-in Panel) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Left-side Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute top-0 bottom-0 left-0 w-80 max-w-[85vw] border-r theme-border bg-black/90 dark:bg-zinc-950/95 light:bg-white/95 shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b theme-border mb-6">
                <span className="font-display text-xs font-black tracking-widest uppercase theme-text-primary">
                  Navigation Menu
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border theme-border bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4 theme-text-primary" />
                </button>
              </div>

              {/* Grid Menu of styled cards/tiles */}
              <div className="grid grid-cols-2 gap-4">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = location.pathname === link.path
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`glass-card rounded-2xl flex flex-col justify-between p-4 min-h-[110px] relative overflow-hidden active-spring-scale text-left cursor-pointer transition-all border ${
                        isActive
                          ? 'border-[#0171E3] bg-[#0171E3]/15'
                          : 'theme-border hover:bg-neutral-800/10'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all ${
                        isActive
                          ? 'border-[#0171E3]/30 bg-[#0171E3]/20 text-[#0171E3]'
                          : 'theme-border bg-white/5 dark:bg-white/5 light:bg-black/5'
                      }`}>
                        <Icon className={`h-5 w-5 ${isActive ? 'text-[#0171E3]' : 'theme-text-primary'}`} />
                      </div>
                      <div className="mt-4">
                        <span className={`text-[11px] font-display font-black tracking-widest uppercase block ${
                          isActive ? 'text-[#0171E3]' : 'theme-text-primary'
                        }`}>
                          {link.name}
                        </span>
                      </div>
                    </Link>
                  )
                })}

                {/* Grid Item 6: Styled Theme Switcher matching other menu tiles */}
                <button
                  onClick={toggleTheme}
                  className="glass-card rounded-2xl flex flex-col justify-between p-4 min-h-[110px] relative overflow-hidden active-spring-scale text-left cursor-pointer transition-all border theme-border hover:bg-neutral-800/10"
                >
                  <div className="h-10 w-10 rounded-full flex items-center justify-center border theme-border bg-white/5 dark:bg-white/5 light:bg-black/5">
                    {theme === 'dark' ? (
                      <Sun className="h-5 w-5 text-yellow-300 animate-pulse" />
                    ) : (
                      <Moon className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="text-[11px] font-display font-black tracking-widest uppercase block theme-text-primary">
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Drawer Footer Connect / Action Area */}
              <div className="mt-auto pt-6 border-t theme-border">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0171E3] hover:bg-blue-600 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white transition-all shadow-lg shadow-blue-500/20 active-spring-scale"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
                  </span>
                  Hire Me
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}
