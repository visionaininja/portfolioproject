import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, AlertCircle, Loader2 } from 'lucide-react'

interface CarImageUploaderProps {
  onImageSelected: (base64Image: string) => void
  className?: string
}

export default function CarImageUploader({
  onImageSelected,
  className = ''
}: CarImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    setErrorMessage(null)

    // Validate file format
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Invalid file format. Please upload JPG, PNG, or WebP.')
      return
    }

    // Validate size (max 12MB)
    if (file.size > 12 * 1024 * 1024) {
      setErrorMessage('File size too large. Maximum allowed size is 12MB.')
      return
    }

    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string

      img.onload = () => {
        // Compress & optimize image via HTML Canvas
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1920
        const MAX_HEIGHT = 1080
        let width = img.width
        let height = img.height

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width / height > MAX_WIDTH / MAX_HEIGHT) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          } else {
            width = Math.round((width * MAX_HEIGHT) / height)
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88)
          setIsLoading(false)
          onImageSelected(optimizedDataUrl)
        } else {
          setIsLoading(false)
          onImageSelected(e.target?.result as string)
        }
      }

      img.onerror = () => {
        setIsLoading(false)
        setErrorMessage('Failed to read image file. Please try another image.')
      }
    }

    reader.onerror = () => {
      setIsLoading(false)
      setErrorMessage('Error reading file. Please try again.')
    }

    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* EMPTY STATE UPLOADER MATCHING EXACT USER PROMPT DESIGN */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden
          ${isDragging 
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]' 
            : 'border-white/15 bg-neutral-900/60 hover:border-white/30 hover:bg-neutral-900/90'}`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-3" />
            <p className="text-sm font-bold text-white">Processing HD Car Image...</p>
            <p className="text-xs text-neutral-400 mt-1">Optimizing resolution for payment reveal animation</p>
          </div>
        ) : (
          <>
            {/* CAR ICON */}
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4 text-cyan-400 shadow-inner group-hover:scale-110 transition-transform">
              🚗
            </div>

            {/* HEADING & SUBTITLE */}
            <h3 className="font-display text-lg md:text-xl font-bold text-white tracking-tight">
              Upload your car image
            </h3>
            <p className="mt-2 max-w-sm text-xs md:text-sm text-neutral-400 leading-relaxed">
              Use a high-resolution image for the best payment visualization.
            </p>

            {/* BUTTON */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-transform duration-200 hover:bg-cyan-400 hover:scale-105 active-spring-scale shadow-lg"
            >
              <Upload className="w-4 h-4" />
              Upload Car Image
            </button>

            {/* SUPPORTED FORMATS FOOTER */}
            <div className="mt-6 text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">
              JPG • PNG • WebP • HD
            </div>
          </>
        )}

        {/* ERROR DISPLAY */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2 text-xs font-medium text-red-300"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}
