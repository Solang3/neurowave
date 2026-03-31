'use client'

import { useState } from 'react'
import Link from 'next/link'

const ALL_TRACKS = [
  {
    wave: 'Delta', binauralHz: 2, color: '#c4a8f0', emoji: '🌙',
    tracks: [
      { genre: 'Nature', emoji: '🌿', title: 'Amanecer en el Bosque', path: 'delta/nature/Delta-nature-Amanecer en el Bosque-binaural.mp3' },
      { genre: 'Nature', emoji: '🌿', title: 'El Arroyo y el Viento', path: 'delta/nature/Delta-nature-El Arroyo y el Viento-binaural.mp3' },
      { genre: 'Nature', emoji: '🌿', title: 'La Tormenta se Acerca', path: 'delta/nature/Delta-nature-La Tormenta se Acerca-binaural.mp3' },
      { genre: 'Nature', emoji: '🌿', title: 'La Tormenta', path: 'delta/nature/Delta-nature-La Tormenta-binaural.mp3' },
      { genre: 'Nature', emoji: '🌿', title: 'La Tormenta se Va', path: 'delta/nature/Delta-nature-La Tormenta se Va-binaural.mp3' },
      { genre: 'Nature', emoji: '🌿', title: 'Regreso al Amanecer', path: 'delta/nature/Delta-nature-Regreso al Amanecer-binaural.mp3' },
    ],
  },
  {
    wave: 'Theta', binauralHz: 6, color: '#a8f0c8', emoji: '🧘',
    tracks: [
      { genre: 'Nature', emoji: '🌿', title: 'Meditación en la Naturaleza', path: 'theta/nature/Theta-nature-001-binaural.mp3' },
      { genre: 'Classic', emoji: '🎻', title: 'Música Clásica', path: 'theta/classic/Theta-classic-001-binaural.mp3' },
      { genre: 'Ambient', emoji: '🌌', title: 'Ambiente Cósmico', path: 'theta/ambient/Theta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Alpha', binauralHz: 10, color: '#7eb8f7', emoji: '🌊',
    tracks: [
      { genre: 'Nature', emoji: '🌿', title: 'Naturaleza en Calma', path: 'alpha/nature/Alpha-nature-001-binaural.mp3' },
      { genre: 'Classic', emoji: '🎻', title: 'Música Clásica', path: 'alpha/classic/Alpha-classic-001-binaural.mp3' },
      { genre: 'Ambient', emoji: '🌌', title: 'Ambiente Cósmico', path: 'alpha/ambient/Alpha-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Beta', binauralHz: 15, color: '#f0e8a8', emoji: '⚡',
    tracks: [
      { genre: 'Nature', emoji: '🌿', title: 'Naturaleza en Calma', path: 'beta/nature/Beta-nature-001-binaural.mp3' },
      { genre: 'Classic', emoji: '🎻', title: 'Música Clásica', path: 'beta/classic/Beta-classic-001-binaural.mp3' },
      { genre: 'Ambient', emoji: '🌌', title: 'Ambiente Cósmico', path: 'beta/ambient/Beta-ambient-001-binaural.mp3' },
    ],
  },
  {
    wave: 'Gamma', binauralHz: 40, color: '#f0a8a8', emoji: '🧠',
    tracks: [
      { genre: 'Nature', emoji: '🌿', title: 'Naturaleza en Calma', path: 'gamma/nature/Gamma-nature-001-binaural.mp3' },
      { genre: 'Classic', emoji: '🎻', title: 'Música Clásica', path: 'gamma/classic/Gamma-classic-001-binaural.mp3' },
      { genre: 'Ambient', emoji: '🌌', title: 'Ambiente Cósmico', path: 'gamma/ambient/Gamma-ambient-001-binaural.mp3' },
    ],
  },
]

interface Track {
  wave?: string
  genre: string
  emoji: string
  path: string
  title: string
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
  published: boolean
  created_at: string
}

export default function ProtocolosPanel({ playlists: initialPlaylists }: { playlists: Playlist[] }) {
  const [playlists, setPlaylists] = useState(initialPlaylists)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Playlist | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [objective, setObjective] = useState('')
  const [emoji, setEmoji] = useState('🎵')
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([])

  function resetForm() {
    setTitle('')
    setDescription('')
    setObjective('')
    setEmoji('🎵')
    setSelectedTracks([])
    setCreating(false)
    setEditing(null)
  }

  function startEdit(playlist: Playlist) {
    setEditing(playlist)
    setTitle(playlist.title)
    setDescription(playlist.description)
    setObjective(playlist.objective)
    setEmoji(playlist.emoji)
    setSelectedTracks(playlist.tracks)
    setCreating(true)
  }

  function addTrack(track: Track, wave: typeof ALL_TRACKS[0]) {
    if (selectedTracks.find(t => t.path === track.path)) return
    setSelectedTracks(prev => [...prev, { ...track, binauralHz: wave.binauralHz, color: wave.color }])
  }

  function removeTrack(idx: number) {
    setSelectedTracks(prev => prev.filter((_, i) => i !== idx))
  }

  function moveTrack(idx: number, dir: 'up' | 'down') {
    const newTracks = [...selectedTracks]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= newTracks.length) return;
    [newTracks[idx], newTracks[swap]] = [newTracks[swap], newTracks[idx]]
    setSelectedTracks(newTracks)
  }

  async function handleSave() {
    if (!title || selectedTracks.length === 0) return
    setSaving(true)

    const body = { title, description, objective, emoji, tracks: selectedTracks }

    const res = await fetch('/api/admin/protocolos', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing ? { id: editing.id, ...body } : body),
    })

    if (res.ok) {
      const { playlist } = await res.json()
      if (editing) {
        setPlaylists(prev => prev.map(p => p.id === playlist.id ? playlist : p))
      } else {
        setPlaylists(prev => [playlist, ...prev])
      }
      resetForm()
    }
    setSaving(false)
  }

  async function togglePublished(id: string, published: boolean) {
    const res = await fetch('/api/admin/protocolos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, published: !published }),
    })
    if (res.ok) {
      setPlaylists(prev => prev.map(p => p.id === id ? { ...p, published: !published } : p))
    }
  }

  async function deletePlaylist(id: string) {
    if (!confirm('¿Borrar este protocolo?')) return
    const res = await fetch('/api/admin/protocolos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setPlaylists(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-white/[0.07] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl">
          Neuro<span className="text-accent">Wave</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-muted hover:text-white transition-colors">← Admin</Link>
          <span className="text-xs text-accent border border-accent/20 px-3 py-1 rounded-full">Protocolos</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase text-accent mb-2">Panel de administración</p>
            <h1 className="font-serif text-4xl">Protocolos curados</h1>
          </div>
          {!creating && (
            <button
              onClick={() => setCreating(true)}
              className="bg-accent text-bg text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              + Nuevo protocolo
            </button>
          )}
        </div>

        {/* Formulario de creación/edición */}
        {creating && (
          <div className="bg-surface border border-white/[0.07] rounded-2xl p-6 mb-8">
            <h2 className="font-serif text-2xl mb-6">{editing ? 'Editar protocolo' : 'Nuevo protocolo'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted mb-1.5 block">Título</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="ej: Protocolo para dejar de fumar"
                  className="w-full bg-bg border border-white/[0.1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1.5 block">Objetivo</label>
                <input
                  value={objective}
                  onChange={e => setObjective(e.target.value)}
                  placeholder="ej: Reducir ansiedad por abstinencia"
                  className="w-full bg-bg border border-white/[0.1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-xs text-muted mb-1.5 block">Emoji</label>
                <input
                  value={emoji}
                  onChange={e => setEmoji(e.target.value)}
                  className="w-full bg-bg border border-white/[0.1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-muted mb-1.5 block">Descripción</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Descripción científica del protocolo..."
                  className="w-full bg-bg border border-white/[0.1] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Selector de tracks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Biblioteca */}
              <div>
                <p className="text-xs tracking-widest uppercase text-muted mb-3">Biblioteca de tracks</p>
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                  {ALL_TRACKS.map(waveGroup => (
                    <div key={waveGroup.wave}>
                      <p className="text-xs font-medium mb-1.5" style={{ color: waveGroup.color }}>
                        {waveGroup.wave} · {waveGroup.binauralHz} Hz
                      </p>
                      {waveGroup.tracks.map(track => {
                        const already = selectedTracks.find(t => t.path === track.path)
                        return (
                          <button
                            key={track.path}
                            onClick={() => addTrack(track, waveGroup)}
                            disabled={!!already}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all mb-1 disabled:opacity-40"
                            style={{
                              background: already ? `${waveGroup.color}15` : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${already ? waveGroup.color + '40' : 'rgba(255,255,255,0.05)'}`,
                            }}
                          >
                            <span>{track.emoji}</span>
                            <span className="flex-1">{track.title}</span>
                            {!already && <span className="text-accent text-xs">+ agregar</span>}
                            {already && <span className="text-xs" style={{ color: waveGroup.color }}>✓</span>}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cola seleccionada */}
              <div>
                <p className="text-xs tracking-widest uppercase text-muted mb-3">
                  Orden del protocolo ({selectedTracks.length} tracks)
                </p>
                {selectedTracks.length === 0 && (
                  <div className="border border-dashed border-white/10 rounded-xl p-6 text-center">
                    <p className="text-xs text-muted">Agregá tracks desde la biblioteca</p>
                  </div>
                )}
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                  {selectedTracks.map((track, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.07] bg-white/[0.02] text-sm"
                    >
                      <span className="text-muted text-xs w-4">{idx + 1}</span>
                      <span>{track.emoji}</span>
                      <span className="flex-1 truncate">{track.title}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveTrack(idx, 'up')} className="text-muted hover:text-white text-xs px-1">↑</button>
                        <button onClick={() => moveTrack(idx, 'down')} className="text-muted hover:text-white text-xs px-1">↓</button>
                        <button onClick={() => removeTrack(idx)} className="text-muted hover:text-red-400 text-xs px-1">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !title || selectedTracks.length === 0}
                className="bg-accent text-bg font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear protocolo'}
              </button>
              <button onClick={resetForm} className="text-sm text-muted hover:text-white transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de protocolos */}
        <div className="flex flex-col gap-4">
          {playlists.length === 0 && !creating && (
            <div className="bg-surface border border-white/[0.07] rounded-2xl p-12 text-center">
              <p className="font-serif text-xl mb-2">No hay protocolos todavía</p>
              <p className="text-muted text-sm">Creá el primero con el botón de arriba</p>
            </div>
          )}

          {playlists.map(playlist => (
            <div key={playlist.id} className="bg-surface border border-white/[0.07] rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{playlist.emoji}</span>
                    <div>
                      <h3 className="font-medium">{playlist.title}</h3>
                      <p className="text-xs text-muted">{playlist.objective}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      playlist.published
                        ? 'bg-accent/15 text-accent border border-accent/25'
                        : 'bg-white/5 text-muted border border-white/10'
                    }`}>
                      {playlist.published ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                  {playlist.description && (
                    <p className="text-sm text-muted mb-3 line-clamp-2">{playlist.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {playlist.tracks.map((track, idx) => (
                      <span key={idx} className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        {track.emoji} {track.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePublished(playlist.id, playlist.published)}
                    className="text-xs px-3 py-1.5 rounded-full border transition-all hover:opacity-80"
                    style={playlist.published
                      ? { borderColor: 'rgba(255,255,255,0.1)', color: '#6b7580' }
                      : { borderColor: 'rgba(168,240,200,0.3)', color: '#a8f0c8' }
                    }
                  >
                    {playlist.published ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button
                    onClick={() => startEdit(playlist)}
                    className="text-xs text-muted hover:text-white transition-colors px-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deletePlaylist(playlist.id)}
                    className="text-xs text-muted hover:text-red-400 transition-colors px-2"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}