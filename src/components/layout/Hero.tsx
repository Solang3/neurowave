'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

interface HeroProps {
  isLoggedIn?: boolean
}

export default function Hero({ isLoggedIn }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const waves = [
      { freq: 0.3, amp: 60, speed: 0.3, color: '#c4a8f0', y: 0.35 },
      { freq: 0.5, amp: 45, speed: 0.5, color: '#a8f0c8', y: 0.45 },
      { freq: 0.8, amp: 35, speed: 0.7, color: '#7eb8f7', y: 0.55 },
      { freq: 1.2, amp: 25, speed: 0.9, color: '#f0e8a8', y: 0.62 },
      { freq: 2.0, amp: 18, speed: 1.2, color: '#f0a8a8', y: 0.70 },
    ]

    let t = 0
    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      waves.forEach((w) => {
        ctx.beginPath()
        ctx.strokeStyle = w.color
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.15
        for (let x = 0; x <= canvas.width; x += 2) {
          const y =
            canvas.height * w.y +
            Math.sin(x * w.freq * 0.01 + t * w.speed) * w.amp
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      })
      ctx.globalAlpha = 1
      t += 0.02
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-16 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-accent/30 rounded-full px-4 py-1.5 text-xs text-accent mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Respaldado por medicina clínica
        </div>

        {/* Headline */}
        <h1 className="font-serif text-6xl md:text-8xl leading-none tracking-tight mb-6">
          Tu mente<br />
          en la <em className="text-accent">frecuencia</em><br />
          correcta
        </h1>

        <p className="max-w-lg text-muted text-lg mb-8">
          Ondas binaurales curadas por un médico cirujano. Bibliografía
          científica real. Sin misticismo.
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1a3a2a] to-[#2a4a3a] border-2 border-accent/30 flex items-center justify-center font-serif text-accent text-lg">
            R
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">Dr. Rogelio González</div>
            <div className="text-xs text-muted">
              Médico Clínico Cirujano · +40 años · Hospital Militar Central
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-4">
          {isLoggedIn ? (
            <Link
              href="/"
              className="bg-accent text-bg font-medium px-8 py-3.5 rounded-full hover:-translate-y-0.5 hover:opacity-90 transition-all"
            >
              Ir a mi biblioteca
            </Link>
          ) : (
            <>
              <a
                href="#playlists"
                className="bg-accent text-bg font-medium px-8 py-3.5 rounded-full hover:-translate-y-0.5 hover:opacity-90 transition-all"
              >
                Escuchar ahora — gratis
              </a>
              <a
                href="#ciencia"
                className="border border-white/10 text-white px-8 py-3.5 rounded-full hover:-translate-y-0.5 hover:border-white/20 transition-all"
              >
                Ver la ciencia
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
