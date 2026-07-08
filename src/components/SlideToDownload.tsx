import { useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

interface SlideToDownloadProps {
  pdfUrl: string
  fileName: string
}

export default function SlideToDownload({ pdfUrl, fileName }: SlideToDownloadProps) {
  const [isDownloaded, setIsDownloaded] = useState(false)
  const dragX = useMotionValue(0)
  
  // Track width is 240px, thumb is 32px, padding is 4px. Max drag distance is 240 - 32 - 8 = 200px.
  const maxDrag = 200
  
  // Dynamic opacity mapping for the placeholder text as the slider moves
  const textOpacity = useTransform(dragX, [0, maxDrag * 0.8], [0.8, 0])
  const progressWidth = useTransform(dragX, [0, maxDrag], [0, maxDrag + 32])

  const handleDragEnd = () => {
    const currentX = dragX.get()
    
    if (currentX >= maxDrag * 0.95) {
      // Success! Lock slider at the end, trigger download, and show success state
      setIsDownloaded(true)
      dragX.set(maxDrag)
      
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Reset after 3.5 seconds
      setTimeout(() => {
        setIsDownloaded(false)
        dragX.set(0)
      }, 3500)
    } else {
      // Snap back to starting position if not slid all the way
      animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 20 })
    }
  }

  return (
    <div className="flex flex-col gap-3 mt-6">
      <div className="text-[10px] font-bold uppercase tracking-widest theme-text-secondary">
        Professional Resume
      </div>
      
      <div className="relative w-full max-w-[240px] h-10 border theme-border bg-white/3 dark:bg-white/3 light:bg-black/3 rounded-full flex items-center justify-start p-1 overflow-hidden select-none pointer-events-auto-elements">
        
        {/* Dynamic sliding progress background */}
        <motion.div 
          className="absolute left-0 top-0 bottom-0 bg-[#0171E3]/20 rounded-l-full pointer-events-none"
          style={{ width: progressWidth }}
        />

        {/* Sliding thumb handle */}
        {!isDownloaded ? (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: maxDrag }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ x: dragX }}
            className="h-8 w-8 rounded-full bg-[#0171E3] hover:bg-blue-600 active-spring-scale cursor-grab active:cursor-grabbing flex items-center justify-center text-white z-20 shadow-md transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="absolute right-1 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white z-20 shadow-md"
          >
            <Check className="h-4 w-4" />
          </motion.div>
        )}

        {/* Animated label text */}
        <motion.span 
          style={{ opacity: isDownloaded ? 0 : textOpacity }}
          className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider theme-text-secondary pointer-events-none z-10 pl-6"
        >
          Slide to Download
        </motion.span>

        {/* Success message */}
        {isDownloaded && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center text-[9px] font-bold uppercase tracking-wider text-green-500 pointer-events-none z-10 pr-6"
          >
            Downloaded!
          </motion.span>
        )}
      </div>
    </div>
  )
}
