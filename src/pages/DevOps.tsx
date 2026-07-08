import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import devopsTelemetryImg from '../assets/devops-telemetry.png'

const rows = [
  {
    id: 'top',
    title: 'High-Level Cluster Metrics',
    items: [
      {
        heading: 'Cluster Resource Overview',
        body: 'Provides an immediate macro-lens view of the cluster\'s health by tracking active Nodes, Namespaces, Pods, Deployments, and Services.'
      },
      {
        heading: 'Health and Capacity Tracking',
        body: 'Visualizes deployment stability (e.g., "36 of 37 Pods Running / 0 with issues") via color-coded circular progress rings to instantly pinpoint infrastructure failures.'
      },
      {
        heading: 'Drill-Down Navigation',
        body: 'Features interactive, expandable metric cards allowing DevOps engineers to dive deeper into specific namespaces or node configurations.'
      }
    ]
  },
  {
    id: 'middle',
    title: 'Live Host Telemetry',
    items: [
      {
        heading: 'Real-Time Time-Series Graphing',
        body: 'Delivers zero-latency charting for critical system resource indicators: CPU, RAM, and Disk Usage.'
      },
      {
        heading: 'Granular Time-Window Selection',
        body: 'Allows operators to dynamically toggle between 1-minute, 3-minute, and 5-minute intervals to track sudden spikes or gradual memory leaks.'
      },
      {
        heading: 'Unified Performance Baseline',
        body: 'Consolidates isolated infrastructure metrics into a single, synchronized timeline to simplify root-cause analysis during unexpected load fluctuations.'
      }
    ]
  },
  {
    id: 'bottom',
    title: 'Cluster Host VMs Telemetry',
    items: [
      {
        heading: 'Granular Node Inspection',
        body: 'Breaks down the cluster into physical or virtual components by mapping out individual host internal IPs (e.g., 10.0.1.20).'
      },
      {
        heading: 'Micro-Utilization Metrics',
        body: 'Displays side-by-side semi-radial gauges for isolated CPU and Memory footprints unique to each virtual machine.'
      },
      {
        heading: 'Instant Node Status Indicators',
        body: 'Pairs telemetry with explicit READY status pills to immediately isolate a degraded or unresponsive host VM from healthy instances.'
      }
    ]
  }
]

export default function DevOps() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const activeRow = rows.find(r => r.id === hoveredRow) ?? null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20"
    >
      {/* Page Header */}
      <div className="mb-10">
        <span className="inline-block rounded-full border theme-border bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest theme-text-secondary mb-4">
          DevOps · Infrastructure
        </span>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl theme-text-primary">
          MONITORING &amp; <br />
          <span className="text-outline">OBSERVABILITY</span>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed theme-text-secondary">
          A modern infrastructure dashboard providing deep, real-time visibility into Kubernetes nodes, pods, and host VM telemetry.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {['Go', 'Docker', 'InfluxDB', 'Nginx', 'Kubernetes', 'Grafana'].map(tag => (
            <span key={tag} className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold theme-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Side-by-side layout: Image (left) + Popup panel (right) ── */}
      <div className="flex gap-4 items-stretch">

        {/* ── Left: Dashboard Screenshot ── */}
        <div className="relative flex-1 min-w-0 overflow-hidden rounded-2xl border theme-border shadow-2xl bg-black/20">
          <img
            src={devopsTelemetryImg}
            alt="Monitoring and Observability Dashboard"
            className="w-full h-auto block"
          />

          {/* 3 stacked hover zones with full-width white overlay */}
          <div className="absolute inset-0 flex flex-col">
            {rows.map((row) => (
              <div
                key={row.id}
                className="relative flex-1 cursor-crosshair"
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <AnimatePresence>
                  {hoveredRow === row.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}
                    >
                      <span className="text-sm font-extrabold uppercase tracking-widest text-black px-4 text-center">
                        {row.title}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Idle hint */}
          <AnimatePresence>
            {!hoveredRow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-3 left-4 z-20 text-[9px] font-bold uppercase tracking-widest text-white/40"
              >
                Hover each section to explore ↑
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Popup Panel wrapper (always takes w-80 space to retain image size) ── */}
        <div className="w-80 flex-shrink-0 relative">
          <AnimatePresence mode="wait">
            {activeRow && (
              <motion.div
                key={activeRow.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-2xl border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-md p-5 shadow-2xl flex flex-col justify-start overflow-hidden"
              >
                {/* Panel title */}
                <div className="mb-4">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-[#6bbcb6] mb-1">
                    Section Details
                  </p>
                  <h3 className="text-sm font-extrabold text-white leading-tight">
                    {activeRow.title}
                  </h3>
                  <div className="mt-1.5 h-[1.5px] w-8 rounded-full bg-[#0171E3]" />
                </div>

                {/* Feature List (No border, compact spacing to prevent scroll) */}
                <div className="flex flex-col gap-3.5 flex-1">
                  {activeRow.items.map((item, i) => (
                    <motion.div
                      key={item.heading}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="flex gap-2.5 items-start"
                    >
                      <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#6bbcb6]" />
                      <div>
                        <p className="text-[11px] font-extrabold text-white mb-0.5 leading-snug">
                          {item.heading}
                        </p>
                        <p className="text-[10px] leading-relaxed text-white/60">
                          {item.body}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
