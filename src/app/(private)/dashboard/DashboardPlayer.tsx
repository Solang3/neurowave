'use client'

import { useState, useRef, useEffect } from 'react'

const FREE_TRACKS = [
  {
    id: 'delta-nature',
    title: 'Sueño profundo',
    wave: 'Delta',
    freq: '0.5–4 Hz',
    color: '#c4a8f0',
    bg: 'rgba(196,168,240,0.08)',
    emoji: '🌙',
    genre: 'Nature',
    path: 'delta/nature/Delta-nature-001-binaural.mp3',
  },
  {
    id: 'theta-ambient',
    title: 'Calma profunda',
    wave: 'Theta',
    freq: '4–8 Hz',
    color: '#a8f0c8',
    bg: 'rgba(168,240,200,0.08)',
    emoji: '🧘',
    genre: 'Ambient',
    path: 'theta/ambient/Theta-ambient-001-binaural.mp3',
  },
  {
    id: 'alpha-classic',
    title: 'Relajación activa',
    wave: 'Alpha',
    freq: '8–13 Hz',
    color: '#7eb8f7',
    bg: 'rgba(126,184,247,0.08)',
    emoji: '🌊',
    genre: 'Classic',
    path: 'alpha/classic/Alpha-classic-001-binaural.mp3',
  },
]

const PREVIEW_SECONDS = 20

export default function DashboardPlayer() {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [elapsed, setElapsed] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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
      // Pedir URL firmada al servidor
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
    <div className="flex flex-col gap-3">
      {FREE_TRACKS.map((track) => {
        const isPlaying = playingId === track.id
        const isLoading = loading === track.id
        const prog = progress[track.id] ?? 0
        const elapsedSecs = elapsed[track.id] ?? 0

        return (
          <div
            key={track.id}
            className="border border-white/[0.07] rounded-2xl p-5 transition-all"
            style={{ background: isPlaying ? track.bg : 'transparent' }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: track.bg }}
              >
                {track.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{track.title}</p>
                  <span className="text-[10px] text-muted border border-white/[0.07] rounded-full px-2 py-0.5">
                    {track.genre}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: track.color }}>
                  {track.wave} · {track.freq}
                </p>

                <div className="mt-2.5 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{ width: `${prog}%`, background: track.color }}
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
                  background: isPlaying ? track.color : `${track.color}20`,
                  border: `1px solid ${track.color}40`,
                }}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isLoading ? (
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke={track.color} strokeWidth="1.5" strokeDasharray="8 8"/>
                  </svg>
                ) : isPlaying ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1" y="1" width="4" height="10" rx="1" fill="#080c10"/>
                    <rect x="7" y="1" width="4" height="10" rx="1" fill="#080c10"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 1L11 6L2 11V1Z" fill={track.color}/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        )
      })}

      <p className="text-xs text-muted text-center mt-1">
        🎧 Requiere auriculares estéreo para el efecto binaural completo
      </p>
    </div>
  )
}