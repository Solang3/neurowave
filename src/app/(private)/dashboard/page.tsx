import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { WAVES } from '@/lib/waves'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
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
      {/* Nav */}
      <nav className="border-b border-white/[0.07] px-6 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl">
          Neuro<span className="text-accent">Wave</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted hidden md:block">{user.email}</span>
          <form action={signOut}>
            <button className="text-xs text-muted hover:text-white transition-colors">
              Cerrar sesión
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">

        {/* Bienvenida */}
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-accent mb-2">Tu cuenta</p>
          <h1 className="font-serif text-4xl mb-1">
            Bienvenida{isPro ? ' 🎵' : ''}
          </h1>
          <p className="text-muted text-sm">{user.email}</p>
        </div>

        {/* Plan actual */}
        <div className={`rounded-2xl p-6 mb-8 border ${
          isPro
            ? 'bg-accent/5 border-accent/20'
            : 'bg-surface border-white/[0.07]'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-widest uppercase mb-1 font-medium" style={{ color: isPro ? '#a8f0c8' : '#6b7580' }}>
                Plan actual
              </p>
              <p className="font-serif text-2xl">{isPro ? 'Pro ✦' : 'Gratuito'}</p>
              {isPro && subscription?.current_period_end && (
                <p className="text-xs text-muted mt-1">
                  Próximo cobro: {new Date(subscription.current_period_end).toLocaleDateString('es-AR')}
                </p>
              )}
            </div>
            {!isPro && (
              <Link
                href="/#precios"
                className="bg-accent text-bg text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Mejorar a Pro
              </Link>
            )}
          </div>
        </div>

        {/* Acceso a ondas */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl mb-5">Tus ondas</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {WAVES.map((wave) => (
              <Link
                key={wave.id}
                href={`/ondas/${wave.id}`}
                className="bg-surface border border-white/[0.07] hover:border-white/[0.15] rounded-xl p-4 transition-all group"
              >
                <div className="h-0.5 rounded-full mb-3 w-full" style={{ background: wave.color }} />
                <p className="text-xs font-medium mb-0.5" style={{ color: wave.color }}>{wave.freqRange}</p>
                <p className="font-serif text-lg">{wave.name}</p>
                <p className="text-xs text-muted mt-1">{wave.useCase}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Playlists */}
        <div>
          <h2 className="font-serif text-2xl mb-5">Tus playlists</h2>
          {isPro ? (
            <div className="bg-surface border border-white/[0.07] rounded-2xl p-8 text-center">
              <p className="font-serif text-xl mb-2">Biblioteca completa desbloqueada ✦</p>
              <p className="text-muted text-sm mb-5">Tenés acceso a todas las playlists y protocolos del Dr. González</p>
              <Link
                href="/#playlists"
                className="inline-block bg-accent text-bg text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Ir a las playlists
              </Link>
            </div>
          ) : (
            <div className="bg-surface border border-white/[0.07] rounded-2xl p-8 text-center">
              <p className="text-muted text-sm mb-2">Tenés acceso a 2 playlists gratuitas</p>
              <p className="font-serif text-xl mb-5">Desbloqueá la biblioteca completa con Pro</p>
              <Link
                href="/#precios"
                className="inline-block bg-accent text-bg text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              >
                Ver planes
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}