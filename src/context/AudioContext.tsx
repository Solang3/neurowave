'use client'

import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'

const R2_PUBLIC = 'https://pub-78c976d8802a412ca89533a0734f5054.r2.dev'

export interface AudioTrack {
  id: string
  title: string
  wave: string
  genre: string
  emoji: string
  path: string
  color: string
  binauralHz?: number
  playlistTitle?: string
}

interface AudioContextType {
  currentTrack: AudioTrack | null
  queue: AudioTrack[]
  queueIndex: number
  isPlaying: boolean
  elapsed: number
  duration: number
  isLoggedIn: boolean
  setIsLoggedIn: (v: boolean) => void
  playQueue: (tracks: AudioTrack[], startIndex?: number) => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  seek: (time: number) => void
  stop: () => void
}

const AudioCtx = createContext<AudioContextType | null>(null)

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}

export function AudioProvider({ children, loggedIn }: { children: React.ReactNode; loggedIn: boolean }) {
  const [queue, setQueue] = useState<AudioTrack[]>([])
  const [queueIndex, setQueueIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const queueRef = useRef(queue)
  const indexRef = useRef(queueIndex)

  useEffect(() => { queueRef.current = queue }, [queue])
  useEffect(() => { indexRef.current = queueIndex }, [queueIndex])

  const currentTrack = queue[queueIndex] ?? null

  function stopTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  function startTimer(audio: HTMLAudioElement) {
    stopTimer()
    intervalRef.current = setInterval(() => {
      setElapsed(audio.currentTime)
      setDuration(audio.duration || 0)
    }, 250)
  }

  const loadAndPlay = useCallback(async (track: AudioTrack) => {
    audioRef.current?.pause()
    stopTimer()
    setElapsed(0)
    setDuration(0)

    try {
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
      audio.onended = () => {
        const q = queueRef.current
        const idx = indexRef.current
        const next = idx + 1
        if (next < q.length) {
          setQueueIndex(next)
          indexRef.current = next
          loadAndPlay(q[next])
        } else {
          setIsPlaying(false)
          stopTimer()
        }
      }
      audio.onloadedmetadata = () => setDuration(audio.duration)
      await audio.play()
      setIsPlaying(true)
      startTimer(audio)
    } catch {
      console.error('Error reproduciendo')
    }
  }, [isLoggedIn])

  function playQueue(tracks: AudioTrack[], startIndex = 0) {
    setQueue(tracks)
    setQueueIndex(startIndex)
    queueRef.current = tracks
    indexRef.current = startIndex
    loadAndPlay(tracks[startIndex])
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
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

  function next() {
    const q = queueRef.current
    const idx = indexRef.current
    const nextIdx = idx + 1
    if (nextIdx < q.length) {
      setQueueIndex(nextIdx)
      indexRef.current = nextIdx
      loadAndPlay(q[nextIdx])
    }
  }

  function prev() {
    const q = queueRef.current
    const idx = indexRef.current
    const prevIdx = idx - 1
    if (prevIdx >= 0) {
      setQueueIndex(prevIdx)
      indexRef.current = prevIdx
      loadAndPlay(q[prevIdx])
    }
  }

  function seek(time: number) {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setElapsed(time)
    }
  }

  function stop() {
    audioRef.current?.pause()
    setIsPlaying(false)
    setQueue([])
    setQueueIndex(0)
    setElapsed(0)
    stopTimer()
  }

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      stopTimer()
    }
  }, [])

  return (
    <AudioCtx.Provider value={{
      currentTrack, queue, queueIndex, isPlaying,
      elapsed, duration, isLoggedIn, setIsLoggedIn,
      playQueue, togglePlay, next, prev, seek, stop,
    }}>
      {children}
    </AudioCtx.Provider>
  )
}