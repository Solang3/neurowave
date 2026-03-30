'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { WAVES } from '@/lib/waves'

export default function WavesPanel() {
  const [selected, setSelected] = useState<string | null>(null)
  const wave = WAVES.find((w) => w.id === selected)

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  return (
    <div className="mb-10">
      <h2 className="font-serif text-2xl mb-5">Las 5 ondas</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {WAVES.map((w) => (
          <button
            key={w.id}
            onClick={() => setSelected(w.id)}
            className="rounded-xl p-4 text-left transition-all border bg-surface border-white/[0.07] hover:border-white/[0.15] hover:scale-[1.02]"
          >
            <div className="h-0.5 rounded-full mb-3" style={{ background: w.color }} />
            <p className="text-xs font-medium mb-0.5" style={{ color: w.color }}>{w.freqRange}</p>
            <p className="font-serif text-lg">{w.name}</p>
            <p className="text-xs text-muted mt-1">{w.useCase}</p>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && wave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-bg/80 backdrop-blur-md"
            onClick={() => setSelected(null)}
          />

          {/* Panel */}
          <div
            className="relative w-full max-w-lg rounded-3xl p-8 border shadow-2xl"
            style={{ background: `color-mix(in srgb, #0d1117 92%, ${wave.color})`, borderColor: `${wave.color}30` }}
          >
            {/* Cerrar */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-white transition-all"
            >
              ×
            </button>

            {/* Header */}
            <p className="text-xs tracking-widest uppercase font-medium mb-1" style={{ color: wave.color }}>
              {wave.freqRange}
            </p>
            <h3 className="font-serif text-4xl mb-1">{wave.name}</h3>
            <p className="text-sm text-muted mb-5">{wave.useCase}</p>

            {/* Descripción */}
            <p className="text-sm text-white/80 leading-relaxed mb-6">
              {wave.description}
            </p>

            {/* Beneficios */}
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase text-muted mb-3">Beneficios</p>
              <div className="grid grid-cols-1 gap-2">
                {wave.benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2.5 text-sm">
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: `${wave.color}20`, border: `1px solid ${wave.color}40` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: wave.color }} />
                    </span>
                    <span className="text-white/80">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.07]">
              <button
                onClick={() => setSelected(null)}
                className="text-sm text-muted hover:text-white transition-colors"
              >
                ← Cerrar
              </button>
              <Link
                href={`/ondas/${wave.id}`}
                onClick={() => setSelected(null)}
                className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:opacity-90"
                style={{ background: `${wave.color}20`, color: wave.color, border: `1px solid ${wave.color}40` }}
              >
                Ver bibliografía científica →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}