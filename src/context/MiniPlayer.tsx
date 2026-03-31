'use client'

import { useAudio } from './AudioContext'
import { useState } from 'react'

export default function MiniPlayer() {
  const { currentTrack, isPlaying, elapsed, duration, queueIndex, queue, togglePlay, next, prev, seek, stop } = useAudio()
  const [expanded, setExpanded] = useState(false)

  if (!currentTrack) return null

  const progress = duration > 0 ? (elapsed / duration) * 100 : 0

  function formatTime(secs: number) {
    if (!isFinite(secs) || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 transition-all duration-300"
      style={{ width: expanded ? '320px' : '280px' }}
    >
      <div
        className="rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          background: `color-mix(in srgb, #0d1117 85%, ${currentTrack.color})`,
          borderColor: `${currentTrack.color}30`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${currentTrack.color}15`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <p className="text-xs text-muted truncate flex-1">
            {currentTrack.playlistTitle || 'Reproduciendo'}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-muted hover:text-white text-xs px-1 transition-colors"
            >
              {expanded ? '▼' : '▲'}
            </button>
            <button
              onClick={stop}
              className="text-muted hover:text-white text-xs px-1 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Track info */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentTrack.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{currentTrack.title}</p>
              <p className="text-xs mt-0.5" style={{ color: currentTrack.color }}>
                {currentTrack.binauralHz} Hz binaural · {currentTrack.wave}
              </p>
            </div>
            <span className="text-xs text-muted font-mono flex-shrink-0">
              {formatTime(elapsed)}
            </span>
          </div>
        </div>

        {/* Barra de progreso clickeable */}
        <div
          className="mx-4 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer mb-3"
          onClick={(e) => {
            if (!duration) return
            const rect = e.currentTarget.getBoundingClientRect()
            const percent = (e.clientX - rect.left) / rect.width
            seek(percent * duration)
          }}
        >
          <div
            className="h-full rounded-full transition-none"
            style={{ width: `${Math.min(progress, 100)}%`, background: currentTrack.color }}
          />
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between px-4 pb-4">
          <span className="text-xs text-muted">{queueIndex + 1} / {queue.length}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={queueIndex === 0}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ background: currentTrack.color }}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#080c10">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#080c10">
                  <path d="M5 3l14 9-14 9V3z"/>
                </svg>
              )}
            </button>

            <button
              onClick={next}
              disabled={queueIndex >= queue.length - 1}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M6 18l8.5-6L6 6v12zm2.5-6l5.5-4v8l-5.5-4zM16 6h2v12h-2z"/>
              </svg>
            </button>
          </div>
          <span className="text-xs text-muted">{formatTime(duration)}</span>
        </div>

        {/* Cola expandida */}
        {expanded && queue.length > 1 && (
          <div className="border-t border-white/[0.07] px-4 py-3 max-h-40 overflow-y-auto">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">Cola</p>
            {queue.map((track, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 py-1.5 text-sm"
                style={{ color: idx === queueIndex ? currentTrack.color : '#6b7580' }}
              >
                <span className="text-xs w-4">{idx + 1}</span>
                <span>{track.emoji}</span>
                <span className="truncate flex-1">{track.title}</span>
                {idx === queueIndex && isPlaying && <span className="text-xs">▶</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}