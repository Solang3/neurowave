'use client'

import { useState } from 'react'
import Link from 'next/link'

interface UserMenuProps {
  user: {
    email: string
    fullName?: string | null
    username?: string | null
    avatarUrl?: string | null
    role?: string | null
  }
}

export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false)

  const initials = user.fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'
  const displayName = user.username ? `@${user.username}` : user.fullName || user.email?.split('@')[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
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
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-white/[0.07] rounded-2xl shadow-xl overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-white/[0.07]">
              <p className="text-sm font-medium truncate">{user.fullName || user.email?.split('@')[0]}</p>
              <p className="text-xs text-muted truncate">{user.email}</p>
            </div>
            <div className="p-1">
              <Link href="/perfil" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-white hover:bg-white/5 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Mi perfil
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-all"
                  style={{ color: '#f0a8a8' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Panel admin
                </Link>
              )}
            </div>
            <div className="p-1 border-t border-white/[0.07]">
              <Link href="/auth/signout" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-red-400 hover:bg-red-500/5 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar sesión
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
