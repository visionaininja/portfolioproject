import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '../components/ProjectCard.tsx'

const projectsData = [
  {
    title: 'Aether DeFi Dashboard',
    description: 'A premium, real-time cryptocurrency dashboard featuring detailed charts, wallet integration, and yield-farming trackers.',
    category: 'Web Apps',
    tags: ['React', 'Vite', 'Framer Motion', 'Chart.js'],
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com'
  },
  {
    title: 'Cognitive Studio AI',
    description: 'An AI-powered interface design assistant that writes component code on the fly based on layout schematics.',
    category: 'AI Tools',
    tags: ['React', 'TypeScript', 'Node.js', 'OpenAI API'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com'
  },
  {
    title: 'Chronos Telemetry Node',
    description: 'A distributed systems node dashboard showing live CPU/RAM usage, container cluster health, and triggering Discord webhook alerts.',
    category: 'DevOps',
    tags: ['Go', 'Docker', 'InfluxDB', 'Nginx'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com'
  },
  {
    title: 'Vector Canvas engine',
    description: 'An interactive HTML5 Canvas editor supporting vector shapes, Bezier curves, exports to SVG, and custom key bindings.',
    category: 'Web Apps',
    tags: ['TypeScript', 'HTML5 Canvas', 'CSS Modules'],
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com'
  },
  {
    title: 'Nebula API Gateway',
    description: 'A modular, high-performance API router that rate-limits inbound requests, strips metadata headers, and caches responses.',
    category: 'DevOps',
    tags: ['Go', 'Redis', 'Docker Compose', 'GitHub Actions'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com'
  }
]

const categories = ['All', 'Web Apps', 'AI Tools', 'DevOps']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProjects = selectedCategory === 'All'
    ? projectsData
    : projectsData.filter(proj => proj.category === selectedCategory)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b theme-border pb-10">
        <div>
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl theme-text-primary">
            PROJECTS<span className="text-neutral-500">.</span>
          </h1>
          <p className="mt-4 max-w-xl theme-text-secondary text-xs md:text-sm leading-relaxed">
            A curated showcase of applications built with high performance UI stacks and containerized deploy frameworks.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 active-spring-scale cursor-pointer border
                  ${isActive 
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
                    : 'bg-white/5 dark:bg-white/5 light:bg-black/5 theme-text-secondary theme-border'}`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mt-12">
        <motion.div
          layout
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  category={project.category}
                  tags={project.tags}
                  image={project.image}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                  index={idx}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="theme-text-secondary text-xs">No projects found in this category.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
