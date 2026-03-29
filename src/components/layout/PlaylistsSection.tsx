'use client'

import { useState, useRef, useEffect } from 'react'

const playlists = [
  {
    emoji: '🌙', need: 'Para dormir', title: 'Sueño profundo', wave: 'Delta',
    freq: '0.5–4 Hz', tracks: 8, duration: 60, isPro: false,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    emoji: '🧘', need: 'Para la ansiedad', title: 'Calma profunda', wave: 'Theta',
    freq: '4–8 Hz', tracks: 6, duration: 45, isPro: false,
    previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    emoji: '📚', need: 'Para estudiar', title: 'Foco sin estrés', wave: 'Alpha',
    freq: '8–13 Hz', tracks: 10, duration: 90, isPro: true,
    previewUrl: null,
  },
  {
    emoji: '⚡', need: 'Para trabajar', title: 'Deep work', wave: 'Beta',
    freq: '13–30 Hz', tracks: 8, duration: 80, isPro: true,
    previewUrl: null,
  },
  {
    emoji: '🌿', need: 'Para meditar', title: 'Meditación guiada', wave: 'Theta',
    freq: '4–8 Hz', tracks: 5, duration: 50, isPro: true,
    previewUrl: null,
  },
  {
    emoji: '🧠', need: 'Para aprender', title: 'Máximo rendimiento', wave: 'Gamma',
    freq: '30–100 Hz', tracks: 6, duration: 55, isPro: true,
    previewUrl: null,
  },
]

const waveColors: Record<string, string> = {
  Delta: '#c4a8f0', Theta: '#a8f0c8', Alpha: '#7eb8f7',
  Beta: '#f0e8a8', Gamma: '#f0a8a8',
}
const waveIconBg: Record<string, string> = {
  Delta: 'rgba(196,168,240,0.1)', Theta: 'rgba(168,240,200,0.1)',
  Alpha: 'rgba(126,184,247,0.1)', Beta: 'rgba(240,232,168,0.1)',
  Gamma: 'rgba(240,168,168,0.1)',
}

function PlayButton({ url, isPlaying, onPlay, color }: {
  url: string; isPlaying: boolean; onPlay: () => void; color: string
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onPlay() }}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
      style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      aria-label={isPlaying ? 'Pausar' : 'Reproducir muestra'}
    >
      {isPlaying ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="2" width="4" height="10" rx="1" fill={color} />
          <rect x="8" y="2" width="4" height="10" rx="1" fill={color} />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 2L12 7L3 12V2Z" fill={color} />
        </svg>
      )}
    </button>
  )
}

export default function PlaylistsSection() {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const PREVIEW_SECONDS = 30

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function handlePlay(id: string, url: string) {
    if (playingId === id) {
      audioRef.current?.pause()
      setPlayingId(null)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    audioRef.current?.pause()
    if (intervalRef.current) clearInterval(intervalRef.current)
    const audio = new Audio(url)
    audio.volume = 0.7
    audioRef.current = audio
    audio.play().catch(() => {})
    setPlayingId(id)
    setProgress((p) => ({ ...p, [id]: 0 }))
    let elapsed = 0
    intervalRef.current = setInterval(() => {
      elapsed += 0.5
      setProgress((p) => ({ ...p, [id]: (elapsed / PREVIEW_SECONDS) * 100 }))
      if (elapsed >= PREVIEW_SECONDS) {
        audio.pause()
        setPlayingId(null)
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 500)
  }

  return (
    <section id="playlists" className="bg-surface border-t border-white/[0.07] py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 md:px-12">
        <p className="text-xs tracking-widest uppercase text-accent mb-4">Playlists curadas</p>
        <h2 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight mb-4">
          Una lista para<br />
          <em className="text-accent">cada necesidad</em>
        </h2>
        <p className="text-muted max-w-lg mb-10">
          Seleccionadas por el Dr. González a partir de la evidencia disponible y su experiencia personal. No algoritmos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {playlists.map((p) => {
            const id = p.title
            const color = waveColors[p.wave]
            const isPlaying = playingId === id
            const prog = progress[id] ?? 0
            return (
              <div key={id} className="bg-bg border border-white/[0.07] hover:border-white/[0.12] transition-all rounded-2xl p-5 flex gap-4 items-center md:flex-col md:items-start md:gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: waveIconBg[p.wave] }}>
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0 md:w-full">
                  <p className="text-xs text-muted">{p.need}</p>
                  <p className="font-medium text-sm mt-0.5 truncate">{p.title} · {p.wave}</p>
                  <p className="text-xs mt-0.5" style={{ color }}>{p.freq} · {p.tracks} tracks · {p.duration} min</p>
                  {isPlaying && (
                    <div className="mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${prog}%`, background: color }} />
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    {p.isPro ? (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-white/4 border border-white/[0.07] rounded-full px-2.5 py-1 text-muted">
                        🔒 Pro
                      </span>
                    ) : (
                      <span className="text-xs text-accent">
                        {isPlaying ? 'Reproduciendo muestra...' : 'Gratis · muestra 30s'}
                      </span>
                    )}
                    {!p.isPro && p.previewUrl && (
                      <PlayButton url={p.previewUrl} isPlaying={isPlaying} onPlay={() => handlePlay(id, p.previewUrl!)} color={color} />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-muted mt-6 text-center">
          Muestras temporales · Los tracks definitivos de ondas binaurales estarán disponibles próximamente
        </p>
      </div>
    </section>
  )
}