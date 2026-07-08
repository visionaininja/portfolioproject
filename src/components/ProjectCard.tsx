import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  category: string
  image: string
  githubUrl?: string
  liveUrl?: string
  index: number
}

export default function ProjectCard({
  title,
  description,
  tags,
  category,
  image,
  liveUrl = '#',
  index
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCoords({ x, y })

    const rotateX = -((y - height / 2) / height) * 10
    const rotateY = ((x - width / 2) / width) * 10

    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }

  // Determine if liveUrl is internal (React Router) or external
  const isInternalLink = liveUrl.startsWith('/')

  const OverviewLink = ({ children, className }: { children: React.ReactNode; className: string }) =>
    isInternalLink ? (
      <Link to={liveUrl} className={className}>{children}</Link>
    ) : (
      <a href={liveUrl} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
    )

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="tilt-card-container glass-card pointer-events-auto-elements overflow-hidden rounded-2xl active-spring-scale"
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Light spotlight reflection on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.06) 0%, transparent 100%)`
        }}
      />

      <div className="relative z-10 flex h-full flex-col overflow-hidden p-5">

        {/* Project Thumbnail Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-white/5">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out"
            style={{
              transform: isHovered ? 'scale(1.03)' : 'scale(1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-85" />

          {/* Category Badge */}
          <span className="absolute top-3 left-3 rounded-full bg-black/75 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white border border-white/10">
            {category}
          </span>
        </div>

        {/* Info Area */}
        <div className="tilt-card-inner mt-5 flex flex-1 flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-white/80">
              {title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#998f8f]">
              {description}
            </p>
          </div>

          <div className="mt-5">
            {/* Tech Badges */}
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Links — Overview only, Source Code removed */}
            <div className="mt-5 flex items-center justify-end border-t border-white/5 pt-4">
              <OverviewLink
                className="group/btn flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white hover:text-white/80 transition-colors"
              >
                Overview
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </OverviewLink>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
