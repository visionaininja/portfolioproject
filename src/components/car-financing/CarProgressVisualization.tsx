import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Sliders, ShieldCheck } from 'lucide-react'

interface CarProgressVisualizationProps {
  image?: string
  percentage: number
  carName: string
  plateNumber: string
  paymentsMade: number
  loanTerm: number
  amountPaid: number
  remainingBalance: number
  onUpdatePayments?: (newPaymentsMade: number) => void
  onReplaceImage?: () => void
}

export default function CarProgressVisualization({
  image,
  percentage,
  carName,
  plateNumber,
  paymentsMade,
  loanTerm,
  amountPaid,
  remainingBalance,
  onUpdatePayments,
  onReplaceImage
}: CarProgressVisualizationProps) {
  const [brightnessFilter, setBrightnessFilter] = useState(100)
  const [showAdjustments, setShowAdjustments] = useState(false)

  const safePercentage = Math.min(100, Math.max(0, percentage))

  if (!image) {
    return null
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-neutral-900/90 border border-white/10 shadow-2xl group transition-all duration-300">
      {/* Container aspect ratio for car photos */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60 select-none">
        
        {/* LAYER 1: UNPAID STATE (Muted, Grayscale, Darkened) */}
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={`${carName} - Unpaid State`}
            className="h-full w-full object-cover transition-all duration-300 filter grayscale contrast-125 brightness-50 opacity-60"
            style={{ filter: `grayscale(100%) brightness(${brightnessFilter * 0.45}%) contrast(130%)` }}
          />
          {/* Subtle grid pattern overlay for muted zone */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        </div>

        {/* LAYER 2: PAID STATE (Original HD Color Image Revealed by clip-path) */}
        <div
          className="absolute inset-0 z-10 transition-all duration-500 ease-out overflow-hidden"
          style={{
            clipPath: `polygon(0 0, ${safePercentage}% 0, ${safePercentage}% 100%, 0 100%)`
          }}
        >
          <img
            src={image}
            alt={`${carName} - Paid Color Reveal`}
            className="h-full w-full object-cover filter brightness-105 contrast-105"
            style={{ filter: `brightness(${brightnessFilter}%)` }}
          />
          {/* Subtle sheen highlight on paid layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        </div>

        {/* GLOWING REVEAL DIVIDER LINE */}
        {safePercentage > 0 && safePercentage < 100 && (
          <div
            className="absolute top-0 bottom-0 z-20 w-1 transition-all duration-500 ease-out pointer-events-none"
            style={{ left: `calc(${safePercentage}% - 2px)` }}
          >
            {/* Bright laser line */}
            <div className="h-full w-full bg-gradient-to-b from-cyan-400 via-emerald-400 to-cyan-400 shadow-[0_0_15px_#06b6d4]" />
            
            {/* Animated shine badge at top of line */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-black/85 backdrop-blur-md px-2 py-0.5 border border-cyan-400/50 shadow-lg text-[9px] font-black text-cyan-300 tracking-wider flex items-center gap-1 whitespace-nowrap">
              <Sparkles className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
              {safePercentage.toFixed(1)}% PAID
            </div>
          </div>
        )}

        {/* BADGES & CONTROLS OVERLAY */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
          <span className="rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white border border-white/10 shadow-md flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {plateNumber}
          </span>
          <span className="rounded-full bg-emerald-500/20 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
            {safePercentage >= 100 ? 'Fully Owned 🎉' : `${paymentsMade} / ${loanTerm} Paid (${Math.max(0, loanTerm - paymentsMade)} Mo. Left)`}
          </span>
        </div>

        {/* TOP RIGHT ACTIONS */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
          <button
            onClick={() => setShowAdjustments(!showAdjustments)}
            className="p-1.5 rounded-full bg-black/70 backdrop-blur-md text-neutral-300 hover:text-white border border-white/10 transition-colors"
            title="Image Display Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
          {onReplaceImage && (
            <button
              onClick={onReplaceImage}
              className="rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white hover:bg-white hover:text-black border border-white/20 transition-all shadow-md active-spring-scale cursor-pointer"
            >
              Replace Image
            </button>
          )}
        </div>

        {/* DISPLAY FILTER ADJUSTMENT DROPDOWN */}
        {showAdjustments && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-12 right-3 z-40 p-3 rounded-xl bg-black/90 backdrop-blur-xl border border-white/15 shadow-2xl w-48 text-xs text-white"
          >
            <div className="flex items-center justify-between mb-2 font-bold text-[10px] text-neutral-400 uppercase tracking-wider">
              <span>Image Brightness</span>
              <span>{brightnessFilter}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="140"
              value={brightnessFilter}
              onChange={(e) => setBrightnessFilter(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </motion.div>
        )}

        {/* BOTTOM STATS BANNER OVERLAY */}
        <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pt-8 flex items-end justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Payment Status</div>
            <div className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>₱{amountPaid.toLocaleString()} paid</span>
              <span className="text-neutral-500 font-normal text-xs">/ ₱{(amountPaid + remainingBalance).toLocaleString()}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Remaining Balance</div>
            <div className="text-sm font-extrabold text-cyan-400">
              ₱{remainingBalance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK INTERACTIVE PAYMENT STEPPER / SLIDER FOR TESTING */}
      {onUpdatePayments && (
        <div className="p-3 bg-neutral-950/80 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdatePayments(Math.max(0, paymentsMade - 1))}
              disabled={paymentsMade <= 0}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-neutral-300 disabled:opacity-30 border border-white/10 font-bold transition-all cursor-pointer"
            >
              -1 Month
            </button>
            <span className="text-[11px] font-mono text-neutral-400 font-semibold">
              {paymentsMade} / {loanTerm} Months
            </span>
            <button
              onClick={() => onUpdatePayments(Math.min(loanTerm, paymentsMade + 1))}
              disabled={paymentsMade >= loanTerm}
              className="px-2.5 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold transition-all cursor-pointer"
            >
              +1 Month
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <span className="text-[10px] uppercase font-bold text-neutral-500">Progress</span>
            <input
              type="range"
              min="0"
              max={loanTerm}
              value={paymentsMade}
              onChange={(e) => onUpdatePayments(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[11px] font-bold text-cyan-400 font-mono w-12 text-right">
              {safePercentage.toFixed(0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
