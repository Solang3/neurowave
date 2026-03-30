import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const WAVES = [
  { id: 'general', label: 'General', emoji: '💬', color: '#ffffff' },
  { id: 'delta', label: 'Delta', emoji: '🌙', color: '#c4a8f0' },
  { id: 'theta', label: 'Theta', emoji: '🧘', color: '#a8f0c8' },
  { id: 'alpha', label: 'Alpha', emoji: '🌊', color: '#7eb8f7' },
  { id: 'beta', label: 'Beta', emoji: '⚡', color: '#f0e8a8' },
  { id: 'gamma', label: 'Gamma', emoji: '🧠', color: '#f0a8a8' },
]

export default async function ForoPage({
  searchParams,
}: {
  searchParams: { wave?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const activeWave = searchParams.wave || 'general'

  const query = supabase
    .from('posts')
    .select(`
      id, title, content, wave, created_at,
      profiles!user_id (full_name),
      comments (count)
    `)
    .order('created_at', { ascending: false })

  if (activeWave !== 'todos') {
    query.eq('wave', activeWave)
  }

  const { data: posts } = await query

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  const activeWaveData = WAVES.find(w => w.id === activeWave)

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="border-b border-white/[0.07] px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl">
          Neuro<span className="text-accent">Wave</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="text-sm text-muted hover:text-white transition-colors">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-sm text-muted hover:text-white transition-colors">
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-accent mb-2">Comunidad</p>
          <h1 className="font-serif text-4xl mb-2">Foro de ondas binaurales</h1>
          <p className="text-muted text-sm">
            Compartí tu experiencia, hacé preguntas y conectá con otros usuarios.
            {!user && (
              <span> <Link href="/registro" className="text-accent hover:underline">Registrate gratis</Link> para participar.</span>
            )}
          </p>
        </div>

        {/* Tabs por onda */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          <Link
            href="/foro"
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all"
            style={{
              background: activeWave === 'general' ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: `1px solid ${activeWave === 'general' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
              color: activeWave === 'general' ? 'white' : '#6b7580',
            }}
          >
            💬 General
          </Link>
          {WAVES.slice(1).map((w) => (
            <Link
              key={w.id}
              href={`/foro?wave=${w.id}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all"
              style={{
                background: activeWave === w.id ? `${w.color}20` : 'transparent',
                border: `1px solid ${activeWave === w.id ? w.color + '50' : 'rgba(255,255,255,0.07)'}`,
                color: activeWave === w.id ? w.color : '#6b7580',
              }}
            >
              {w.emoji} {w.label}
            </Link>
          ))}
        </div>

        {/* Botón nuevo post */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted">
            {posts?.length || 0} {posts?.length === 1 ? 'hilo' : 'hilos'}
          </p>
          {user ? (
            <Link
              href={`/foro/nuevo?wave=${activeWave}`}
              className="bg-accent text-bg text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              + Nuevo hilo
            </Link>
          ) : (
            <Link
              href="/registro"
              className="border border-white/10 text-sm px-5 py-2.5 rounded-full hover:border-white/25 transition-colors"
            >
              Registrate para participar
            </Link>
          )}
        </div>

        {/* Lista de posts */}
        <div className="flex flex-col gap-3">
          {!posts?.length && (
            <div className="bg-surface border border-white/[0.07] rounded-2xl p-12 text-center">
              <p className="font-serif text-xl mb-2">Todavía no hay hilos</p>
              <p className="text-muted text-sm">
                {user ? '¡Sé el primero en crear uno!' : 'Registrate para ser el primero en participar.'}
              </p>
            </div>
          )}

          {posts?.map((post) => {
            const waveData = WAVES.find(w => w.id === post.wave)
            return (
              <Link
                key={post.id}
                href={`/foro/${post.id}`}
                className="bg-surface border border-white/[0.07] hover:border-white/[0.15] rounded-2xl p-6 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: `${waveData?.color}20`,
                          color: waveData?.color,
                          border: `1px solid ${waveData?.color}30`
                        }}
                      >
                        {waveData?.emoji} {waveData?.label}
                      </span>
                    </div>
                    <h2 className="font-medium text-base mb-1 truncate">{post.title}</h2>
                    <p className="text-sm text-muted line-clamp-2">{post.content}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted">{formatDate(post.created_at)}</p>
                    <p className="text-xs text-muted mt-1">
                      💬 {(post.comments as any)?.[0]?.count || 0} respuestas
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.05]">
                  <p className="text-xs text-muted">
                    por {(post.profiles as any)?.full_name || 'Usuario'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}