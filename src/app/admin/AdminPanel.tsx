'use client'

import { useState } from 'react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  full_name: string | null
  created_at: string
  last_sign_in: string | null
  provider: string
  subscriptions?: {
    status: string
    provider: string
    currency: string
    current_period_end: string | null
  }[] | null
}

export default function AdminPanel({ users }: { users: User[] }) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [localUsers, setLocalUsers] = useState(users)

  const totalUsers = localUsers.length
  const proUsers = localUsers.filter((u) => u.subscriptions?.[0]?.status === 'pro').length
  const freeUsers = totalUsers - proUsers

  async function togglePro(userId: string, currentStatus: string) {
    setUpdating(userId)
    const newStatus = currentStatus === 'pro' ? 'free' : 'pro'

    try {
      const res = await fetch('/api/admin/toggle-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus }),
      })

      if (res.ok) {
        setLocalUsers((prev) =>
          prev.map((u) => {
            if (u.id !== userId) return u
            return {
              ...u,
              subscriptions: [{
                status: newStatus,
                provider: 'manual',
                currency: 'ARS',
                current_period_end: null,
              }],
            }
          })
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  function formatDate(date: string | null) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-white/[0.07] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl">
          Neuro<span className="text-accent">Wave</span>
        </Link>
        <span className="text-xs text-accent border border-accent/20 px-3 py-1 rounded-full">
          Admin
        </span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-accent mb-2">Panel de administración</p>
          <h1 className="font-serif text-4xl mb-6">Usuarios</h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Total usuarios', value: totalUsers, color: 'text-white' },
              { label: 'Plan Pro', value: proUsers, color: 'text-accent' },
              { label: 'Plan Free', value: freeUsers, color: 'text-muted' },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface border border-white/[0.07] rounded-2xl p-5">
                <p className="text-xs text-muted mb-1">{stat.label}</p>
                <p className={`font-serif text-3xl ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="bg-surface border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/[0.07] text-xs text-muted uppercase tracking-widest">
            <span>Usuario</span>
            <span>Registro</span>
            <span>Último login</span>
            <span>Provider</span>
            <span>Plan</span>
          </div>

          {localUsers.length === 0 && (
            <div className="px-6 py-12 text-center text-muted text-sm">
              No hay usuarios registrados todavía
            </div>
          )}

          {localUsers.map((user, i) => {
            const isPro = user.subscriptions?.[0]?.status === 'pro'
            const isUpdating = updating === user.id

            return (
              <div
                key={user.id}
                className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-4 items-center text-sm ${
                  i < localUsers.length - 1 ? 'border-b border-white/[0.04]' : ''
                }`}
              >
                {/* Email */}
                <div>
                  <p className="font-medium truncate">{user.email}</p>
                  {user.full_name && (
                    <p className="text-xs text-muted">{user.full_name}</p>
                  )}
                </div>

                {/* Fecha registro */}
                <span className="text-xs text-muted whitespace-nowrap">
                  {formatDate(user.created_at)}
                </span>

                {/* Último login */}
                <span className="text-xs text-muted whitespace-nowrap">
                  {formatDate(user.last_sign_in)}
                </span>

                {/* Provider */}
                <span className="text-xs text-muted capitalize">
                  {user.provider}
                </span>

                {/* Switch Pro/Free */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${isPro ? 'text-accent' : 'text-muted'}`}>
                    {isPro ? 'Pro' : 'Free'}
                  </span>
                  <button
                    onClick={() => togglePro(user.id, isPro ? 'pro' : 'free')}
                    disabled={isUpdating}
                    className={`relative w-10 h-5 rounded-full transition-all duration-200 disabled:opacity-50 ${
                      isPro ? 'bg-accent' : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                        isPro ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-muted text-center mt-6">
          Los cambios de plan manual son inmediatos y no generan cobro.
        </p>
      </div>
    </div>
  )
}