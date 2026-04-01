import Hero from '@/components/layout/Hero'
import WavesSection from '@/components/waves/WavesSection'
import DoctorSection from '@/components/layout/DoctorSection'
import PlaylistsSection from '@/components/layout/PlaylistsSection'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import WavesPanel from './(private)/dashboard/WavesPanel'
import DashboardPlayer from './(private)/dashboard/DashboardPlayer'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
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

  if (user) {
    const displayName = profile?.full_name?.split(' ')[0] || profile?.username || user.email?.split('@')[0]

    return (
      <>
        <Navbar user={navUser} />
        <main>
          {/* Saludo personalizado */}
          <section className="max-w-4xl mx-auto px-6 md:px-8 pt-28 pb-6">
            <p className="text-xs tracking-widest uppercase text-accent mb-2">Tu cuenta</p>
            <h1 className="font-serif text-4xl mb-4">Bienvenida, {displayName}</h1>

            {/* Acceso rápido */}
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
          </section>

          {/* Ondas — anchor #ondas */}
          <section id="ondas" className="max-w-4xl mx-auto px-6 md:px-8 pb-6">
            <WavesPanel />
          </section>

          {/* Biblioteca de ondas — anchor #playlists */}
          <section id="playlists" className="bg-surface border-t border-white/[0.07] py-16 md:py-24">
            <div className="max-w-5xl mx-auto px-4 md:px-12">
              <p className="text-xs tracking-widest uppercase text-accent mb-4">Biblioteca completa</p>
              <h2 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight mb-4">
                Una lista para<br />
                <em className="text-accent">cada necesidad</em>
              </h2>
              <p className="text-muted max-w-lg mb-10">
                Seleccionadas por el Dr. González. Acceso completo a todas las pistas.
              </p>
              <DashboardPlayer isPro={true} />
            </div>
          </section>

          {/* Sección científica — anchor #ciencia */}
          <DoctorSection />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar user={null} />
      <main>
        <Hero isLoggedIn={false} />
        <WavesSection />
        <DoctorSection />
        <PlaylistsSection isLoggedIn={false} />
      </main>
      <Footer />
    </>
  )
}
