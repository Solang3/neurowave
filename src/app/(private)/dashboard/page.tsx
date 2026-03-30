import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { WAVES } from '@/lib/waves'
import DashboardPlayer from './DashboardPlayer'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscription, error: subError } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', user.id)
  .maybeSingle()

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
        <div className="flex items-center gap-4">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            isPro ? 'bg-accent/15 text-accent border border-accent/25' : 'bg-white/5 text-muted border border-white/[0.07]'
          }`}>
            {isPro ? '✦ Pro' : 'Free'}
          </span>
          <span className="text-xs text-muted hidden md:block truncate max-w-[180px]">{user.email}</span>
          <form action={signOut}>
            <button className="text-xs text-muted hover:text-white transition-colors">Salir</button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">

        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-accent mb-2">Tu cuenta</p>
          <h1 className="font-serif text-4xl mb-1">Bienvenida{isPro ? ' ✦' : ''}</h1>
          <p className="text-muted text-sm">{user.email}</p>
        </div>

        {!isPro && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-2xl">Muestras gratuitas</h2>
                <span className="text-xs text-muted">40 seg · Solo auriculares</span>
            </div>
            <DashboardPlayer isPro={false} />
            <div className="mt-4 bg-surface border border-white/[0.07] rounded-xl p-4 flex items-center justify-between gap-4">
              <p className="text-xs text-muted leading-relaxed">
                Desbloqueá la biblioteca completa con más de 30 tracks y los protocolos del Dr. González
              </p>
              <Link href="/checkout?plan=monthly" className="flex-shrink-0 bg-accent text-bg text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                Ver Pro
              </Link>
            </div>
          </div>
        )}

        {isPro && (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-2xl">Tu biblioteca Pro</h2>
            <span className="text-xs text-accent border border-accent/20 px-3 py-1 rounded-full">✦ Pro</span>
            </div>
            <DashboardPlayer isPro={true} />
        </div>
        )}

        <div>
          <h2 className="font-serif text-2xl mb-5">Las 5 ondas</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {WAVES.map((wave) => (
              <Link key={wave.id} href={`/ondas/${wave.id}`} className="bg-surface border border-white/[0.07] hover:border-white/[0.15] rounded-xl p-4 transition-all">
                <div className="h-0.5 rounded-full mb-3" style={{ background: wave.color }} />
                <p className="text-xs font-medium mb-0.5" style={{ color: wave.color }}>{wave.freqRange}</p>
                <p className="font-serif text-lg">{wave.name}</p>
                <p className="text-xs text-muted mt-1">{wave.useCase}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}