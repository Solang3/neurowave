import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProtocolosPlayer from './ProtocolosPlayer'

export default async function ProtocolosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user ? await supabase
    .from('profiles')
    .select('full_name, username, avatar_url')
    .eq('id', user.id)
    .maybeSingle() : { data: null }

  const { data: playlists } = await supabase
    .from('curated_playlists')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: true })

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
          <li><Link href="/protocolos" className="text-sm text-white">Protocolos</Link></li>
          <li><Link href="/foro" className="text-sm text-muted hover:text-white transition-colors">Foro</Link></li>
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
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-widest uppercase text-accent mb-2">Dr. Rogelio González</p>
          <h1 className="font-serif text-5xl leading-tight mb-4">
            Protocolos<br />
            <em className="text-accent">curados</em>
          </h1>
          <p className="text-muted max-w-lg leading-relaxed">
            Secuencias de ondas binaurales diseñadas para objetivos específicos. 
            Cada protocolo combina frecuencias en el orden correcto para guiar 
            al cerebro hacia el estado deseado.
          </p>
        </div>

        {/* Aviso auriculares */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 flex items-center gap-3 mb-10">
          <span className="text-2xl">🎧</span>
          <div>
            <p className="text-sm font-medium">Requiere auriculares estéreo</p>
            <p className="text-xs text-muted mt-0.5">
              El efecto binaural solo funciona con auriculares — cada oído recibe una frecuencia diferente.
            </p>
          </div>
        </div>

        {/* Protocolos */}
        {!playlists?.length ? (
          <div className="text-center py-12">
            <p className="text-muted">No hay protocolos publicados todavía.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {playlists.map((playlist) => (
              <ProtocolosPlayer key={playlist.id} playlist={playlist} isLoggedIn={!!user} />
            ))}
          </div>
        )}

        {/* CTA registro */}
        {!user && (
          <div className="mt-12 bg-surface border border-white/[0.07] rounded-2xl p-8 text-center">
            <p className="font-serif text-2xl mb-2">¿Querés escuchar completo?</p>
            <p className="text-muted text-sm mb-6">
              Registrate gratis para acceder a los protocolos completos y la biblioteca de ondas
            </p>
            <Link
              href="/registro"
              className="inline-block bg-accent text-bg font-medium px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Registrate gratis
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}