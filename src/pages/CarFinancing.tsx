import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function CarFinancing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20 min-h-[60vh] flex flex-col justify-center items-center text-center"
    >
      <div className="glass-card p-12 rounded-3xl max-w-xl w-full border theme-border shadow-2xl">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight theme-text-primary mb-4">
          Car Financing
        </h1>
        <p className="theme-text-secondary text-sm md:text-base leading-relaxed mb-8">
          This is a blank page placeholder for the Car Financing dashboard and calculator service.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-bold text-white uppercase tracking-wider dark:bg-white dark:text-black transition-transform duration-200 hover:scale-105 active-spring-scale"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>
    </motion.div>
  )
}
