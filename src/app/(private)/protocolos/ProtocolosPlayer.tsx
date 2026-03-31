'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAudio } from '@/context/AudioContext'

const R2_PUBLIC = 'https://pub-78c976d8802a412ca89533a0734f5054.r2.dev'
const PREVIEW_SECONDS = 30

interface Track {
  title?: string
  genre: string
  emoji: string
  path: string
  wave?: string
  binauralHz?: number
  color?: string
}

interface Playlist {
  id: string
  title: string
  description: string
  objective: string
  emoji: string
  tracks: Track[]
}

export default function ProtocolosPlayer({ playlist, isLoggedIn }: { playlist: Playlist; isLoggedIn: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [playingIdx, setPlayingIdx] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { playQueue, currentTrack, isPlaying, togglePlay } = useAudio()

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  async function handlePlay(idx: number, track: Track) {
    if (playingIdx === idx) {
      audioRef.current?.pause()
      setPlayingIdx(null)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    audioRef.current?.pause()
    if (intervalRef.current) clearInterval(intervalRef.current)

    let url: string
    if (isLoggedIn) {
      const res = await fetch(`/api/audio?path=${encodeURIComponent(track.path)}`)
      const data = await res.json()
      url = data.url
    } else {
      url = `${R2_PUBLIC}/${track.path}`
    }

    const audio = new Audio(url)
    audio.volume = 0.8
    audioRef.current = audio
    audio.play().catch(() => {})
    setPlayingIdx(idx)
    setProgress(0)
    setElapsed(0)

    let secs = 0
    intervalRef.current = setInterval(() => {
      secs += 0.25
      setElapsed(Math.floor(secs))
      const limit = isLoggedIn ? (audio.duration || 999) : PREVIEW_SECONDS
      setProgress((secs / limit) * 100)
      if (!isLoggedIn && secs >= PREVIEW_SECONDS) {
        audio.pause()
        setPlayingIdx(null)
        setProgress(0)
        setElapsed(0)
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 250)
  }

  function handlePlayAll() {
    const tracks = playlist.tracks.map((track, idx) => ({
      id: `${playlist.id}-${idx}`,
      title: track.title || `${track.wave} · ${track.genre}`,
      wave: track.wave || '',
      genre: track.genre,
      emoji: track.emoji,
      path: track.path,
      color: track.color || '#a8f0c8',
      binauralHz: track.binauralHz,
      playlistTitle: playlist.title,
    }))
    playQueue(tracks, 0)
  }

  const totalMinutes = playlist.tracks.length * 10

  return (
    <div className="bg-surface border border-white/[0.07] rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start gap-4 flex-1">
          <span className="text-4xl">{playlist.emoji}</span>
          <div className="flex-1">
            <h2 className="font-serif text-2xl mb-1">{playlist.title}</h2>
            <p className="text-sm text-muted mb-2">{playlist.objective}</p>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>🎵 {playlist.tracks.length} tracks</span>
              <span>⏱ ~{totalMinutes} minutos</span>
            </div>
          </div>
        </div>
        <button
            onClick={(e) => { e.stopPropagation(); handlePlayAll() }}
            className="text-xs px-4 py-2 rounded-full font-medium transition-all hover:opacity-90 flex-shrink-0"
            style={{
              background: `${playlist.tracks[0]?.color || '#a8f0c8'}20`,
              color: playlist.tracks[0]?.color || '#a8f0c8',
              border: `1px solid ${playlist.tracks[0]?.color || '#a8f0c8'}30`
            }}
          >
            ▶ Reproducir
        </button>
        <span className="text-muted mt-1">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Expandible */}
      {isExpanded && (
        <div className="border-t border-white/[0.07]">
          {/* Descripción */}
          {playlist.description && (
            <div className="px-6 py-4 bg-white/[0.02]">
              <p className="text-sm text-white/70 leading-relaxed">{playlist.description}</p>
            </div>
          )}

          {/* Tracks */}
          <div className="p-4 flex flex-col gap-2">
            {playlist.tracks.map((track, idx) => {
              const isPlaying = playingIdx === idx
              const trackColor = track.color || '#a8f0c8'

              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-xl border transition-all"
                  style={{
                    background: isPlaying ? `${trackColor}10` : 'transparent',
                    borderColor: isPlaying ? `${trackColor}30` : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <span className="text-xs text-muted w-5 text-center">{idx + 1}</span>
                  <span className="text-lg">{track.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{track.title || `${track.wave} · ${track.genre}`}</p>
                    {track.binauralHz && (
                      <p className="text-xs mt-0.5" style={{ color: trackColor }}>
                        {track.binauralHz} Hz binaural · {isLoggedIn ? 'completa' : `muestra ${PREVIEW_SECONDS}s`}
                      </p>
                    )}
                    {isPlaying && (
                      <div className="mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-none"
                          style={{ width: `${Math.min(progress, 100)}%`, background: trackColor }}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handlePlay(idx, track)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                    style={{
                      background: isPlaying ? trackColor : `${trackColor}20`,
                      border: `1px solid ${trackColor}40`,
                    }}
                  >
                    {isPlaying ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#080c10">
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill={trackColor}>
                        <path d="M5 3l14 9-14 9V3z"/>
                      </svg>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* CTA si no está logueado */}
          {!isLoggedIn && (
            <div className="px-6 pb-6">
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <p className="text-xs text-muted">
                  Escuchás 30 segundos por track. Registrate gratis para el protocolo completo.
                </p>
                <Link
                  href="/registro"
                  className="flex-shrink-0 bg-accent text-bg text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                >
                  Registrate gratis
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}