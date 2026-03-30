'use client'

import { useState, useRef, useEffect } from 'react'

const WAVE_GROUPS = [
  {
    wave: 'Delta',
    freq: '0.5–4 Hz',
    binauralHz: 2,
    color: '#c4a8f0',
    bg: 'rgba(196,168,240,0.08)',
    emoji: '🌙',
    useCase: 'Sueño profundo',
    tracks: [
      { id: 'delta-nature', genre: 'Nature', emoji: '🌿', path: 'delta/nature/Delta-nature-001-binaural.mp3' },
      { id: 'delta-classic', genre: 'Classic', emoji: '🎻', path: 'delta/classic/Delta-classic-001-binaural.mp3' },
      { id: 'delta-ambient', genre: 'Ambient', emoji: '🌌', path: 'delta/ambient/Delta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Theta',
    freq: '4–8 Hz',
    binauralHz: 6,
    color: '#a8f0c8',
    bg: 'rgba(168,240,200,0.08)',
    emoji: '🧘',
    useCase: 'Meditación y ansiedad',
    tracks: [
      { id: 'theta-nature', genre: 'Nature', emoji: '🌿', path: 'theta/nature/Theta-nature-001-binaural.mp3' },
      { id: 'theta-classic', genre: 'Classic', emoji: '🎻', path: 'theta/classic/Theta-classic-001-binaural.mp3' },
      { id: 'theta-ambient', genre: 'Ambient', emoji: '🌌', path: 'theta/ambient/Theta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Alpha',
    freq: '8–13 Hz',
    binauralHz: 10,
    color: '#7eb8f7',
    bg: 'rgba(126,184,247,0.08)',
    emoji: '🌊',
    useCase: 'Relajación activa',
    tracks: [
      { id: 'alpha-nature', genre: 'Nature', emoji: '🌿', path: 'alpha/nature/Alpha-nature-001-binaural.mp3' },
      { id: 'alpha-classic', genre: 'Classic', emoji: '🎻', path: 'alpha/classic/Alpha-classic-001-binaural.mp3' },
      { id: 'alpha-ambient', genre: 'Ambient', emoji: '🌌', path: 'alpha/ambient/Alpha-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Beta',
    freq: '13–30 Hz',
    binauralHz: 15,
    color: '#f0e8a8',
    bg: 'rgba(240,232,168,0.08)',
    emoji: '⚡',
    useCase: 'Foco y trabajo',
    tracks: [
      { id: 'beta-nature', genre: 'Nature', emoji: '🌿', path: 'beta/nature/Beta-nature-001-binaural.mp3' },
      { id: 'beta-classic', genre: 'Classic', emoji: '🎻', path: 'beta/classic/Beta-classic-001-binaural.mp3' },
      { id: 'beta-ambient', genre: 'Ambient', emoji: '🌌', path: 'beta/ambient/Beta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Gamma',
    freq: '30–100 Hz',
    binauralHz: 40,
    color: '#f0a8a8',
    bg: 'rgba(240,168,168,0.08)',
    emoji: '🧠',
    useCase: 'Alto rendimiento',
    tracks: [
      { id: 'gamma-nature', genre: 'Nature', emoji: '🌿', path: 'gamma/nature/Gamma-nature-001-binaural.mp3' },
      { id: 'gamma-classic', genre: 'Classic', emoji: '🎻', path: 'gamma/classic/Gamma-classic-001-binaural.mp3' },
      { id: 'gamma-ambient', genre: 'Ambient', emoji: '🌌', path: 'gamma/ambient/Gamma-ambient-001-binaural.mp3' },
    ],
  },
]

export default function DashboardPlayer({ isPro = false }: { isPro?: boolean }) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [elapsed, setElapsed] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [openWave, setOpenWave] = useState<string>('Delta')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const PREVIEW_SECONDS = isPro ? Infinity : 40
  
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  async function handlePlay(id: string, path: string) {
    if (playingId === id) {
      audioRef.current?.pause()
      setPlayingId(null)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    audioRef.current?.pause()
    if (intervalRef.current) clearInterval(intervalRef.current)
    setLoading(id)

    try {
      const res = await fetch(`/api/audio?path=${encodeURIComponent(path)}`)
      const { url, error } = await res.json()
      if (error || !url) throw new Error(error)

      const audio = new Audio(url)
      audio.volume = 0.8
      audioRef.current = audio
      await audio.play()
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
    } catch {
      console.error('Error reproduciendo audio')
    } finally {
      setLoading(null)
    }
  }

  function formatTime(secs: number) {
    const remaining = PREVIEW_SECONDS - secs
    return `0:${remaining.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs de ondas */}
      <div className="flex gap-2 overflow-x-auto pb-1">
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

      {/* Tracks de la onda seleccionada */}
      {WAVE_GROUPS.filter((g) => g.wave === openWave).map((group) => (
        <div key={group.wave} className="flex flex-col gap-3">
          <p className="text-xs text-muted">{group.useCase} · {group.freq}</p>
          {group.tracks.map((track) => {
            const isPlaying = playingId === track.id
            const isLoading = loading === track.id
            const prog = progress[track.id] ?? 0
            const elapsedSecs = elapsed[track.id] ?? 0

            return (
              <div
                key={track.id}
                className="border border-white/[0.07] rounded-2xl p-5 transition-all"
                style={{ background: isPlaying ? group.bg : 'transparent' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: group.bg }}
                  >
                    {track.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{group.wave} · {track.genre}</p>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: group.color }}>
                      {group.binauralHz} Hz binaural · {isPro ? 'completa' : 'muestra 40s'}
                    </p>
                    <div className="mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{ width: `${prog}%`, background: group.color }}
                      />
                    </div>
                  </div>

                  <span className="text-xs text-muted font-mono w-10 text-right flex-shrink-0">
                    {isPlaying ? formatTime(elapsedSecs) : `0:${PREVIEW_SECONDS}`}
                  </span>

                  <button
                    onClick={() => handlePlay(track.id, track.path)}
                    disabled={isLoading}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 flex-shrink-0 disabled:opacity-50"
                    style={{
                      background: isPlaying ? group.color : `${group.color}20`,
                      border: `1px solid ${group.color}40`,
                    }}
                  >
                    {isLoading ? (
                      <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5" stroke={group.color} strokeWidth="1.5" strokeDasharray="8 8"/>
                      </svg>
                    ) : isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect x="1" y="1" width="4" height="10" rx="1" fill="#080c10"/>
                        <rect x="7" y="1" width="4" height="10" rx="1" fill="#080c10"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 1L11 6L2 11V1Z" fill={group.color}/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ))}

      <p className="text-xs text-muted text-center mt-1">
        🎧 Requiere auriculares estéreo para el efecto binaural completo
      </p>
    </div>
  )
}