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

  // Perfil del usuario logueado
  const { data: profile } = user ? await supabase
    .from('profiles')
    .select('full_name, username, avatar_url')
    .eq('id', user.id)
    .maybeSingle() : { data: null }

  // Posts sin joins
  let postsQuery = supabase
    .from('posts')
    .select('id, title, content, wave, created_at, user_id')
    .order('created_at', { ascending: false })

  if (activeWave !== 'todos') {
    postsQuery = postsQuery.eq('wave', activeWave)
  }

  const { data: posts } = await postsQuery

  // Traer perfiles de autores por separado
  const authorIds = [...new Set(posts?.map((p) => p.user_id) || [])]
  const { data: authorProfiles } = authorIds.length > 0 ? await supabase
    .from('profiles')
    .select('id, full_name, username')
    .in('id', authorIds) : { data: [] }

  // Contar comentarios por post
  const postIds = posts?.map((p) => p.id) || []
  const { data: commentCounts } = postIds.length > 0 ? await supabase
    .from('comments')
    .select('post_id')
    .in('post_id', postIds) : { data: [] }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  function getAuthorName(userId: string) {
    const p = authorProfiles?.find((a) => a.id === userId)
    if (!p) return 'Usuario'
    return p.username ? `@${p.username}` : p.full_name || 'Usuario'
  }

  function getCommentCount(postId: string) {
    return commentCounts?.filter((c) => c.post_id === postId).length || 0
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-bg/95 backdrop-blur-xl px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl">
          Neuro<span className="text-accent">Wave</span>
        </Link>
        <ul className="hidden md:flex gap-8 list-none">
          <li><Link href="/#ondas" className="text-sm text-muted hover:text-white transition-colors">Las ondas</Link></li>
          <li><Link href="/#ciencia" className="text-sm text-muted hover:text-white transition-colors">Ciencia</Link></li>
          <li><Link href="/#playlists" className="text-sm text-muted hover:text-white transition-colors">Playlists</Link></li>
          <li><Link href="/foro" className="text-sm text-white">Foro</Link></li>
        </ul>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-muted hover:text-white transition-colors hidden md:block">
                Mi biblioteca
              </Link>
              <Link href="/perfil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <span className="text-xs font-medium text-accent">
                      {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-sm text-muted hover:text-white transition-colors">
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-8 pt-24 pb-12">

        {/* Banner no logueado */}
        {!user && (
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-xl">👋</span>
              <div>
                <p className="text-sm font-medium">¿Querés participar en el foro?</p>
                <p className="text-xs text-muted mt-0.5">Registrate gratis y completá tu perfil para postear y comentar</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="/login" className="text-xs text-muted hover:text-white transition-colors px-3 py-2">
                Iniciar sesión
              </Link>
              <Link href="/registro" className="bg-accent text-bg text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                Registrate gratis
              </Link>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-accent mb-2">Comunidad</p>
          <h1 className="font-serif text-4xl mb-2">Foro de ondas binaurales</h1>
          <p className="text-muted text-sm">Compartí tu experiencia, hacé preguntas y conectá con otros usuarios.</p>
        </div>

        {/* Tabs por onda */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {WAVES.map((w) => (
            <Link
              key={w.id}
              href={w.id === 'general' ? '/foro' : `/foro?wave=${w.id}`}
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
                    <p className="text-xs text-muted mt-1">💬 {getCommentCount(post.id)} respuestas</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.05]">
                  <p className="text-xs text-muted">por {getAuthorName(post.user_id)}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}