import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react'

interface NavbarProps {
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Ideas', path: '/ideas' },
  { name: 'Contact Me', path: '/contact' }
]

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b theme-border bg-black/10 dark:bg-black/40 light:bg-white/40 backdrop-blur-md pointer-events-auto-elements transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-1 font-display text-lg sm:text-xl md:text-2xl font-black tracking-tight theme-text-primary active-spring-scale">
          <span>RYAN DANIELLE UBANA</span>
          <span className="text-neutral-500 group-hover:theme-text-primary transition-colors duration-300">.</span>
        </Link>

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
          {/* Theme Toggle Button */}
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

          <Link
            to="/contact"
            className="group hidden items-center gap-2 rounded-full bg-[#0171E3] hover:bg-blue-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 active-spring-scale shadow-lg shadow-blue-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            Hire Me
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border theme-border bg-white/5 dark:bg-white/5 light:bg-black/5 theme-text-primary hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 active-spring-scale md:hidden"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t theme-border bg-black/90 dark:bg-black/95 light:bg-white/95 md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                      isActive ? 'theme-text-primary' : 'theme-text-secondary hover:theme-text-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#0171E3] py-3 text-center text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-95 shadow-md shadow-blue-500/10"
              >
                Hire Me
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
