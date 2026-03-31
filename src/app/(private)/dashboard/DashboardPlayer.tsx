'use client'

import { useState, useRef, useEffect } from 'react'

const R2_PUBLIC = 'https://pub-78c976d8802a412ca89533a0734f5054.r2.dev'

const WAVE_GROUPS = [
  {
    wave: 'Delta', freq: '0.5–4 Hz', binauralHz: 2,
    color: '#c4a8f0', bg: 'rgba(196,168,240,0.08)', emoji: '🌙', useCase: 'Sueño profundo',
    tracks: [
      { id: 'delta-nature-001', genre: 'Nature', emoji: '🌿', title: 'Amanecer en el Bosque', path: 'delta/nature/Delta-nature-Amanecer en el Bosque-binaural.mp3' },
      { id: 'delta-nature-002', genre: 'Nature', emoji: '🌿', title: 'El Arroyo y el Viento', path: 'delta/nature/Delta-nature-El Arroyo y el Viento-binaural.mp3' },
      { id: 'delta-nature-003', genre: 'Nature', emoji: '🌿', title: 'La Tormenta se Acerca', path: 'delta/nature/Delta-nature-La Tormenta se Acerca-binaural.mp3' },
      { id: 'delta-nature-004', genre: 'Nature', emoji: '🌿', title: 'La Tormenta', path: 'delta/nature/Delta-nature-La Tormenta-binaural.mp3' },
      { id: 'delta-nature-005', genre: 'Nature', emoji: '🌿', title: 'La Tormenta se Va', path: 'delta/nature/Delta-nature-La Tormenta se Va-binaural.mp3' },
      { id: 'delta-nature-006', genre: 'Nature', emoji: '🌿', title: 'Regreso al Amanecer', path: 'delta/nature/Delta-nature-Regreso al Amanecer-binaural.mp3' },
    ],
  },
  {
    wave: 'Theta', freq: '4–8 Hz', binauralHz: 6,
    color: '#a8f0c8', bg: 'rgba(168,240,200,0.08)', emoji: '🧘', useCase: 'Meditación y ansiedad',
    tracks: [
      { id: 'theta-nature', genre: 'Nature', emoji: '🌿', title: 'Meditación en la Naturaleza', path: 'theta/nature/Theta-nature-001-binaural.mp3' },
      { id: 'theta-classic', genre: 'Classic', emoji: '🎻', title: 'Música Clásica', path: 'theta/classic/Theta-classic-001-binaural.mp3' },
      { id: 'theta-ambient', genre: 'Ambient', emoji: '🌌', title: 'Ambiente Cósmico', path: 'theta/ambient/Theta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Alpha', freq: '8–13 Hz', binauralHz: 10,
    color: '#7eb8f7', bg: 'rgba(126,184,247,0.08)', emoji: '🌊', useCase: 'Relajación activa',
    tracks: [
      { id: 'alpha-nature', genre: 'Nature', emoji: '🌿', title: 'Naturaleza en Calma', path: 'alpha/nature/Alpha-nature-001-binaural.mp3' },
      { id: 'alpha-classic', genre: 'Classic', emoji: '🎻', title: 'Música Clásica', path: 'alpha/classic/Alpha-classic-001-binaural.mp3' },
      { id: 'alpha-ambient', genre: 'Ambient', emoji: '🌌', title: 'Ambiente Cósmico', path: 'alpha/ambient/Alpha-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Beta', freq: '13–30 Hz', binauralHz: 15,
    color: '#f0e8a8', bg: 'rgba(240,232,168,0.08)', emoji: '⚡', useCase: 'Foco y trabajo',
    tracks: [
      { id: 'beta-nature', genre: 'Nature', emoji: '🌿', title: 'Naturaleza en Calma', path: 'beta/nature/Beta-nature-001-binaural.mp3' },
      { id: 'beta-classic', genre: 'Classic', emoji: '🎻', title: 'Música Clásica', path: 'beta/classic/Beta-classic-001-binaural.mp3' },
      { id: 'beta-ambient', genre: 'Ambient', emoji: '🌌', title: 'Ambiente Cósmico', path: 'beta/ambient/Beta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Gamma', freq: '30–100 Hz', binauralHz: 40,
    color: '#f0a8a8', bg: 'rgba(240,168,168,0.08)', emoji: '🧠', useCase: 'Alto rendimiento',
    tracks: [
      { id: 'gamma-nature', genre: 'Nature', emoji: '🌿', title: 'Naturaleza en Calma', path: 'gamma/nature/Gamma-nature-001-binaural.mp3' },
      { id: 'gamma-classic', genre: 'Classic', emoji: '🎻', title: 'Música Clásica', path: 'gamma/classic/Gamma-classic-001-binaural.mp3' },
      { id: 'gamma-ambient', genre: 'Ambient', emoji: '🌌', title: 'Ambiente Cósmico', path: 'gamma/ambient/Gamma-ambient-001-binaural.mp3' },
    ],
  },
]

type Track = { id: string; title: string; genre: string; emoji: string; path: string }
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

  // Refs para que los callbacks siempre vean valores actuales
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const loopRef = useRef(loop)
  const shuffleRef = useRef(shuffle)
  const queueRef = useRef(queue)
  const queueIndexRef = useRef(queueIndex)

  // Sincronizar refs con state
  useEffect(() => { loopRef.current = loop }, [loop])
  useEffect(() => { shuffleRef.current = shuffle }, [shuffle])
  useEffect(() => { queueRef.current = queue }, [queue])
  useEffect(() => { queueIndexRef.current = queueIndex }, [queueIndex])

  const PREVIEW_SECONDS = isPro ? Infinity : 20

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function stopTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  function startTimer(audio: HTMLAudioElement) {
    stopTimer()
    intervalRef.current = setInterval(() => {
      setElapsed(audio.currentTime)
      setDuration(audio.duration || 0)
      if (!isPro && audio.currentTime >= PREVIEW_SECONDS) {
        audio.pause()
        setIsPlaying(false)
        stopTimer()
        advanceQueue()
      }
    }, 250)
  }

  function advanceQueue() {
    const q = queueRef.current
    const idx = queueIndexRef.current
    if (q.length === 0) return

    let next: number
    if (shuffleRef.current) {
      next = Math.floor(Math.random() * q.length)
    } else {
      next = idx + 1
    }

    if (next >= q.length) {
      if (loopRef.current) {
        next = 0
      } else {
        setIsPlaying(false)
        stopTimer()
        return
      }
    }

    setQueueIndex(next)
    queueIndexRef.current = next
    loadAndPlay(q[next])
  }

  async function loadAndPlay(item: QueueItem) {
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
      audio.onended = () => advanceQueue()
      audio.onloadedmetadata = () => setDuration(audio.duration)
      await audio.play()
      setIsPlaying(true)
      startTimer(audio)
    } catch {
      console.error('Error reproduciendo')
    } finally {
      setLoading(false)
    }
  }

  function handlePlayPause() {
    const audio = audioRef.current
    if (!audio) {
      const q = queueRef.current
      if (q.length > 0) loadAndPlay(q[queueIndexRef.current])
      return
    }
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      stopTimer()
    } else {
      audio.play()
      setIsPlaying(true)
      startTimer(audio)
    }
  }

  function handleNext() {
    advanceQueue()
  }

  function handlePrev() {
    const q = queueRef.current
    const idx = queueIndexRef.current
    if (q.length === 0) return
    const prev = idx > 0 ? idx - 1 : loopRef.current ? q.length - 1 : 0
    setQueueIndex(prev)
    queueIndexRef.current = prev
    loadAndPlay(q[prev])
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
    queueRef.current = items
    setSelected(new Set(group.tracks.map((t) => t.id)))
    setQueueIndex(0)
    queueIndexRef.current = 0
    loadAndPlay(items[0])
  }

  function playDirectly(track: Track, group: Group) {
    const existingIdx = queueRef.current.findIndex((i) => i.track.id === track.id)
    if (existingIdx >= 0) {
      setQueueIndex(existingIdx)
      queueIndexRef.current = existingIdx
      loadAndPlay(queueRef.current[existingIdx])
    } else {
      const newItem = { track, group }
      const newQueue = [...queueRef.current, newItem]
      setQueue(newQueue)
      queueRef.current = newQueue
      const newSelected = new Set(selected)
      newSelected.add(track.id)
      setSelected(newSelected)
      const newIdx = newQueue.length - 1
      setQueueIndex(newIdx)
      queueIndexRef.current = newIdx
      loadAndPlay(newItem)
    }
  }

  function removeFromQueue(idx: number) {
    const item = queue[idx]
    const newQueue = queue.filter((_, i) => i !== idx)
    setQueue(newQueue)
    queueRef.current = newQueue
    const newSelected = new Set(selected)
    newSelected.delete(item.track.id)
    setSelected(newSelected)
    if (idx === queueIndex && isPlaying) {
      if (newQueue.length > 0) {
        const newIdx = Math.min(idx, newQueue.length - 1)
        setQueueIndex(newIdx)
        queueIndexRef.current = newIdx
        loadAndPlay(newQueue[newIdx])
      } else {
        audioRef.current?.pause()
        setIsPlaying(false)
        stopTimer()
      }
    } else if (idx < queueIndex) {
      setQueueIndex(queueIndex - 1)
      queueIndexRef.current = queueIndex - 1
    }
  }

  function formatTime(secs: number) {
    if (!isFinite(secs) || isNaN(secs)) return '—'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const currentItem = queue[queueIndex] ?? null
  const currentGroup = WAVE_GROUPS.find((g) => g.wave === openWave)!
  const progressPct = duration > 0 ? (elapsed / (isPro ? duration : Math.min(duration, PREVIEW_SECONDS))) * 100 : 0

  return (
    <div className="flex flex-col gap-6">

      {/* Mini player */}
      {currentItem && (
        <div className="rounded-2xl p-5 border" style={{ background: `${currentItem.group.color}10`, borderColor: `${currentItem.group.color}30` }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{currentItem.track.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{currentItem.track.title}</p>
              <p className="font-medium text-sm truncate">{currentItem.group.wave} · {currentItem.track.genre}</p>
              <p className="text-xs mt-0.5" style={{ color: currentItem.group.color }}>
                {currentItem.group.binauralHz} Hz binaural · {isPro ? 'completa' : 'muestra 20s'}
              </p>
            </div>
            <span className="text-xs text-muted font-mono text-right">
              {formatTime(elapsed)}{isPro ? ` / ${formatTime(duration)}` : ' / 0:20'}
            </span>
          </div>

          <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
            <div className="h-full rounded-full transition-all duration-200"
              style={{ width: `${Math.min(progressPct, 100)}%`, background: currentItem.group.color }} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Shuffle */}
              <button
                onClick={() => setShuffle(!shuffle)}
                title="Aleatorio"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{ background: shuffle ? `${currentItem.group.color}30` : 'rgba(255,255,255,0.05)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={shuffle ? currentItem.group.color : '#6b7580'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8"/>
                  <line x1="4" y1="20" x2="21" y2="3"/>
                  <polyline points="21 16 21 21 16 21"/>
                  <line x1="15" y1="15" x2="21" y2="21"/>
                </svg>
              </button>

              {/* Prev */}
              <button onClick={handlePrev} className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                disabled={loading}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: currentItem.group.color }}
              >
                {loading ? (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="#080c10" strokeWidth="1.5" strokeDasharray="8 8"/>
                  </svg>
                ) : isPlaying ? (
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

              {/* Next */}
              <button onClick={handleNext} className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M6 18l8.5-6L6 6v12zm2.5-6l5.5-4v8l-5.5-4zM16 6h2v12h-2z"/>
                </svg>
              </button>

              {/* Loop */}
              <button
                onClick={() => setLoop(!loop)}
                title="Repetir"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{ background: loop ? `${currentItem.group.color}30` : 'rgba(255,255,255,0.05)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={loop ? currentItem.group.color : '#6b7580'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9"/>
                  <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                  <polyline points="7 23 3 19 7 15"/>
                  <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                </svg>
              </button>
            </div>

            <span className="text-xs text-muted">{queueIndex + 1} / {queue.length}</span>
          </div>
        </div>
      )}

      {/* Cola */}
      {queue.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase text-muted mb-3">Cola de reproducción</p>
          <div className="flex flex-col gap-2">
            {queue.map((item, idx) => (
              <div
                key={`${item.track.id}-${idx}`}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all"
                style={idx === queueIndex ? {
                  background: `${item.group.color}10`,
                  borderColor: `${item.group.color}40`,
                } : { borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
              >
                <span className="text-sm">{item.track.emoji}</span>
                <span className="text-sm flex-1">{item.group.wave} · {item.track.genre}</span>
                {idx === queueIndex && isPlaying && (
                  <span className="text-xs" style={{ color: item.group.color }}>▶ ahora</span>
                )}
                <button onClick={() => removeFromQueue(idx)} className="text-muted hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
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
              <span>{g.emoji}</span><span>{g.wave}</span>
            </button>
          ))}
        </div>

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
                    <p className="font-medium text-sm">{track.title}</p>
                    <p className="font-medium text-sm">{currentGroup.wave} · {track.genre}</p>
                    <p className="text-xs mt-0.5" style={{ color: currentGroup.color }}>
                      {currentGroup.binauralHz} Hz binaural · {isPro ? 'completa' : 'muestra 20s'}
                    </p>
                  </div>

                  <button
                    onClick={() => playDirectly(track, currentGroup)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
                    style={{
                      background: isCurrent && isPlaying ? currentGroup.color : `${currentGroup.color}20`,
                      border: `1px solid ${currentGroup.color}40`,
                    }}
                  >
                    {isCurrent && isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#080c10">
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={currentGroup.color}>
                        <path d="M5 3l14 9-14 9V3z"/>
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