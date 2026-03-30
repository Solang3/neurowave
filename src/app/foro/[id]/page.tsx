import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CommentForm from './CommentForm'

const WAVES: Record<string, { label: string; emoji: string; color: string }> = {
  general: { label: 'General', emoji: '💬', color: '#ffffff' },
  delta: { label: 'Delta', emoji: '🌙', color: '#c4a8f0' },
  theta: { label: 'Theta', emoji: '🧘', color: '#a8f0c8' },
  alpha: { label: 'Alpha', emoji: '🌊', color: '#7eb8f7' },
  beta: { label: 'Beta', emoji: '⚡', color: '#f0e8a8' },
  gamma: { label: 'Gamma', emoji: '🧠', color: '#f0a8a8' },
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase
    .from('profiles')
    .select('full_name, username, avatar_url')
    .eq('id', user.id)
    .maybeSingle() : { data: null }
  const { data: post } = await supabase
    .from('posts')
    .select(`id, title, content, wave, created_at, profiles!user_id (full_name)`)
    .eq('id', params.id)
    .single()

  if (!post) redirect('/foro')

  const { data: comments } = await supabase
    .from('comments')
    .select(`id, content, created_at, profiles!user_id (full_name)`)
    .eq('post_id', params.id)
    .order('created_at', { ascending: true })

  const waveData = WAVES[post.wave] || WAVES.general

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-bg/95 backdrop-blur-xl px-6 md:px-12 py-4 flex items-center justify-between`}>
  <Link href="/" className="font-serif text-xl">
    Neuro<span className="text-accent">Wave</span>
  </Link>

  {/* Links desktop */}
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
{!user && (
  <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 flex items-center justify-between gap-4 mb-8">
    <div className="flex items-center gap-3">
      <span className="text-xl">👋</span>
      <div>
        <p className="text-sm font-medium">¿Querés participar en el foro?</p>
        <p className="text-xs text-muted mt-0.5">
          Registrate gratis y completá tu perfil para postear y comentar
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      <Link href="/login" className="text-xs text-muted hover:text-white transition-colors px-3 py-2">
        Iniciar sesión
      </Link>
      <Link
        href="/registro"
        className="bg-accent text-bg text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
      >
        Registrate gratis
      </Link>
    </div>
  </div>
)}

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Post */}
        <div className="mb-8">
          <span
            className="text-xs px-2 py-0.5 rounded-full mb-4 inline-block"
            style={{ background: `${waveData.color}20`, color: waveData.color, border: `1px solid ${waveData.color}30` }}
          >
            {waveData.emoji} {waveData.label}
          </span>
          <h1 className="font-serif text-3xl mb-3">{post.title}</h1>
          <p className="text-xs text-muted mb-6">
            por {(post.profiles as any)?.username ? `@${(post.profiles as any).username}` : (post.profiles as any)?.full_name || 'Usuario'
} · {formatDate(post.created_at)}
          </p>
          <div className="bg-surface border border-white/[0.07] rounded-2xl p-6">
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>

        {/* Comentarios */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl mb-5">
            {comments?.length || 0} {comments?.length === 1 ? 'respuesta' : 'respuestas'}
          </h2>

          {!comments?.length && (
            <div className="bg-surface border border-white/[0.07] rounded-2xl p-8 text-center mb-6">
              <p className="text-muted text-sm">Todavía no hay respuestas. ¡Sé el primero!</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {comments?.map((comment) => (
              <div key={comment.id} className="bg-surface border border-white/[0.07] rounded-2xl p-5">
                <p className="text-xs text-muted mb-3">
                  {(comment.profiles as any)?.full_name || 'Usuario'} · {formatDate(comment.created_at)}
                </p>
                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario de respuesta */}
        {!user ? (
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💬</span>
            <div>
                <p className="font-medium text-sm">Querés responder este hilo?</p>
                <p className="text-xs text-muted mt-0.5">
                Necesitás una cuenta con perfil completo para participar
                </p>
            </div>
            </div>
            <div className="flex items-center gap-3">
            <Link
                href="/registro"
                className="bg-accent text-bg text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
                Registrate gratis
            </Link>
            <Link href="/login" className="text-sm text-muted hover:text-white transition-colors">
                Ya tengo cuenta
            </Link>
            </div>
        </div>
        ) : !profile?.username ? (
        <div className="bg-surface border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚠️</span>
            <div>
                <p className="font-medium text-sm">Completá tu perfil para comentar</p>
                <p className="text-xs text-muted mt-0.5">
                Necesitás elegir un nombre de usuario antes de participar en el foro
                </p>
            </div>
            </div>
            <Link
            href="/perfil"
            className="inline-block bg-accent text-bg text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
            Completar perfil →
            </Link>
        </div>
        ) : (
        <CommentForm postId={post.id} userId={user.id} />
        )}
      </div>
    </div>
  )
}