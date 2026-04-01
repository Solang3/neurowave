'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const links = [
  { href: '/#ondas', label: 'Las ondas' },
  { href: '/#ciencia', label: 'Ciencia' },
  { href: '/#playlists', label: 'Playlists' },
  { href: '/protocolos', label: 'Protocolos' },
  { href: '/foro', label: 'Foro' },
]

interface NavbarProps {
  user?: {
    email: string
    fullName?: string | null
    username?: string | null
    avatarUrl?: string | null
    role?: string | null
  } | null
}

export default function Navbar({ user }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])


  function closeAndScroll(href: string) {
    setOpen(false)
    if (href.startsWith('#')) {
      setTimeout(() => {
        const el = document.querySelector(href)
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  const initials = user?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'
  const displayName = user?.username ? `@${user.username}` : user?.fullName || user?.email?.split('@')[0]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${
        scrolled || open ? 'bg-bg/95 backdrop-blur-xl border-b border-white/[0.07]' : 'bg-transparent'
      }`}>
        <Link href="/" className="font-serif text-xl tracking-tight z-50" onClick={() => setOpen(false)}>
          Neuro<span className="text-accent">Wave</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-10 list-none">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-muted hover:text-white transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <span className="text-xs font-medium text-accent">{initials}</span>
                  </div>
                )}
                <span className="text-sm text-muted hidden md:block">{displayName}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-white/[0.07] rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/[0.07]">
                      <p className="text-sm font-medium truncate">{user.fullName || user.email?.split('@')[0]}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link href="/perfil" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-white hover:bg-white/5 transition-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Mi perfil
                      </Link>
                      {user.role === 'admin' && (
                        <Link href="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-all"
                          style={{ color: '#f0a8a8' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          Panel admin
                        </Link>
                      )}
                    </div>
                    <div className="p-1 border-t border-white/[0.07]">
                      <Link href="/auth/signout" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-red-400 hover:bg-red-500/5 transition-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Cerrar sesión
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm text-muted hover:text-white transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/registro" className="bg-accent text-bg text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-85 transition-opacity">
                Empezar gratis
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${open ? 'w-5 rotate-45 translate-y-[6.5px]' : 'w-5'}`} />
          <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-4'}`} />
          <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${open ? 'w-5 -rotate-45 -translate-y-[6.5px]' : 'w-5'}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-bg/80 backdrop-blur-md" onClick={() => setOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 bg-surface border-l border-white/[0.07] flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-20" />
          <nav className="flex flex-col px-8 py-6 gap-1">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`text-left py-4 text-2xl font-serif text-white/80 hover:text-white border-b border-white/[0.06] transition-all duration-300 ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className={`px-8 mt-4 flex flex-col gap-3 transition-all duration-300 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: open ? '280ms' : '0ms' }}>
            {user ? (
              <>
                <Link href="/" onClick={() => setOpen(false)}
                  className="block w-full bg-accent text-bg text-center font-medium py-3.5 rounded-full hover:opacity-90 transition-opacity">
                  Mi biblioteca
                </Link>
                <Link href="/perfil" onClick={() => setOpen(false)}
                  className="block w-full text-center text-sm text-muted hover:text-white transition-colors py-2">
                  Mi perfil
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setOpen(false)}
                    className="block w-full text-center text-sm py-2" style={{ color: '#f0a8a8' }}>
                    Panel admin
                  </Link>
                )}
                <Link href="/auth/signout" onClick={() => setOpen(false)}
                  className="block w-full text-center text-sm text-muted hover:text-red-400 transition-colors py-2">
                  Cerrar sesión
                </Link>
              </>
            ) : (
              <>
                <Link href="/registro" onClick={() => setOpen(false)}
                  className="block w-full bg-accent text-bg text-center font-medium py-3.5 rounded-full hover:opacity-90 transition-opacity">
                  Empezar gratis
                </Link>
                <Link href="/login" onClick={() => setOpen(false)}
                  className="block w-full text-center text-sm text-muted hover:text-white transition-colors py-2">
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
          <div className={`px-8 mt-auto mb-12 transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: open ? '320ms' : '0ms' }}>
            <p className="text-xs text-muted leading-relaxed">
              Dr. Rogelio González<br />
              Médico Clínico Cirujano<br />
              Hospital Militar Central · Argentina
            </p>
          </div>
        </div>
      </div>
    </>
  )
}