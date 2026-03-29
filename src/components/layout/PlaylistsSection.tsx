'use client'

import { useState, useRef, useEffect } from 'react'

const R2_PUBLIC = 'https://pub-78c976d8802a412ca89533a0734f5054.r2.dev'

const WAVE_GROUPS = [
  {
    wave: 'Delta', freq: '0.5–4 Hz', color: '#c4a8f0', binauralHz: 2,
    bg: 'rgba(196,168,240,0.08)', emoji: '🌙', useCase: 'Sueño profundo',
    tracks: [
      { id: 'delta-nature', genre: 'Nature', emoji: '🌿', path: 'delta/nature/Delta-nature-001-binaural.mp3' },
      { id: 'delta-classic', genre: 'Classic', emoji: '🎻', path: 'delta/classic/Delta-classic-001-binaural.mp3' },
      { id: 'delta-ambient', genre: 'Ambient', emoji: '🌌', path: 'delta/ambient/Delta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Theta', freq: '4–8 Hz', color: '#a8f0c8', binauralHz: 6,
    bg: 'rgba(168,240,200,0.08)', emoji: '🧘', useCase: 'Meditación y ansiedad',
    tracks: [
      { id: 'theta-nature', genre: 'Nature', emoji: '🌿', path: 'theta/nature/Theta-nature-001-binaural.mp3' },
      { id: 'theta-classic', genre: 'Classic', emoji: '🎻', path: 'theta/classic/Theta-classic-001-binaural.mp3' },
      { id: 'theta-ambient', genre: 'Ambient', emoji: '🌌', path: 'theta/ambient/Theta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Alpha', freq: '8–13 Hz', color: '#7eb8f7', binauralHz: 10,
    bg: 'rgba(126,184,247,0.08)', emoji: '🌊', useCase: 'Relajación activa',
    tracks: [
      { id: 'alpha-nature', genre: 'Nature', emoji: '🌿', path: 'alpha/nature/Alpha-nature-001-binaural.mp3' },
      { id: 'alpha-classic', genre: 'Classic', emoji: '🎻', path: 'alpha/classic/Alpha-classic-001-binaural.mp3' },
      { id: 'alpha-ambient', genre: 'Ambient', emoji: '🌌', path: 'alpha/ambient/Alpha-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Beta', freq: '13–30 Hz', color: '#f0e8a8', binauralHz: 15,
    bg: 'rgba(240,232,168,0.08)', emoji: '⚡', useCase: 'Foco y trabajo',
    tracks: [
      { id: 'beta-nature', genre: 'Nature', emoji: '🌿', path: 'beta/nature/Beta-nature-001-binaural.mp3' },
      { id: 'beta-classic', genre: 'Classic', emoji: '🎻', path: 'beta/classic/Beta-classic-001-binaural.mp3' },
      { id: 'beta-ambient', genre: 'Ambient', emoji: '🌌', path: 'beta/ambient/Beta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Gamma', freq: '30–100 Hz', color: '#f0a8a8', binauralHz: 40,
    bg: 'rgba(240,168,168,0.08)', emoji: '🧠', useCase: 'Alto rendimiento',
    tracks: [
      { id: 'gamma-nature', genre: 'Nature', emoji: '🌿', path: 'gamma/nature/Gamma-nature-001-binaural.mp3' },
      { id: 'gamma-classic', genre: 'Classic', emoji: '🎻', path: 'gamma/classic/Gamma-classic-001-binaural.mp3' },
      { id: 'gamma-ambient', genre: 'Ambient', emoji: '🌌', path: 'gamma/ambient/Gamma-ambient-001-binaural.mp3' },
    ],
  },
]

const PREVIEW_SECONDS = 20

export default function PlaylistsSection() {
  const [openWave, setOpenWave] = useState('Delta')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [elapsed, setElapsed] = useState<Record<string, number>>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function handlePlay(id: string, path: string) {
    if (playingId === id) {
      audioRef.current?.pause()
      setPlayingId(null)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    audioRef.current?.pause()
    if (intervalRef.current) clearInterval(intervalRef.current)

    const url = `${R2_PUBLIC}/${path}`
    const audio = new Audio(url)
    audio.volume = 0.8
    audioRef.current = audio
    audio.play().catch(() => {})
    setPlayingId(id)
    setProgress((p) => ({ ...p, [id]: 0 }))
    setElapsed((p) => ({ ...p, [id]: 0 }))

    let secs = 0
    intervalRef.current = setInterval(() => {
      secs += 0.25
      setProgress((p) => ({ ...p, [id]: (secs / PREVIEW_SECONDS) * 100 }))
      setElapsed((p) => ({ ...p, [id]: Math.floor(secs) }))
      if (secs >= PREVIEW_SECONDS) {
        audio.pause()
        setPlayingId(null)
        setProgress((p) => ({ ...p, [id]: 0 }))
        setElapsed((p) => ({ ...p, [id]: 0 }))
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 250)
  }

  function formatTime(secs: number) {
    const remaining = PREVIEW_SECONDS - secs
    return `0:${remaining.toString().padStart(2, '0')}`
  }

  const currentGroup = WAVE_GROUPS.find((g) => g.wave === openWave)!

  return (
    <section id="playlists" className="bg-surface border-t border-white/[0.07] py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 md:px-12">
        <p className="text-xs tracking-widest uppercase text-accent mb-4">Playlists curadas</p>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          Una lista para<br />
          <em className="text-accent">cada necesidad</em>
        </h2>
        <p className="text-muted max-w-lg mb-10">
          Seleccionadas por el Dr. González. Escuchá 20 segundos gratis — sin registro.
        </p>

        {/* Tabs de ondas */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {WAVE_GROUPS.map((g) => (
            <button
              key={g.wave}
              onClick={() => setOpenWave(g.wave)}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all"
              style={{
                background: openWave === g.wave ? `${g.color}20` : 'transparent',
                border: `1px solid ${openWave === g.wave ? g.color + '50' : 'rgba(255,255,255,0.07)'}`,
                color: openWave === g.wave ? g.color : '#6b7580',
              }}
            >
              <span>{g.emoji}</span>
              <span>{g.wave}</span>
            </button>
          ))}
        </div>

        {/* Info de la onda */}
        <p className="text-xs text-muted mb-4">
          {currentGroup.useCase} · {currentGroup.binauralHz} Hz binaural
        </p>

        {/* Tracks */}
        <div className="flex flex-col gap-3 mb-6">
          {currentGroup.tracks.map((track) => {
            const isPlaying = playingId === track.id
            const prog = progress[track.id] ?? 0
            const elapsedSecs = elapsed[track.id] ?? 0

            return (
              <div
                key={track.id}
                className="border border-white/[0.07] rounded-2xl p-5 transition-all"
                style={{ background: isPlaying ? currentGroup.bg : 'transparent' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: currentGroup.bg }}
                  >
                    {track.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{currentGroup.wave} · {track.genre}</p>
                    <p className="text-xs mt-0.5" style={{ color: currentGroup.color }}>
                      {currentGroup.wave} · {currentGroup.binauralHz} Hz binaural · muestra 20s
                    </p>
                    <div className="mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{ width: `${prog}%`, background: currentGroup.color }}
                      />
                    </div>
                  </div>

                  <span className="text-xs text-muted font-mono w-10 text-right flex-shrink-0">
                    {isPlaying ? formatTime(elapsedSecs) : `0:${PREVIEW_SECONDS}`}
                  </span>

                  <button
                    onClick={() => handlePlay(track.id, track.path)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                    style={{
                      background: isPlaying ? currentGroup.color : `${currentGroup.color}20`,
                      border: `1px solid ${currentGroup.color}40`,
                    }}
                  >
                    {isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect x="1" y="1" width="4" height="10" rx="1" fill="#080c10"/>
                        <rect x="7" y="1" width="4" height="10" rx="1" fill="#080c10"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 1L11 6L2 11V1Z" fill={currentGroup.color}/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="bg-bg border border-white/[0.07] rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-medium text-sm">¿Querés escuchar completo?</p>
            <p className="text-xs text-muted mt-0.5">
              Accedé a la biblioteca completa con Pro — canciones de 3 minutos, todas las ondas y géneros
            </p>
          </div>
          <a
            href="/checkout?plan=monthly"
            className="flex-shrink-0 bg-accent text-bg text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Ver Pro →
          </a>
        </div>

        <p className="text-xs text-muted text-center mt-4">
          🎧 Requiere auriculares estéreo para el efecto binaural completo
        </p>
      </div>
    </section>
  )
}