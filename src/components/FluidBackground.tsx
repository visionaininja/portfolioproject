import { useEffect, useRef } from 'react'
// @ts-ignore
import WebGLFluid from 'webgl-fluid'

interface FluidBackgroundProps {
  theme: 'dark' | 'light'
}

export default function FluidBackground({ theme }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isDark = theme === 'dark'
    const backColor = isDark ? { r: 0, g: 0, b: 0 } : { r: 251, g: 251, b: 251 }

    try {
      WebGLFluid(canvas, {
        IMMEDIATE: true,
        TRIGGER: 'hover',
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 0.96,  // Fades out much faster to avoid cluttering screen
        VELOCITY_DISSIPATION: 0.96, // Stops moving quickly to stay subtle
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 15,                  // Gentler, slower curves instead of chaotic swirls
        SPLAT_RADIUS: 0.18,        // Thinner, more elegant trails
        SPLAT_FORCE: 4500,         // Softer push on cursor move
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 4,     // Slow color cycles for calming aesthetics
        PAUSED: false,
        BACK_COLOR: backColor,
        TRANSPARENT: false,
        BLOOM: isDark,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.6,      // Toned down glow intensity
        BLOOM_THRESHOLD: 0.7,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: isDark,
        SUNRAYS_RESOLUTION: 196,
        SUNRAYS_WEIGHT: 0.8
      })
    } catch (err) {
      console.error('Failed to initialize WebGL Fluid:', err)
    }

    // Forward events globally to ensure mousemove registers over active buttons and glass cards
    const forwardEvent = (e: MouseEvent | TouchEvent) => {
      if (e.target === canvas) return

      if (e instanceof MouseEvent) {
        const clone = new MouseEvent(e.type, {
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          buttons: e.buttons,
          bubbles: true,
          cancelable: true
        })
        canvas.dispatchEvent(clone)
      } else if (window.TouchEvent && e instanceof TouchEvent) {
        const clone = new TouchEvent(e.type, {
          touches: Array.from(e.touches),
          targetTouches: Array.from(e.targetTouches),
          changedTouches: Array.from(e.changedTouches),
          bubbles: true,
          cancelable: true
        })
        canvas.dispatchEvent(clone)
      }
    }

    window.addEventListener('mousemove', forwardEvent, { passive: true })
    window.addEventListener('mousedown', forwardEvent, { passive: true })
    window.addEventListener('mouseup', forwardEvent, { passive: true })
    window.addEventListener('touchmove', forwardEvent, { passive: true })
    window.addEventListener('touchstart', forwardEvent, { passive: true })

    return () => {
      window.removeEventListener('mousemove', forwardEvent)
      window.removeEventListener('mousedown', forwardEvent)
      window.removeEventListener('mouseup', forwardEvent)
      window.removeEventListener('touchmove', forwardEvent)
      window.removeEventListener('touchstart', forwardEvent)
    }
  }, [theme])

  return (
    <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden">
      {/* Low opacity (25%) so the fluid remains a faint background detail */}
      <canvas ref={canvasRef} className="h-full w-full opacity-25" />
    </div>
  )
}
