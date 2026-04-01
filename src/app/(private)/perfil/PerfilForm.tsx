'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  full_name: string | null
  apellido: string | null
  username: string | null
  avatar_url: string | null
}

export default function PerfilForm({ user, profile }: { user: User; profile: Profile | null }) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [apellido, setApellido] = useState(profile?.apellido || '')
  const [username, setUsername] = useState(profile?.username || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Iniciales para avatar fallback
  const initials = `${fullName?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño
    if (file.size > 2 * 1024 * 1024) {
        setError('La imagen no puede superar los 2MB')
        return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
        setError('Solo se permiten imágenes')
        return
    }

    setUploading(true)
    const supabase = createClient()

    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError('Error al subir la imagen')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    setAvatarUrl(data.publicUrl)
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    // Verificar que el username no esté tomado
    if (username) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single()

      if (existing) {
        setError('Ese nombre de usuario ya está en uso')
        setSaving(false)
        return
      }
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: fullName,
        apellido,
        username,
        avatar_url: avatarUrl,
      })

    if (error) {
      setError('Error al guardar. Intentá de nuevo.')
    } else {
      setSuccess(true)
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-white/[0.07] px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl">
          Neuro<span className="text-accent">Wave</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/foro" className="text-sm text-muted hover:text-white transition-colors">Foro</Link>
          <Link href="/" className="text-sm text-muted hover:text-white transition-colors">Mi biblioteca</Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-accent mb-2">Tu cuenta</p>
          <h1 className="font-serif text-4xl mb-1">Mi perfil</h1>
          <p className="text-muted text-sm">{user.email}</p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/10"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/30 flex items-center justify-center">
                  <span className="font-serif text-2xl text-accent">{initials}</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-bg/70 flex items-center justify-center">
                  <svg className="animate-spin w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="8"/>
                  </svg>
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="text-sm border border-white/10 px-4 py-2 rounded-full hover:border-white/25 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Subiendo...' : 'Cambiar foto'}
              </button>
              <p className="text-xs text-muted mt-1.5">JPG, PNG o GIF · Máx 2MB</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Nombre */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted mb-1.5 block">Nombre</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-surface border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1.5 block">Apellido</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Tu apellido"
                className="w-full bg-surface border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="text-xs text-muted mb-1.5 block">Nombre de usuario</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="tunombredeusuario"
                className="w-full bg-surface border border-white/[0.1] rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <p className="text-xs text-muted mt-1.5">Solo letras, números y guiones bajos. Aparece en el foro.</p>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {success && (
            <p className="text-xs text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2">
              ✓ Perfil guardado correctamente
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-accent text-bg font-medium py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </form>
      </div>
    </div>
  )
}