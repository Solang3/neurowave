'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAudio } from '@/context/AudioContext'

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
  const { playQueue, currentTrack, isPlaying, queueIndex, queue } = useAudio()

  function buildTracks(startIdx = 0) {
    return playlist.tracks.map((track, idx) => ({
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
  }

  function handlePlayAll() {
    playQueue(buildTracks(), 0)
  }

  function handlePlayTrack(idx: number) {
    // Si ya está sonando este track, no hacemos nada (el MiniPlayer tiene pause)
    const tracks = buildTracks()
    const isThisPlaylist = queue.length > 0 && queue[0]?.id?.startsWith(playlist.id)
    if (isThisPlaylist && queueIndex === idx && isPlaying) return
    playQueue(tracks, idx)
  }

  // Detectar si este protocolo está activo en el player
  const isThisPlaylistActive = queue.length > 0 && queue[0]?.id?.startsWith(playlist.id)

  const totalMinutes = playlist.tracks.length * 10
  const firstColor = playlist.tracks[0]?.color || '#a8f0c8'

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
              {isThisPlaylistActive && isPlaying && (
                <span style={{ color: firstColor }}>▶ reproduciendo</span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); handlePlayAll() }}
          className="text-xs px-4 py-2 rounded-full font-medium transition-all hover:opacity-90 flex-shrink-0"
          style={{
            background: `${firstColor}20`,
            color: firstColor,
            border: `1px solid ${firstColor}30`
          }}
        >
          ▶ Reproducir
        </button>
        <span className="text-muted mt-1">{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Expandible */}
      {isExpanded && (
        <div className="border-t border-white/[0.07]">
          {playlist.description && (
            <div className="px-6 py-4 bg-white/[0.02]">
              <p className="text-sm text-white/70 leading-relaxed">{playlist.description}</p>
            </div>
          )}

          <div className="p-4 flex flex-col gap-2">
            {playlist.tracks.map((track, idx) => {
              const trackColor = track.color || '#a8f0c8'
              const isActiveTrack = isThisPlaylistActive && queueIndex === idx
              const isActiveAndPlaying = isActiveTrack && isPlaying

              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-xl border transition-all"
                  style={{
                    background: isActiveTrack ? `${trackColor}10` : 'transparent',
                    borderColor: isActiveTrack ? `${trackColor}30` : 'rgba(255,255,255,0.05)',
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
                  </div>
                  {isActiveAndPlaying && (
                    <span className="text-xs" style={{ color: trackColor }}>▶ ahora</span>
                  )}
                  <button
                    onClick={() => handlePlayTrack(idx)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                    style={{
                      background: isActiveTrack ? trackColor : `${trackColor}20`,
                      border: `1px solid ${trackColor}40`,
                    }}
                  >
                    {isActiveAndPlaying ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#080c10">
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill={isActiveTrack ? '#080c10' : trackColor}>
                        <path d="M5 3l14 9-14 9V3z"/>
                      </svg>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {!isLoggedIn && (
            <div className="px-6 pb-6">
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <p className="text-xs text-muted">
                  Escuchás 30 segundos por track. Registrate gratis para el protocolo completo.
                </p>
                <Link href="/registro" className="flex-shrink-0 bg-accent text-bg text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
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