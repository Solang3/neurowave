'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const links = [
  { href: '#ondas', label: 'Las ondas' },
  { href: '#ciencia', label: 'Ciencia' },
  { href: '#playlists', label: 'Playlists' },
  { href: '/protocolos', label: 'Protocolos' },
  { href: '/foro', label: 'Foro' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
    setTimeout(() => {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${
        scrolled || open ? 'bg-bg/95 backdrop-blur-xl border-b border-white/[0.07]' : 'bg-transparent'
      }`}>
        <Link href="/" className="font-serif text-xl tracking-tight z-50" onClick={() => setOpen(false)}>
          Neuro<span className="text-accent">Wave</span>
        </Link>

        <ul className="hidden md:flex gap-10 list-none">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-muted hover:text-white transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted hover:text-white transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/registro"
            className="bg-accent text-bg text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-85 transition-opacity"
          >
            Empezar gratis
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${
            open ? 'w-5 rotate-45 translate-y-[6.5px]' : 'w-5'
          }`} />
          <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 ${
            open ? 'w-0 opacity-0' : 'w-4'
          }`} />
          <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${
            open ? 'w-5 -rotate-45 -translate-y-[6.5px]' : 'w-5'
          }`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-bg/80 backdrop-blur-md" onClick={() => setOpen(false)} />

        <div className={`absolute top-0 right-0 h-full w-72 bg-surface border-l border-white/[0.07] flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="h-20" />

          <nav className="flex flex-col px-8 py-6 gap-1">
            {links.map((l, i) => (
              <button
                key={l.href}
                onClick={() => closeAndScroll(l.href)}
                className={`text-left py-4 text-2xl font-serif text-white/80 hover:text-white border-b border-white/[0.06] transition-all duration-300 ${
                  open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
                style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className={`px-8 mt-4 flex flex-col gap-3 transition-all duration-300 ${
            open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: open ? '280ms' : '0ms' }}>
            <Link
              href="/registro"
              onClick={() => setOpen(false)}
              className="block w-full bg-accent text-bg text-center font-medium py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Empezar gratis
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-sm text-muted hover:text-white transition-colors py-2"
            >
              Iniciar sesión
            </Link>
          </div>

          <div className={`px-8 mt-auto mb-12 transition-all duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`} style={{ transitionDelay: open ? '320ms' : '0ms' }}>
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