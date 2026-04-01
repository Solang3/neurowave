'use client'

import { useState } from 'react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  full_name: string | null
  username: string | null
  created_at: string
  last_sign_in: string | null
  provider: string
  role: string | null
  subscriptions?: {
    status: string
    provider: string
    currency: string
    current_period_end: string | null
  }[] | null
}

export default function AdminPanel({ users }: { users: User[] }) {
  const [localUsers, setLocalUsers] = useState(users)
  const [updating, setUpdating] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const totalUsers = localUsers.length
  const proUsers = localUsers.filter((u) => u.subscriptions?.[0]?.status === 'pro').length
  const freeUsers = totalUsers - proUsers

  const filtered = localUsers.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  async function updateUser(userId: string, changes: { status?: string; role?: string; deleted?: boolean }) {
    setUpdating(userId)
    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...changes }),
      })

      if (res.ok) {
        if (changes.deleted) {
          setLocalUsers((prev) => prev.filter((u) => u.id !== userId))
        } else {
          setLocalUsers((prev) => prev.map((u) => {
            if (u.id !== userId) return u
            return {
              ...u,
              role: changes.role ?? u.role,
              subscriptions: changes.status ? [{
                status: changes.status,
                provider: 'manual',
                currency: 'ARS',
                current_period_end: null,
              }] : u.subscriptions,
            }
          }))
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  function formatDate(date: string | null) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const roleColors: Record<string, string> = {
    admin: '#f0a8a8',
    subscriber: '#a8f0c8',
    user: '#6b7580',
  }

  const roleLabels: Record<string, string> = {
    admin: 'Admin',
    subscriber: 'Suscriptor',
    user: 'Usuario',
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-white/[0.07] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl">
          Bina<span className="text-accent">Wave</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/foro" className="text-sm text-muted hover:text-white transition-colors">Foro</Link>
          <Link href="/admin/protocolos" className="text-sm text-muted hover:text-white transition-colors">
            Protocolos
          </Link>
          <span className="text-xs text-accent border border-accent/20 px-3 py-1 rounded-full">Admin</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase text-accent mb-2">Panel de administración</p>
          <h1 className="font-serif text-4xl mb-6">Usuarios</h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total usuarios', value: totalUsers, color: 'text-white' },
              { label: 'Suscriptores Pro', value: proUsers, color: 'text-accent' },
              { label: 'Plan Free', value: freeUsers, color: 'text-muted' },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface border border-white/[0.07] rounded-2xl p-5">
                <p className="text-xs text-muted mb-1">{stat.label}</p>
                <p className={`font-serif text-3xl ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Buscador */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por email, username o nombre..."
            className="w-full bg-surface border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors mb-6"
          />
        </div>

        {/* Tabla */}
        <div className="bg-surface border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/[0.07] text-xs text-muted uppercase tracking-widest">
            <span>Usuario</span>
            <span>Registro</span>
            <span>Rol</span>
            <span>Plan</span>
            <span>Acciones</span>
            <span>Borrar</span>
          </div>

          {filtered.length === 0 && (
            <div className="px-6 py-12 text-center text-muted text-sm">
              No hay usuarios que coincidan
            </div>
          )}

          {filtered.map((user, i) => {
            const isPro = user.subscriptions?.[0]?.status === 'pro'
            const isUpdating = updating === user.id
            const role = user.role || 'user'

            return (
              <div
                key={user.id}
                className={`grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-6 py-4 items-center text-sm ${
                  i < filtered.length - 1 ? 'border-b border-white/[0.04]' : ''
                }`}
              >
                {/* Info */}
                <div>
                  <p className="font-medium truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {user.username && <span className="text-xs text-muted">@{user.username}</span>}
                    {user.full_name && <span className="text-xs text-muted">{user.full_name}</span>}
                  </div>
                </div>

                {/* Fecha */}
                <span className="text-xs text-muted whitespace-nowrap">{formatDate(user.created_at)}</span>

                {/* Rol */}
                <select
                  value={role}
                  disabled={isUpdating}
                  onChange={(e) => updateUser(user.id, { role: e.target.value })}
                  className="text-xs px-2 py-1 rounded-lg border transition-all bg-bg disabled:opacity-50 cursor-pointer"
                  style={{ borderColor: `${roleColors[role]}40`, color: roleColors[role] }}
                >
                  <option value="user">Usuario</option>
                  <option value="subscriber">Suscriptor</option>
                  <option value="admin">Admin</option>
                </select>

                {/* Plan Pro switch */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${isPro ? 'text-accent' : 'text-muted'}`}>
                    {isPro ? 'Pro' : 'Free'}
                  </span>
                  <button
                    onClick={() => updateUser(user.id, { status: isPro ? 'free' : 'pro' })}
                    disabled={isUpdating}
                    className={`relative w-10 h-5 rounded-full transition-all duration-200 disabled:opacity-50 ${
                      isPro ? 'bg-accent' : 'bg-white/10'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                      isPro ? 'left-5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* Acciones — ver posts */}
                <Link
                  href={`/foro?user=${user.id}`}
                  className="text-xs text-muted hover:text-white transition-colors whitespace-nowrap"
                >
                  Ver posts
                </Link>

                {/* Borrar */}
                <button
                  onClick={() => {
                    if (confirm(`¿Borrar a ${user.email}? Esta acción no se puede deshacer.`)) {
                      updateUser(user.id, { deleted: true })
                    }
                  }}
                  disabled={isUpdating}
                  className="text-xs text-muted hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-muted text-center mt-6">
          Los cambios son inmediatos. El borrado es permanente.
        </p>
      </div>
    </div>
  )
}