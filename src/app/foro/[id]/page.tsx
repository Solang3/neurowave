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
      <nav className="border-b border-white/[0.07] px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl">
          Neuro<span className="text-accent">Wave</span>
        </Link>
        <Link href="/foro" className="text-sm text-muted hover:text-white transition-colors">
          ← Volver al foro
        </Link>
      </nav>

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
            por {(post.profiles as any)?.full_name || 'Usuario'} · {formatDate(post.created_at)}
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
        {user ? (
          <CommentForm postId={post.id} userId={user.id} />
        ) : (
          <div className="bg-surface border border-white/[0.07] rounded-2xl p-6 text-center">
            <p className="text-sm text-muted mb-4">
              <Link href="/registro" className="text-accent hover:underline">Registrate gratis</Link>
              {' '}para dejar una respuesta
            </p>
          </div>
        )}
      </div>
    </div>
  )
}