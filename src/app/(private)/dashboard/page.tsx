import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import WavesPanel from './WavesPanel'
import Link from 'next/link'
import DashboardPlayer from './DashboardPlayer'
import UserMenu from './UserMenu'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscription, error: subError } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', user.id)
  .maybeSingle()

  const { data: profile } = await supabase
  .from('profiles')
  .select('full_name, username, avatar_url')
  .eq('id', user.id)
  .single()

  const isPro = subscription?.status === 'pro'

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-white/[0.07] px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl">
            Neuro<span className="text-accent">Wave</span>
        </Link>
        <UserMenu
            email={user.email!}
            fullName={profile?.full_name ?? null}
            username={profile?.username ?? null}
            avatarUrl={profile?.avatar_url ?? null}
            onSignOut={signOut}
        />
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">

        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-accent mb-2">Tu cuenta</p>
          <h1 className="font-serif text-4xl mb-1">Bienvenida{isPro ? ' ✦' : ''}</h1>
          <p className="text-muted text-sm">{user.email}</p>
        </div>

        <WavesPanel />

        <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl">Biblioteca de ondas</h2>
            <span className="text-xs text-muted">🎧 Solo auriculares</span>
        </div>
        <DashboardPlayer isPro={true} />
        <div className="mt-4 bg-surface border border-white/[0.07] rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-muted leading-relaxed">
            Seguinos en Spotify y YouTube para acceder a la biblioteca completa
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
        </div>
      </div>
    </div>
  )
}