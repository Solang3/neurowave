import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WavesPanel from './WavesPanel'
import DashboardPlayer from './DashboardPlayer'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscription } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', user.id)
  .maybeSingle()

  const { data: profile } = await supabase
  .from('profiles')
  .select('full_name, username, avatar_url, role')
  .eq('id', user.id)
  .single()

  const isPro = subscription?.status === 'pro'

  const navUser = {
    email: user.email!,
    fullName: profile?.full_name ?? null,
    username: profile?.username ?? null,
    avatarUrl: profile?.avatar_url ?? null,
    role: profile?.role ?? null,
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar user={navUser} />

      <div className="max-w-4xl mx-auto px-6 md:px-8 pt-24 pb-12">

        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-accent mb-2">Tu cuenta</p>
          <h1 className="font-serif text-4xl mb-1">Bienvenida{isPro ? ' ✦' : ''}</h1>
          <p className="text-muted text-sm">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <Link href="/protocolos" className="bg-surface border border-white/[0.07] hover:border-white/[0.15] rounded-2xl p-6 transition-all group">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <p className="font-medium text-sm mb-1 group-hover:text-accent transition-colors">Protocolos</p>
            <p className="text-xs text-muted leading-relaxed">Secuencias curadas por el Dr. González</p>
          </Link>
          <Link href="/foro" className="bg-surface border border-white/[0.07] hover:border-white/[0.15] rounded-2xl p-6 transition-all group">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <p className="font-medium text-sm mb-1 group-hover:text-accent transition-colors">Foro</p>
            <p className="text-xs text-muted leading-relaxed">Comunidad de ondas binaurales</p>
          </Link>
        </div>

        <WavesPanel />

        <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl">Biblioteca de ondas</h2>
            <span className="text-xs text-muted">🎧 Solo auriculares</span>
        </div>
        <DashboardPlayer isPro={true} />
        {/* TODO: Activar cuando tengamos Spotify y YouTube
            <div className="mt-4 bg-surface border border-white/[0.07] rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-muted leading-relaxed">
                Seguinos en Spotify y YouTube (Proximamente disponible) y enterarte de las últimas novedades.
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
                <a href="#" target="_blank" className="text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity" style={{ background: '#1DB954', color: '#000' }}>
                Spotify
                </a>
                <a href="#" target="_blank" className="text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity" style={{ background: '#FF0000', color: '#fff' }}>
                YouTube
                </a>
            </div>
            </div>
        */}
        </div>
      </div>
    </div>
  )
}