import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Cpu, Compass, Send, Sparkles } from 'lucide-react'
import InteractiveCard from '../components/InteractiveCard.tsx'
import ProjectCard from '../components/ProjectCard.tsx'

const sampleProjects = [
  {
    title: 'Aether DeFi Dashboard',
    description: 'A premium, real-time cryptocurrency dashboard featuring detailed charts, wallet integration, and yield-farming trackers.',
    category: 'Fintech App',
    tags: ['React', 'Vite', 'Framer Motion', 'Chart.js'],
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com'
  },
  {
    title: 'Cognitive Studio AI',
    description: 'An AI-powered interface design assistant that writes component code on the fly based on layout schematics.',
    category: 'AI Tool',
    tags: ['React', 'TypeScript', 'Node.js', 'OpenAI API'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
}

export default function Home() {
  const [localTime, setLocalTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const timeString = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      setLocalTime(timeString)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20"
    >
      {/* Background Watermark (aaabadcode.com style) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 flex justify-center overflow-hidden">
        <div className="hidden bg-gradient-to-b from-neutral-500/10 to-neutral-500/0 bg-clip-text text-[5rem] leading-none font-black text-transparent select-none sm:block lg:text-[8rem]">
          RYAN DANIELLE UBANA
        </div>
      </div>

      {/* Hero Section */}
      <motion.section variants={itemVariants} className="flex flex-col items-start gap-5">
        <div className="flex items-center gap-2 rounded-full border theme-border bg-white/5 dark:bg-white/5 light:bg-black/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider theme-text-primary">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          Creative Developer
        </div>
        
        <h1 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-6xl md:text-8xl theme-text-primary">
          ARCHITECTING <br />
          <span className="text-outline text-outline-hover transition-all duration-300">DIGITAL</span> <br />
          EXPERIENCES.
        </h1>
        
        <p className="max-w-2xl font-sans text-sm leading-relaxed theme-text-secondary md:text-base">
          Hi, I'm <span className="font-semibold theme-text-primary">Ryan Danielle Ubana</span>. I design and manage the infrastructure that keeps modern web applications running. From packaging code into Docker containers to orchestrating clusters and automating cloud resources with Terraform, I build reliable systems that cut down deployment times and eliminate production bottlenecks.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="group flex items-center gap-1.5 rounded-full bg-[#0171E3] hover:bg-blue-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 active-spring-scale shadow-lg shadow-blue-500/20"
          >
            Explore Projects
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-1.5 rounded-full border theme-border bg-white/5 dark:bg-white/5 light:bg-black/5 px-6 py-3 text-xs font-bold uppercase tracking-wider theme-text-primary transition-all duration-300 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 active-spring-scale"
          >
            Let's Talk
          </Link>
        </div>
      </motion.section>

      {/* Bento Grid Highlights */}
      <motion.section variants={itemVariants} className="mt-20">
        <h2 className="font-display text-[10px] font-bold uppercase tracking-widest theme-text-secondary mb-6">
          Brief Highlights
        </h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1: Biography */}
          <InteractiveCard className="md:col-span-2 flex flex-col justify-between h-[280px]" index={1}>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest theme-text-secondary">About Me</span>
              <h3 className="font-display text-xl font-bold theme-text-primary md:text-2xl">
                Engineering Custom Layouts & Interface Code
              </h3>
              <p className="text-xs leading-relaxed theme-text-secondary max-w-xl mt-1">
                I enjoy engineering high-performance user interfaces and building modular dev tools. My process centers on creating fluid animations, scalable container architectures, and micro-interactions that make applications feel alive.
              </p>
            </div>
            <div>
              <Link to="/about" className="group flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider theme-text-primary hover:theme-text-secondary transition-colors">
                Read My Story
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </InteractiveCard>

          {/* Card 2: Stats */}
          <InteractiveCard className="flex flex-col justify-between h-[280px]" index={2}>
            <span className="text-[10px] font-bold uppercase tracking-widest theme-text-secondary">Metrics</span>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <div className="font-display text-3xl font-black theme-text-primary">04+</div>
                <div className="text-[10px] theme-text-secondary font-semibold mt-0.5">Years Coding</div>
              </div>
              <div>
                <div className="font-display text-3xl font-black theme-text-primary">20+</div>
                <div className="text-[10px] theme-text-secondary font-semibold mt-0.5">Projects Built</div>
              </div>
              <div>
                <div className="font-display text-3xl font-black theme-text-primary">99%</div>
                <div className="text-[10px] theme-text-secondary font-semibold mt-0.5">Success Rate</div>
              </div>
              <div>
                <div className="font-display text-3xl font-black theme-text-primary">100k</div>
                <div className="text-[10px] theme-text-secondary font-semibold mt-0.5">Users Reached</div>
              </div>
            </div>
            <div className="text-[9px] uppercase tracking-wider text-neutral-500">
              Last updated: July 2026
            </div>
          </InteractiveCard>

          {/* Card 3: Location / Focus / Local Time */}
          <InteractiveCard className="flex flex-col justify-between h-[280px]" index={3}>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest theme-text-secondary">Status</span>
              <h4 className="font-display text-sm font-bold theme-text-primary flex items-center gap-1.5">
                <Compass className="h-4 w-4 theme-text-primary animate-spin" style={{ animationDuration: '10s' }} />
                Based in Southeast Asia
              </h4>
              <p className="text-xs leading-relaxed theme-text-secondary mt-1">
                Currently focusing on React micro-frontends, Tailwind v4 performance, and Kubernetes orchestration.
              </p>
            </div>
            
            <div className="border-t theme-border pt-4">
              <div className="text-[9px] uppercase tracking-wider text-neutral-500">Local Time</div>
              <div className="font-display text-2xl font-bold tracking-tight theme-text-primary mt-0.5">
                {localTime || '00:00:00'}
              </div>
            </div>
          </InteractiveCard>

          {/* Card 4: Tech stack */}
          <InteractiveCard className="flex flex-col justify-between h-[280px]" index={4}>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest theme-text-secondary">Stack Highlights</span>
              <h4 className="font-display text-sm font-bold theme-text-primary flex items-center gap-1.5">
                <Cpu className="h-4 w-4 theme-text-primary" />
                Modern Ecosystem
              </h4>
              <p className="text-xs leading-relaxed theme-text-secondary mt-1">
                Leveraging high-velocity technologies to deliver clean rendering speeds and reliable deploy systems.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {['React', 'Vite', 'Tailwind', 'Docker', 'GraphQL'].map((tech) => (
                <span key={tech} className="rounded border theme-border bg-white/5 dark:bg-white/5 light:bg-black/5 px-2 py-0.5 text-[9px] font-bold theme-text-primary">
                  {tech}
                </span>
              ))}
            </div>
          </InteractiveCard>

          {/* Card 5: Call to Action */}
          <InteractiveCard className="flex flex-col justify-between h-[280px]" index={5}>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest theme-text-secondary">Start a Project</span>
              <h4 className="font-display text-base font-bold theme-text-primary">
                Have an idea in mind? Let's bring it to life.
              </h4>
              <p className="text-xs leading-relaxed theme-text-secondary mt-1">
                Drop a line and we can brainstorm features, UI design, and production deployment pipeline.
              </p>
            </div>
            
            <div>
              <Link
                to="/contact"
                className="group flex items-center justify-between rounded-xl bg-[#0171E3] hover:bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition-all active-spring-scale shadow-md shadow-blue-500/10"
              >
                Send Message
                <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </InteractiveCard>
        </div>
      </motion.section>

      {/* Featured Projects */}
      <motion.section variants={itemVariants} className="mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-[10px] font-bold uppercase tracking-widest theme-text-secondary">
              Works
            </h2>
            <h3 className="font-display text-2xl font-bold theme-text-primary mt-1">
              Featured Work
            </h3>
          </div>
          <Link
            to="/projects"
            className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider theme-text-secondary hover:theme-text-primary transition-colors"
          >
            All Projects
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {sampleProjects.map((project, idx) => (
            <ProjectCard
              key={project.title}
              {...project}
              index={idx}
            />
          ))}
        </div>
      </motion.section>
    </motion.div>
  )
}
