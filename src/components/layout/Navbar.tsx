'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-5 bg-bg/80 backdrop-blur-xl border-b border-white/[0.07]">
      <Link href="/" className="font-serif text-xl tracking-tight">
        Neuro<span className="text-accent">Wave</span>
      </Link>

      <ul className="flex gap-10 list-none">
        {[
          { href: '#ondas', label: 'Las ondas' },
          { href: '#ciencia', label: 'Ciencia' },
          { href: '#playlists', label: 'Playlists' },
          { href: '#precios', label: 'Precios' },
        ].map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="text-sm text-muted hover:text-white transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <Link
        href="/dashboard"
        className="bg-accent text-bg text-sm font-medium px-6 py-2.5 rounded-full hover:opacity-85 transition-opacity"
      >
        Empezar gratis
      </Link>
    </nav>
  )
}
