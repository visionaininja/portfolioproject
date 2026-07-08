import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, Lightbulb, Terminal, Plus } from 'lucide-react'
import InteractiveCard from '../components/InteractiveCard.tsx'

interface Idea {
  id: string
  title: string
  description: string
  category: 'Design Theory' | 'Performance' | 'AI Systems' | 'DevOps'
  status: 'Researching' | 'Drafting' | 'Prototype Built' | 'Backlog'
  likes: number
  codeSnippet?: string
}

const initialIdeas: Idea[] = [
  {
    id: '1',
    title: 'CSS-Only 3D Render Engines',
    description: 'Investigating matrix3d transforms to project standard low-polygon meshes directly onto flat HTML tags, removing the WebGL overhead for simple landing animations.',
    category: 'Design Theory',
    status: 'Researching',
    likes: 42,
    codeSnippet: 'transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1);'
  },
  {
    id: '2',
    title: 'Zero-Hydration Serverless Architectures',
    description: 'Drafting middleware cache headers to inject static page fragments, replacing bulky bundle payloads with HTML stream pipelines that load sub-50ms on edge nodes.',
    category: 'Performance',
    status: 'Drafting',
    likes: 29
  },
  {
    id: '3',
    title: 'AI-Generated Bento Layout Schemas',
    description: 'Building a local LLM prompt template that evaluates content shapes and generates tailwind-grid HTML, balancing aspect ratios for dynamic portfolios automatically.',
    category: 'AI Systems',
    status: 'Prototype Built',
    likes: 87,
    codeSnippet: 'const evaluateRatio = (items) => items.map(item => item.cols * item.rows);'
  },
  {
    id: '4',
    title: 'Multi-Node Docker Health Daemon',
    description: 'Compiling a lightweight Go agent that runs inside Docker, monitoring socket health and piping system telemetry directly to personal Discord channels when memory spikes.',
    category: 'DevOps',
    status: 'Prototype Built',
    likes: 61
  },
  {
    id: '5',
    title: 'Adaptive Color Harmony Systems',
    description: 'An algorithm that adjusts HSL parameters depending on local solar time, sliding accent tones from neon lime during the morning to warm amber at night.',
    category: 'Design Theory',
    status: 'Backlog',
    likes: 18
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas)
  const [filter, setFilter] = useState<string>('All')
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState<'Design Theory' | 'Performance' | 'AI Systems' | 'DevOps'>('Design Theory')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleLike = (id: string) => {
    setIdeas(prev =>
      prev.map(idea => (idea.id === id ? { ...idea, likes: idea.likes + 1 } : idea))
    )
  }

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newDesc.trim()) return

    const newIdea: Idea = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      category: newCategory,
      status: 'Researching',
      likes: 0
    }

    setIdeas([newIdea, ...ideas])
    setNewTitle('')
    setNewDesc('')
    setShowAddForm(false)
  }

  const filteredIdeas = filter === 'All'
    ? ideas
    : ideas.filter(idea => idea.category === filter)

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
            IDEAS<span className="text-neutral-500">.</span>
          </h1>
          <p className="mt-4 max-w-xl theme-text-secondary text-xs md:text-sm leading-relaxed">
            A digital garden for theoretical systems, prototyping snippets, and technical design notes. Add your own concept below.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {['All', 'Design Theory', 'Performance', 'AI Systems', 'DevOps'].map((cat) => {
            const isActive = filter === cat
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-md border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 active-spring-scale cursor-pointer
                  ${isActive 
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
                    : 'bg-white/5 dark:bg-white/5 light:bg-black/5 theme-text-secondary theme-border'}`}
              >
                {cat}
              </button>
            )
          })}
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 rounded-md bg-[#0171E3] hover:bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200 active-spring-scale cursor-pointer shadow-md shadow-blue-500/10"
          >
            <Plus className="h-4 w-4" />
            New Note
          </button>
        </div>
      </div>

      {/* Add Idea Drawer */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddIdea} className="mt-8 rounded-2xl border theme-border bg-white/3 dark:bg-white/3 light:bg-black/3 p-6 flex flex-col gap-4">
              <h3 className="font-display text-base font-bold theme-text-primary">Share a Conceptual Draft</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest theme-text-secondary">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Serverless edge networks"
                    className="rounded-lg border theme-border bg-black/40 dark:bg-black/40 light:bg-white/40 px-4 py-2.5 text-xs theme-text-primary focus:border-current focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest theme-text-secondary">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="rounded-lg border theme-border bg-black/40 dark:bg-black/40 light:bg-white/40 px-4 py-2.5 text-xs theme-text-primary focus:border-current focus:outline-none"
                  >
                    <option value="Design Theory">Design Theory</option>
                    <option value="Performance">Performance</option>
                    <option value="AI Systems">AI Systems</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest theme-text-secondary">Abstract Description</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Outline the core mechanism, goals, and architectural challenges..."
                  rows={3}
                  className="rounded-lg border theme-border bg-black/40 dark:bg-black/40 light:bg-white/40 px-4 py-2.5 text-xs theme-text-primary focus:border-current focus:outline-none resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider theme-text-secondary hover:theme-text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#0171E3] hover:bg-blue-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white cursor-pointer active-spring-scale shadow-md shadow-blue-500/10"
                >
                  Publish Draft
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ideas Grid */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredIdeas.map((idea, idx) => {
            const categoryColors = {
              'Design Theory': 'text-purple-300 border-purple-300/10 bg-purple-300/5',
              'Performance': 'text-cyan-300 border-cyan-300/10 bg-cyan-300/5',
              'AI Systems': 'text-emerald-300 border-emerald-300/10 bg-emerald-300/5',
              'DevOps': 'text-blue-300 border-blue-300/10 bg-blue-300/5'
            }

            const statusColors = {
              'Researching': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
              'Drafting': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
              'Prototype Built': 'bg-green-500/15 text-green-400 border-green-500/20',
              'Backlog': 'bg-white/10 text-neutral-400 border-white/10'
            }

            return (
              <motion.div
                key={idea.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <InteractiveCard className="flex flex-col justify-between h-full min-h-[300px] p-6" index={idx}>
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`rounded-full border px-3 py-0.5 text-[8px] font-bold uppercase tracking-wider ${categoryColors[idea.category]}`}>
                        {idea.category}
                      </span>
                      <span className={`rounded border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${statusColors[idea.status]}`}>
                        {idea.status}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="font-display text-lg font-bold tracking-tight theme-text-primary mb-2 leading-tight">
                      {idea.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed theme-text-secondary">
                      {idea.description}
                    </p>

                    {/* Code Snippet Box */}
                    {idea.codeSnippet && (
                      <div className="mt-4 rounded-lg bg-black/80 dark:bg-black/80 light:bg-black/90 p-3 font-mono text-[9px] text-white/90 overflow-x-auto border theme-border">
                        <div className="flex items-center gap-1.5 mb-1.5 text-[8px] text-neutral-500 font-sans font-bold uppercase tracking-wider">
                          <Terminal className="h-3 w-3" />
                          Snippet Preview
                        </div>
                        <code>{idea.codeSnippet}</code>
                      </div>
                    )}
                  </div>

                  {/* Likes interaction */}
                  <div className="mt-6 flex items-center justify-between border-t theme-border pt-4">
                    <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 text-neutral-500" />
                      Digital Garden
                    </span>
                    
                    <button
                      onClick={() => handleLike(idea.id)}
                      className="group flex items-center gap-1.5 rounded-full border theme-border bg-white/5 dark:bg-white/5 light:bg-black/5 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 px-3.5 py-1.5 text-[11px] theme-text-primary transition-all cursor-pointer active-spring-scale"
                    >
                      <ThumbsUp className="h-3.5 w-3.5 theme-text-secondary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:theme-text-primary" />
                      <span className="font-bold tracking-tight">{idea.likes}</span>
                    </button>
                  </div>
                </InteractiveCard>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
