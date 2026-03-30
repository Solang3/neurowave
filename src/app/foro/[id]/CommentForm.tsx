'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CommentForm({ postId, userId }: { postId: string; userId: string }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: userId, content })

    if (error) {
      setError('Error al publicar. Intentá de nuevo.')
      setLoading(false)
      return
    }

    setContent('')
    setLoading(false)
    router.refresh()
  }

  return (
    <div>
      <h3 className="font-serif text-xl mb-4">Dejar una respuesta</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          placeholder="Escribí tu respuesta..."
          className="w-full bg-surface border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none"
        />
        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="self-start bg-accent text-bg font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Publicando...' : 'Publicar respuesta'}
        </button>
      </form>
    </div>
  )
}