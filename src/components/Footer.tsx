import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Github, Linkedin, Twitter, Dribbble } from 'lucide-react'

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Dribbble, href: 'https://dribbble.com', label: 'Dribbble' }
]

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-auto border-t theme-border bg-black/40 dark:bg-black/40 light:bg-black/5 py-12 theme-text-secondary pointer-events-auto-elements transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand section */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="font-display text-lg sm:text-xl font-black tracking-tight theme-text-primary active-spring-scale">
              RYAN DANIELLE UBANA<span className="opacity-40">.</span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed">
              Crafting high-fidelity, interactive digital experiences that blend aesthetic elegance with technical precision.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest theme-text-primary">Navigation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="hover:text-black dark:hover:text-white transition-colors">About</Link>
              <Link to="/projects" className="hover:text-black dark:hover:text-white transition-colors">Projects</Link>
              <Link to="/ideas" className="hover:text-black dark:hover:text-white transition-colors">Ideas</Link>
              <Link to="/contact" className="hover:text-black dark:hover:text-white transition-colors col-span-2">Contact Me</Link>
            </div>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4 md:items-end">
            <div className="flex flex-col gap-3 md:items-end">
              <h4 className="text-[10px] font-bold uppercase tracking-widest theme-text-primary">Connect</h4>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border theme-border bg-white/5 dark:bg-white/5 light:bg-black/5 theme-text-primary transition-all hover:bg-white/15 dark:hover:bg-white/15 light:hover:bg-black/15 active-spring-scale"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <button
              onClick={scrollToTop}
              className="group mt-2 flex items-center gap-1.5 rounded-full border theme-border bg-white/5 dark:bg-white/5 light:bg-black/5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider theme-text-primary transition-all hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 active-spring-scale"
            >
              Back to Top
              <ArrowUp className="h-3 w-3 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t theme-border pt-8 text-[10px] md:flex-row">
          <p>© {new Date().getFullYear()} Ryan Danielle Ubana Portfolio. All rights reserved.</p>
          <div className="mt-4 flex gap-6 md:mt-0 font-semibold">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
