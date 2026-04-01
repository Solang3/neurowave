'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

const PLANS = {
  monthly: {
    label: 'Pro mensual',
    priceARS: '$4.999',
    priceUSD: '$9',
    periodARS: '/ mes',
    periodUSD: '/ month',
    savings: null,
  },
  yearly: {
    label: 'Pro anual',
    priceARS: '$41.990',
    priceUSD: '$79',
    periodARS: '/ año',
    periodUSD: '/ year',
    savings: '34% off',
  },
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = (searchParams.get('plan') as 'monthly' | 'yearly') || 'monthly'
  const plan = PLANS[planId]
  const [loading, setLoading] = useState<'mp' | 'paypal' | null>(null)

  async function handleMP() {
    setLoading('mp')
    try {
      const res = await fetch('/api/checkout/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const { init_point, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = init_point
    } catch {
      setLoading(null)
    }
  }

  async function handlePayPal() {
    setLoading('paypal')
    try {
      const res = await fetch('/api/checkout/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })
      const { approvalUrl, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = approvalUrl
    } catch {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4">
      <Link href="/" className="font-serif text-2xl mb-10">
        Neuro<span className="text-accent">Wave</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Plan seleccionado */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs tracking-widest uppercase text-accent font-medium">
              {plan.label}
            </p>
            {plan.savings && (
              <span className="text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                {plan.savings}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-4 mt-2">
            <div>
              <span className="font-serif text-3xl">{plan.priceARS}</span>
              <span className="text-xs text-muted ml-1">{plan.periodARS} ARS</span>
            </div>
            <span className="text-muted text-xs">·</span>
            <div>
              <span className="font-serif text-xl">{plan.priceUSD}</span>
              <span className="text-xs text-muted ml-1">{plan.periodUSD} USD</span>
            </div>
          </div>

          <button
            onClick={() => router.push(`/checkout?plan=${planId === 'monthly' ? 'yearly' : 'monthly'}`)}
            className="text-xs text-accent/70 hover:text-accent mt-3 transition-colors"
          >
            Cambiar a plan {planId === 'monthly' ? 'anual (34% off)' : 'mensual'} →
          </button>
        </div>

        {/* Métodos de pago */}
        <p className="text-xs text-muted text-center mb-5">Elegí cómo querés pagar</p>

        <div className="flex flex-col gap-3">
          {/* MercadoPago */}
          <button
            onClick={handleMP}
            disabled={loading !== null}
            className="w-full flex items-center gap-4 bg-surface border border-white/[0.07] hover:border-white/20 rounded-2xl p-5 transition-all disabled:opacity-50 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#009ee3]/10 flex items-center justify-center flex-shrink-0">
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                <path d="M14 0C6.268 0 0 4.477 0 10s6.268 10 14 10 14-4.477 14-10S21.732 0 14 0z" fill="#009ee3"/>
                <path d="M8 10c0-1.105.895-2 2-2h8c1.105 0 2 .895 2 2s-.895 2-2 2h-8c-1.105 0-2-.895-2-2z" fill="white"/>
              </svg>
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-sm">MercadoPago</p>
              <p className="text-xs text-muted">Pesos argentinos · Tarjetas · Cuotas</p>
            </div>
            <span className="text-xs text-muted group-hover:text-white transition-colors">
              {loading === 'mp' ? 'Redirigiendo...' : `${plan.priceARS} ARS →`}
            </span>
          </button>

          {/* PayPal */}
          <button
            onClick={handlePayPal}
            disabled={loading !== null}
            className="w-full flex items-center gap-4 bg-surface border border-white/[0.07] hover:border-white/20 rounded-2xl p-5 transition-all disabled:opacity-50 group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#003087]/10 flex items-center justify-center flex-shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7.076 21.337H4.082a.64.64 0 0 1-.632-.74L6.127 2.33a.641.641 0 0 1 .632-.54h6.117c2.896 0 4.93.925 5.546 2.978.24.81.246 1.594.044 2.353-.67 2.543-2.78 3.944-5.824 3.944H9.93l-1.146 6.923a.641.641 0 0 1-.633.54h-.075z" fill="#003087"/>
                <path d="M19.432 8.21c-.617 2.868-2.74 4.478-6.075 4.478h-2.24l-1.21 7.31h-2.8l1.87-11.87h4.457c2.28 0 3.894.636 4.47 2.014.24.572.307 1.226.157 1.853l.37-.785z" fill="#009cde"/>
              </svg>
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-sm">PayPal</p>
              <p className="text-xs text-muted">Dólares USD · Internacional</p>
            </div>
            <span className="text-xs text-muted group-hover:text-white transition-colors">
              {loading === 'paypal' ? 'Redirigiendo...' : `${plan.priceUSD} USD →`}
            </span>
          </button>
        </div>

        {/* Legal */}
        <p className="text-xs text-muted text-center mt-6 leading-relaxed">
          Podés cancelar en cualquier momento desde tu dashboard.
          Al continuar aceptás nuestros términos de uso.
        </p>

        <div className="flex items-center justify-center mt-4">
          <Link href="/" className="text-xs text-muted hover:text-white transition-colors">
            ← Volver al Mi biblioteca
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  )
}