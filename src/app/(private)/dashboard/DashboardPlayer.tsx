'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const R2_PUBLIC = 'https://pub-78c976d8802a412ca89533a0734f5054.r2.dev'

const WAVE_GROUPS = [
  {
    wave: 'Delta', freq: '0.5–4 Hz', binauralHz: 2,
    color: '#c4a8f0', bg: 'rgba(196,168,240,0.08)', emoji: '🌙', useCase: 'Sueño profundo',
    tracks: [
      { id: 'delta-nature', genre: 'Nature', emoji: '🌿', path: 'delta/nature/Delta-nature-001-binaural.mp3' },
      { id: 'delta-classic', genre: 'Classic', emoji: '🎻', path: 'delta/classic/Delta-classic-001-binaural.mp3' },
      { id: 'delta-ambient', genre: 'Ambient', emoji: '🌌', path: 'delta/ambient/Delta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Theta', freq: '4–8 Hz', binauralHz: 6,
    color: '#a8f0c8', bg: 'rgba(168,240,200,0.08)', emoji: '🧘', useCase: 'Meditación y ansiedad',
    tracks: [
      { id: 'theta-nature', genre: 'Nature', emoji: '🌿', path: 'theta/nature/Theta-nature-001-binaural.mp3' },
      { id: 'theta-classic', genre: 'Classic', emoji: '🎻', path: 'theta/classic/Theta-classic-001-binaural.mp3' },
      { id: 'theta-ambient', genre: 'Ambient', emoji: '🌌', path: 'theta/ambient/Theta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Alpha', freq: '8–13 Hz', binauralHz: 10,
    color: '#7eb8f7', bg: 'rgba(126,184,247,0.08)', emoji: '🌊', useCase: 'Relajación activa',
    tracks: [
      { id: 'alpha-nature', genre: 'Nature', emoji: '🌿', path: 'alpha/nature/Alpha-nature-001-binaural.mp3' },
      { id: 'alpha-classic', genre: 'Classic', emoji: '🎻', path: 'alpha/classic/Alpha-classic-001-binaural.mp3' },
      { id: 'alpha-ambient', genre: 'Ambient', emoji: '🌌', path: 'alpha/ambient/Alpha-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Beta', freq: '13–30 Hz', binauralHz: 15,
    color: '#f0e8a8', bg: 'rgba(240,232,168,0.08)', emoji: '⚡', useCase: 'Foco y trabajo',
    tracks: [
      { id: 'beta-nature', genre: 'Nature', emoji: '🌿', path: 'beta/nature/Beta-nature-001-binaural.mp3' },
      { id: 'beta-classic', genre: 'Classic', emoji: '🎻', path: 'beta/classic/Beta-classic-001-binaural.mp3' },
      { id: 'beta-ambient', genre: 'Ambient', emoji: '🌌', path: 'beta/ambient/Beta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Gamma', freq: '30–100 Hz', binauralHz: 40,
    color: '#f0a8a8', bg: 'rgba(240,168,168,0.08)', emoji: '🧠', useCase: 'Alto rendimiento',
    tracks: [
      { id: 'gamma-nature', genre: 'Nature', emoji: '🌿', path: 'gamma/nature/Gamma-nature-001-binaural.mp3' },
      { id: 'gamma-classic', genre: 'Classic', emoji: '🎻', path: 'gamma/classic/Gamma-classic-001-binaural.mp3' },
      { id: 'gamma-ambient', genre: 'Ambient', emoji: '🌌', path: 'gamma/ambient/Gamma-ambient-001-binaural.mp3' },
    ],
  },
]

type Track = { id: string; genre: string; emoji: string; path: string }
type Group = typeof WAVE_GROUPS[0]

interface QueueItem { track: Track; group: Group }

export default function DashboardPlayer({ isPro = false }: { isPro?: boolean }) {
  const [openWave, setOpenWave] = useState('Delta')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loop, setLoop] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const PREVIEW_SECONDS = isPro ? Infinity : 20
  const currentItem = queue[queueIndex] ?? null

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const startTimer = () => {
    stopTimer()
    intervalRef.current = setInterval(() => {
      const audio = audioRef.current
      if (!audio) return
      setElapsed(audio.currentTime)
      setDuration(audio.duration || 0)

      // Límite free
      if (!isPro && audio.currentTime >= PREVIEW_SECONDS) {
        audio.pause()
        setIsPlaying(false)
        stopTimer()
        handleNext(true)
      }
    }, 250)
  }

  const playTrack = useCallback(async (item: QueueItem) => {
    audioRef.current?.pause()
    stopTimer()
    setLoading(true)
    setElapsed(0)
    setDuration(0)

    try {
      let url: string
      if (isPro) {
        const res = await fetch(`/api/audio?path=${encodeURIComponent(item.track.path)}`)
        const data = await res.json()
        url = data.url
      } else {
        url = `${R2_PUBLIC}/${item.track.path}`
      }

      const audio = new Audio(url)
      audio.volume = 0.8
      audioRef.current = audio

      audio.onended = () => handleNext(false)
      audio.onloadedmetadata = () => setDuration(audio.duration)

      await audio.play()
      setIsPlaying(true)
      startTimer()
    } catch {
      console.error('Error reproduciendo')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPro, loop, shuffle, queue])

  function handleNext(auto: boolean) {
    if (queue.length === 0) return
    let next: number

    if (shuffle) {
      next = Math.floor(Math.random() * queue.length)
    } else {
      next = queueIndex + 1
    }

    if (next >= queue.length) {
      if (loop) {
        next = 0
      } else {
        setIsPlaying(false)
        stopTimer()
        return
      }
    }

    setQueueIndex(next)
    playTrack(queue[next])
  }

  function handlePrev() {
    if (queue.length === 0) return
    const prev = queueIndex > 0 ? queueIndex - 1 : loop ? queue.length - 1 : 0
    setQueueIndex(prev)
    playTrack(queue[prev])
  }

  function handlePlayPause() {
    if (!currentItem) return
    const audio = audioRef.current
    if (!audio) {
      playTrack(currentItem)
      return
    }
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      stopTimer()
    } else {
      audio.play()
      setIsPlaying(true)
      startTimer()
    }
  }

  function toggleSelect(track: Track, group: Group) {
    const newSelected = new Set(selected)
    if (newSelected.has(track.id)) {
      newSelected.delete(track.id)
      setQueue((q) => q.filter((i) => i.track.id !== track.id))
    } else {
      newSelected.add(track.id)
      setQueue((q) => [...q, { track, group }])
    }
    setSelected(newSelected)
  }

  function playAll(group: Group) {
    const items = group.tracks.map((t) => ({ track: t, group }))
    setQueue(items)
    setSelected(new Set(group.tracks.map((t) => t.id)))
    setQueueIndex(0)
    playTrack(items[0])
  }

  function removeFromQueue(idx: number) {
    const item = queue[idx]
    const newQueue = queue.filter((_, i) => i !== idx)
    setQueue(newQueue)
    const newSelected = new Set(selected)
    newSelected.delete(item.track.id)
    setSelected(newSelected)
    if (idx === queueIndex && isPlaying) {
      if (newQueue.length > 0) {
        const newIdx = Math.min(idx, newQueue.length - 1)
        setQueueIndex(newIdx)
        playTrack(newQueue[newIdx])
      } else {
        audioRef.current?.pause()
        setIsPlaying(false)
      }
    }
  }

  function formatTime(secs: number) {
    if (!isFinite(secs)) return '—'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const currentGroup = WAVE_GROUPS.find((g) => g.wave === openWave)!
  const progressPct = duration > 0 ? (elapsed / Math.min(duration, isPro ? Infinity : PREVIEW_SECONDS)) * 100 : 0

  return (
    <div className="flex flex-col gap-6">

      {/* Mini player fijo — solo si hay cola */}
      {currentItem && (
        <div
          className="rounded-2xl p-4 border"
          style={{ background: `${currentItem.group.color}10`, borderColor: `${currentItem.group.color}30` }}
        >
          {/* Info track actual */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{currentItem.track.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {currentItem.group.wave} · {currentItem.track.genre}
              </p>
              <p className="text-xs mt-0.5" style={{ color: currentItem.group.color }}>
                {currentItem.group.binauralHz} Hz binaural {isPro ? '· completa' : '· muestra 20s'}
              </p>
            </div>
            <span className="text-xs text-muted font-mono">
              {formatTime(elapsed)} / {isPro ? formatTime(duration) : '0:20'}
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${Math.min(progressPct, 100)}%`, background: currentItem.group.color }}
            />
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Shuffle */}
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${shuffle ? 'text-white' : 'text-muted'}`}
                style={{ background: shuffle ? `${currentItem.group.color}30` : 'transparent' }}
                title="Aleatorio"
              >
                ⇄
              </button>
              {/* Prev */}
              <button onClick={handlePrev} className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-white transition-all">
                ⏮
              </button>
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                disabled={loading}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: currentItem.group.color }}
              >
                {loading ? (
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="#080c10" strokeWidth="1.5" strokeDasharray="8 8"/>
                  </svg>
                ) : isPlaying ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1" y="1" width="4" height="10" rx="1" fill="#080c10"/>
                    <rect x="7" y="1" width="4" height="10" rx="1" fill="#080c10"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 1L11 6L2 11V1Z" fill="#080c10"/>
                  </svg>
                )}
              </button>
              {/* Next */}
              <button onClick={() => handleNext(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-white transition-all">
                ⏭
              </button>
              {/* Loop */}
              <button
                onClick={() => setLoop(!loop)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${loop ? 'text-white' : 'text-muted'}`}
                style={{ background: loop ? `${currentItem.group.color}30` : 'transparent' }}
                title="Repetir"
              >
                ↻
              </button>
            </div>

            <span className="text-xs text-muted">
              {queueIndex + 1} / {queue.length}
            </span>
          </div>
        </div>
      )}

      {/* Cola actual */}
      {queue.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase text-muted mb-3">Cola de reproducción</p>
          <div className="flex flex-col gap-2">
            {queue.map((item, idx) => (
              <div
                key={`${item.track.id}-${idx}`}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
                  idx === queueIndex && isPlaying
                    ? 'border-opacity-50'
                    : 'border-white/[0.05] bg-surface/50'
                }`}
                style={idx === queueIndex && isPlaying ? {
                  background: `${item.group.color}10`,
                  borderColor: `${item.group.color}40`,
                } : {}}
              >
                <span className="text-sm">{item.track.emoji}</span>
                <span className="text-sm flex-1">
                  {item.group.wave} · {item.track.genre}
                </span>
                {idx === queueIndex && isPlaying && (
                  <span className="text-xs" style={{ color: item.group.color }}>▶ ahora</span>
                )}
                <button
                  onClick={() => removeFromQueue(idx)}
                  className="text-muted hover:text-white transition-colors text-sm ml-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs de ondas */}
      <div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
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

        {/* Header de onda con "Reproducir todo" */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted">{currentGroup.useCase} · {currentGroup.binauralHz} Hz binaural</p>
          {isPro && (
            <button
              onClick={() => playAll(currentGroup)}
              className="text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-90"
              style={{ background: `${currentGroup.color}20`, color: currentGroup.color, border: `1px solid ${currentGroup.color}30` }}
            >
              ▶ Reproducir todo
            </button>
          )}
        </div>

        {/* Tracks */}
        <div className="flex flex-col gap-3">
          {currentGroup.tracks.map((track) => {
            const isSelected = selected.has(track.id)
            const isCurrent = currentItem?.track.id === track.id

            return (
              <div
                key={track.id}
                className="border rounded-2xl p-5 transition-all"
                style={{
                  background: isCurrent ? currentGroup.bg : isSelected ? `${currentGroup.color}08` : 'transparent',
                  borderColor: isSelected ? `${currentGroup.color}40` : 'rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleSelect(track, currentGroup)}
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: isSelected ? currentGroup.color : 'transparent',
                      border: `1.5px solid ${isSelected ? currentGroup.color : 'rgba(255,255,255,0.2)'}`,
                    }}
                  >
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#080c10" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </button>

                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: currentGroup.bg }}>
                    {track.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{currentGroup.wave} · {track.genre}</p>
                    <p className="text-xs mt-0.5" style={{ color: currentGroup.color }}>
                      {currentGroup.binauralHz} Hz binaural · {isPro ? 'completa' : 'muestra 20s'}
                    </p>
                  </div>

                  {/* Play directo */}
                  <button
                    onClick={() => {
                      if (!isSelected) toggleSelect(track, currentGroup)
                      const idx = queue.findIndex((i) => i.track.id === track.id)
                      if (idx >= 0) {
                        setQueueIndex(idx)
                        playTrack(queue[idx])
                      } else {
                        const newItem = { track, group: currentGroup }
                        const newQueue = [...queue, newItem]
                        setQueue(newQueue)
                        const newSelected = new Set(selected)
                        newSelected.add(track.id)
                        setSelected(newSelected)
                        setQueueIndex(newQueue.length - 1)
                        playTrack(newItem)
                      }
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                    style={{
                      background: isCurrent && isPlaying ? currentGroup.color : `${currentGroup.color}20`,
                      border: `1px solid ${currentGroup.color}40`,
                    }}
                  >
                    {isCurrent && isPlaying ? (
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
      </div>

      <p className="text-xs text-muted text-center">
        🎧 Requiere auriculares estéreo para el efecto binaural completo
      </p>
    </div>
  )
}