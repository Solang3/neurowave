import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import CommentForm from './CommentForm'

const WAVES: Record<string, { label: string; emoji: string; color: string }> = {
  general: { label: 'General', emoji: '💬', color: '#ffffff' },
  delta: { label: 'Delta', emoji: '🌙', color: '#c4a8f0' },
  theta: { label: 'Theta', emoji: '🧘', color: '#a8f0c8' },
  alpha: { label: 'Alpha', emoji: '🌊', color: '#7eb8f7' },
  beta: { label: 'Beta', emoji: '⚡', color: '#f0e8a8' },
  gamma: { label: 'Gamma', emoji: '🧠', color: '#f0a8a8' },
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user ? await supabase
    .from('profiles')
    .select('full_name, username, avatar_url, role')
    .eq('id', user.id)
    .maybeSingle() : { data: null }

  const navUser = user ? {
    email: user.email!,
    fullName: profile?.full_name,
    username: profile?.username,
    avatarUrl: profile?.avatar_url,
    role: profile?.role,
  } : null

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content, wave, created_at, user_id')
    .eq('id', id)
    .single()

  if (!post) redirect('/foro')

  const { data: author } = await supabase
    .from('profiles')
    .select('full_name, username, avatar_url')
    .eq('id', post!.user_id)
    .maybeSingle()

  const { data: comments } = await supabase
    .from('comments')
    .select('id, content, created_at, user_id')
    .eq('post_id', id)
    .order('created_at', { ascending: true })

  const commentUserIds = [...new Set(comments?.map((c) => c.user_id) || [])]
  const { data: commentProfiles } = commentUserIds.length > 0 ? await supabase
    .from('profiles').select('id, full_name, username, avatar_url').in('id', commentUserIds) : { data: [] }

  const waveData = WAVES[post!.wave] || WAVES.general
  const isAdmin = profile?.role === 'admin'

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  function getDisplayName(p: { full_name?: string | null; username?: string | null } | null) {
    if (!p) return 'Usuario'
    return p.username ? `@${p.username}` : p.full_name || 'Usuario'
  }

  async function deletePost() {
    'use server'
    const supabase = await createClient()
    await supabase.from('posts').delete().eq('id', post!.id)
    redirect('/foro')
  }

  async function deleteComment(commentId: string) {
    'use server'
    const supabase = await createClient()
    await supabase.from('comments').delete().eq('id', commentId)
    redirect(`/foro/${post!.id}`)
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar user={navUser} />

      {!user && (
        <div className="pt-20 px-6 max-w-2xl mx-auto">
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-xl">👋</span>
              <div>
                <p className="text-sm font-medium">¿Querés participar en el foro?</p>
                <p className="text-xs text-muted mt-0.5">Registrate gratis y completá tu perfil para postear y comentar</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="/login" className="text-xs text-muted hover:text-white transition-colors px-3 py-2">Iniciar sesión</Link>
              <Link href="/registro" className="bg-accent text-bg text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity">Registrate gratis</Link>
            </div>
          </div>
        </div>
      )}

      {/* Tabs de ondas */}
      <div className={`max-w-2xl mx-auto px-6 ${!user ? 'pt-4' : 'pt-24'}`}>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {Object.entries(WAVES).map(([wid, w]) => (
            <Link
              key={wid}
              href={wid === 'general' ? '/foro' : `/foro?wave=${wid}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all"
              style={{
                background: post!.wave === wid ? `${w.color}20` : 'transparent',
                border: `1px solid ${post!.wave === wid ? w.color + '50' : 'rgba(255,255,255,0.07)'}`,
                color: post!.wave === wid ? w.color : '#6b7580',
              }}
            >
              {w.emoji} {w.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-12">
        {/* Post */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <span className="text-xs px-2 py-0.5 rounded-full inline-block"
              style={{ background: `${waveData.color}20`, color: waveData.color, border: `1px solid ${waveData.color}30` }}>
              {waveData.emoji} {waveData.label}
            </span>
            {isAdmin && (
              <form action={deletePost}>
                <button type="submit" className="text-xs text-muted hover:text-red-400 transition-colors flex items-center gap-1"
                  onClick={(e) => { if (!confirm('¿Borrar este post?')) e.preventDefault() }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  </svg>
                  Borrar post
                </button>
              </form>
            )}
          </div>

          <h1 className="font-serif text-3xl mb-3">{post!.title}</h1>
          <div className="flex items-center gap-3 mb-6">
            {author?.avatar_url ? (
              <img src={author.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-[10px] text-accent">{author?.full_name?.charAt(0) || '?'}</span>
              </div>
            )}
            <p className="text-xs text-muted">{getDisplayName(author)} · {formatDate(post!.created_at)}</p>
          </div>
          <div className="bg-surface border border-white/[0.07] rounded-2xl p-6">
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{post!.content}</p>
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
            {comments?.map((comment) => {
              const commentAuthor = commentProfiles?.find((p) => p.id === comment.user_id)
              return (
                <div key={comment.id} className="bg-surface border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {commentAuthor?.avatar_url ? (
                        <img src={commentAuthor.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="text-[10px] text-accent">{commentAuthor?.full_name?.charAt(0) || '?'}</span>
                        </div>
                      )}
                      <p className="text-xs text-muted">{getDisplayName(commentAuthor ?? null)} · {formatDate(comment.created_at)}</p>
                    </div>
                    {isAdmin && (
                      <form action={deleteComment.bind(null, comment.id)}>
                        <button type="submit" className="text-xs text-muted hover:text-red-400 transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          </svg>
                        </button>
                      </form>
                    )}
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Formulario */}
        {!user ? (
          <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-medium text-sm">¿Querés responder este hilo?</p>
                <p className="text-xs text-muted mt-0.5">Necesitás una cuenta con perfil completo para participar</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/registro" className="bg-accent text-bg text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">Registrate gratis</Link>
              <Link href="/login" className="text-sm text-muted hover:text-white transition-colors">Ya tengo cuenta</Link>
            </div>
          </div>
        ) : !profile?.username ? (
          <div className="bg-surface border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-medium text-sm">Completá tu perfil para comentar</p>
                <p className="text-xs text-muted mt-0.5">Necesitás elegir un nombre de usuario antes de participar en el foro</p>
              </div>
            </div>
            <Link href="/perfil" className="inline-block bg-accent text-bg text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
              Completar perfil →
            </Link>
          </div>
        ) : (
          <CommentForm postId={post!.id} userId={user.id} />
        )}
      </div>
    </div>
  )
}