'use client'

import { useState, useRef, useEffect } from 'react'

const FREE_TRACKS = [
  {
    id: 'delta-preview',
    title: 'Sueño profundo',
    wave: 'Delta',
    freq: '0.5–4 Hz',
    color: '#c4a8f0',
    bg: 'rgba(196,168,240,0.08)',
    emoji: '🌙',
    // Reemplazá estas URLs con tus audios reales en Cloudflare R2
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'theta-preview',
    title: 'Calma profunda',
    wave: 'Theta',
    freq: '4–8 Hz',
    color: '#a8f0c8',
    bg: 'rgba(168,240,200,0.08)',
    emoji: '🧘',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'alpha-preview',
    title: 'Relajación activa',
    wave: 'Alpha',
    freq: '8–13 Hz',
    color: '#7eb8f7',
    bg: 'rgba(126,184,247,0.08)',
    emoji: '🌊',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
]

const PREVIEW_SECONDS = 20

export default function DashboardPlayer() {
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
    const s = PREVIEW_SECONDS - secs
    return `0:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col gap-3">
      {FREE_TRACKS.map((track) => {
        const isPlaying = playingId === track.id
        const prog = progress[track.id] ?? 0
        const elapsedSecs = elapsed[track.id] ?? 0

        return (
          <div
            key={track.id}
            className="border border-white/[0.07] rounded-2xl p-5 transition-all"
            style={{ background: isPlaying ? track.bg : 'transparent' }}
          >
            <div className="flex items-center gap-4">
              {/* Emoji */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: track.bg }}
              >
                {track.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{track.title}</p>
                <p className="text-xs mt-0.5" style={{ color: track.color }}>
                  {track.wave} · {track.freq}
                </p>

                {/* Progress bar */}
                <div className="mt-2.5 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{ width: `${prog}%`, background: track.color }}
                  />
                </div>
              </div>

              {/* Timer */}
              <span className="text-xs text-muted font-mono w-10 text-right flex-shrink-0">
                {isPlaying ? formatTime(elapsedSecs) : `0:${PREVIEW_SECONDS}`}
              </span>

              {/* Play/Pause */}
              <button
                onClick={() => handlePlay(track.id, track.url)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                style={{
                  background: isPlaying ? track.color : `${track.color}20`,
                  border: `1px solid ${track.color}40`,
                }}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1" y="1" width="4" height="10" rx="1" fill={isPlaying ? '#080c10' : track.color} />
                    <rect x="7" y="1" width="4" height="10" rx="1" fill={isPlaying ? '#080c10' : track.color} />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 1L11 6L2 11V1Z" fill={track.color} />
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