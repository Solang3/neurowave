'use client'

import { useState } from 'react'
import { WAVES } from '@/lib/waves'

export default function WavesPanel() {
  const [selected, setSelected] = useState<string | null>(null)
  const wave = WAVES.find((w) => w.id === selected)

  return (
    <div className="mb-10">
      <h2 className="font-serif text-2xl mb-5">Las 5 ondas</h2>

      {/* Cards de ondas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {WAVES.map((w) => (
          <button
            key={w.id}
            onClick={() => setSelected(selected === w.id ? null : w.id)}
            className={`rounded-xl p-4 text-left transition-all border ${
              selected === w.id
                ? 'border-opacity-50 scale-[1.02]'
                : 'bg-surface border-white/[0.07] hover:border-white/[0.15]'
            }`}
            style={{
              background: selected === w.id ? `${w.color}12` : undefined,
              borderColor: selected === w.id ? `${w.color}60` : undefined,
            }}
          >
            <div className="h-0.5 rounded-full mb-3" style={{ background: w.color }} />
            <p className="text-xs font-medium mb-0.5" style={{ color: w.color }}>{w.freqRange}</p>
            <p className="font-serif text-lg">{w.name}</p>
            <p className="text-xs text-muted mt-1">{w.useCase}</p>
            <p className="text-xs mt-2" style={{ color: w.color }}>
              {selected === w.id ? '▲ cerrar' : '▼ ver más'}
            </p>
          </button>
        ))}
      </div>

      {/* Panel expandible */}
      {wave && (
        <div
          className="rounded-2xl p-6 border transition-all"
          style={{ background: `${wave.color}08`, borderColor: `${wave.color}30` }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs tracking-widest uppercase font-medium mb-1" style={{ color: wave.color }}>
                {wave.freqRange}
              </p>
              <h3 className="font-serif text-3xl">{wave.name}</h3>
              <p className="text-sm text-muted mt-1">{wave.useCase}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-muted hover:text-white transition-colors text-xl flex-shrink-0"
            >
              ×
            </button>
          </div>

          <p className="text-sm text-white/80 leading-relaxed mb-5">
            {wave.description}
          </p>

          <div>
            <p className="text-xs tracking-widest uppercase text-muted mb-3">Beneficios</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        </div>
      )}
    </div>
  )
}