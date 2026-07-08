import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MapPin, Send, CheckCircle2, MessageSquareCode } from 'lucide-react'
import InteractiveCard from '../components/InteractiveCard.tsx'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
}

const inquiryTypes = [
  'General Question',
  'Contract Project',
  'Full-time Hiring',
  'Partnership Project',
  'Saying Hello 👋'
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  })
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const selectInquiry = (type: string) => {
    setFormData(prev => ({ ...prev, subject: type }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    
    // Simulate API submission
    setTimeout(() => {
      setStatus('success')
      setFormData({
        name: '',
        email: '',
        subject: 'General Question',
        message: ''
      })
      
      setTimeout(() => setStatus('idle'), 5000)
    }, 1500)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <motion.div variants={itemVariants}>
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl theme-text-primary">
              LET'S <br />
              <span className="text-outline text-outline-hover transition-colors">CONNECT</span>
            </h1>
            <p className="mt-6 theme-text-secondary text-xs md:text-sm leading-relaxed max-w-sm">
              I am open to new frontend design contracts, full-time remote developer roles, or system engineering collaborations.
            </p>

            <div className="mt-12 flex flex-col gap-6">
              <div className="flex items-center gap-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border theme-border bg-white/3 dark:bg-white/3 light:bg-black/3 theme-text-primary transition-all group-hover:bg-white/10 dark:group-hover:bg-white/10 light:group-hover:bg-black/10">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Email Me</div>
                  <a href="mailto:hello@ryandanielleubana.com" className="text-xs font-bold theme-text-primary hover:theme-text-secondary transition-colors">
                    hello@ryandanielleubana.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border theme-border bg-white/3 dark:bg-white/3 light:bg-black/3 theme-text-primary transition-all group-hover:bg-white/10 dark:group-hover:bg-white/10 light:group-hover:bg-black/10">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Location</div>
                  <div className="text-xs font-bold theme-text-primary">
                    Remote (UTC+8)
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Connect Card */}
          <motion.div variants={itemVariants} className="mt-12 lg:mt-0">
            <InteractiveCard className="bg-white/3 dark:bg-white/3 light:bg-black/3 border theme-border p-6" index={1}>
              <h3 className="font-display text-xs font-bold uppercase tracking-widest theme-text-primary flex items-center gap-2">
                <MessageSquareCode className="h-4.5 w-4.5 theme-text-secondary" />
                Response Time SLA
              </h3>
              <p className="text-[11px] leading-relaxed theme-text-secondary mt-2">
                I generally reply to inbox messages within 12 hours. For direct freelance inquiries or urgent calls, please specify in the subject tag.
              </p>
            </InteractiveCard>
          </motion.div>
        </div>

        {/* Form Column */}
        <motion.div variants={itemVariants} className="lg:col-span-7">
          <div className="rounded-2xl border theme-border bg-white/3 dark:bg-white/3 light:bg-black/3 p-8">
            <h2 className="font-display text-lg font-bold theme-text-primary mb-6">Send an Inquiry</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Inquiry categories selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold uppercase tracking-widest theme-text-secondary">Select Inquiry Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {inquiryTypes.map((type) => {
                    const isSelected = formData.subject === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => selectInquiry(type)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer active-spring-scale
                          ${isSelected 
                            ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
                            : 'bg-white/5 dark:bg-white/5 light:bg-black/5 theme-text-secondary theme-border'}`}
                      >
                        {type}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest theme-text-secondary">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  className="rounded-xl border theme-border bg-black/40 dark:bg-black/40 light:bg-white/40 px-4 py-3 text-xs theme-text-primary focus:border-current focus:outline-none transition-colors"
                  disabled={status === 'submitting'}
                />
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest theme-text-secondary">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. john@example.com"
                  className="rounded-xl border theme-border bg-black/40 dark:bg-black/40 light:bg-white/40 px-4 py-3 text-xs theme-text-primary focus:border-current focus:outline-none transition-colors"
                  disabled={status === 'submitting'}
                />
              </div>

              {/* Message Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest theme-text-secondary">Message Body</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Tell me about your project goals, timelines, or just say hi..."
                  className="rounded-xl border theme-border bg-black/40 dark:bg-black/40 light:bg-white/40 px-4 py-3 text-xs theme-text-primary focus:border-current focus:outline-none transition-colors resize-none"
                  disabled={status === 'submitting'}
                />
              </div>

              {/* Submit CTA */}
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0171E3] hover:bg-blue-600 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer disabled:opacity-50 active-spring-scale shadow-lg shadow-blue-500/20"
                >
                  {status === 'submitting' ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Status Alert Panels */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-[11px] font-semibold text-green-400"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span>Inquiry processed! Transmission complete. I'll get back to you shortly.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
