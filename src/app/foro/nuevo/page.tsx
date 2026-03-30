'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Suspense } from 'react'

const WAVES = [
  { id: 'general', label: 'General', emoji: '💬' },
  { id: 'delta', label: 'Delta', emoji: '🌙' },
  { id: 'theta', label: 'Theta', emoji: '🧘' },
  { id: 'alpha', label: 'Alpha', emoji: '🌊' },
  { id: 'beta', label: 'Beta', emoji: '⚡' },
  { id: 'gamma', label: 'Gamma', emoji: '🧠' },
]

function NuevoPostContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [wave, setWave] = useState(searchParams.get('wave') || 'general')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({ user_id: user.id, wave, title, content })
      .select('id')
      .single()

    if (error) {
      setError('Error al crear el hilo. Intentá de nuevo.')
      setLoading(false)
      return
    }

    router.push(`/foro/${data.id}`)
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-white/[0.07] px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl">
          Neuro<span className="text-accent">Wave</span>
        </Link>
        <Link href="/foro" className="text-sm text-muted hover:text-white transition-colors">
          ← Volver al foro
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl mb-8">Nuevo hilo</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Onda */}
          <div>
            <label className="text-xs text-muted mb-3 block tracking-widest uppercase">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {WAVES.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWave(w.id)}
                  className="px-4 py-2 rounded-full text-sm transition-all border"
                  style={{
                    background: wave === w.id ? 'rgba(168,240,200,0.15)' : 'transparent',
                    borderColor: wave === w.id ? 'rgba(168,240,200,0.4)' : 'rgba(255,255,255,0.07)',
                    color: wave === w.id ? '#a8f0c8' : '#6b7580',
                  }}
                >
                  {w.emoji} {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="text-xs text-muted mb-1.5 block tracking-widest uppercase">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="¿Sobre qué querés hablar?"
              className="w-full bg-surface border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {/* Contenido */}
          <div>
            <label className="text-xs text-muted mb-1.5 block tracking-widest uppercase">Contenido</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              placeholder="Contá tu experiencia, hacé tu pregunta o compartí lo que encontraste..."
              className="w-full bg-surface border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-bg font-medium px-8 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Publicando...' : 'Publicar hilo'}
            </button>
            <Link href="/foro" className="text-sm text-muted hover:text-white transition-colors">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function NuevoPostPage() {
  return (
    <Suspense>
      <NuevoPostContent />
    </Suspense>
  )
}