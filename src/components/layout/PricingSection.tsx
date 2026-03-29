'use client'

import { useState } from 'react'

const plansARS = [
  {
    name: 'Gratis', price: '$0', period: 'para siempre',
    features: ['3 playlists de muestra', 'Las 5 ondas explicadas', 'Artículos del blog'],
    locked: ['Biblioteca completa', 'Protocolos del Dr.'],
    cta: 'Empezar gratis', featured: false,
  },
  {
    name: 'Pro mensual', price: '$4.999', period: '/ mes ARS',
    features: ['Todo lo gratuito', 'Biblioteca completa', 'Protocolos del Dr. González', 'Bibliografía científica', 'Novedades primero'],
    locked: [],
    cta: 'Suscribirse con MercadoPago', featured: true,
  },
  {
    name: 'Pro anual', price: '$41.990', period: '/ año ARS · 34% off',
    features: ['Todo lo de Pro', 'Acceso anticipado', 'PDF bibliografía completa', 'Soporte prioritario'],
    locked: [],
    cta: 'Suscribirse anual', featured: false,
  },
]

const plansUSD = [
  {
    name: 'Free', price: '$0', period: 'forever',
    features: ['3 sample playlists', 'All 5 waves explained', 'Blog articles'],
    locked: ['Full library', 'Dr. protocols'],
    cta: 'Start free', featured: false,
  },
  {
    name: 'Pro monthly', price: '$9', period: '/ month USD',
    features: ['Everything in Free', 'Full playlist library', 'Dr. González protocols', 'Full bibliography', 'New content first'],
    locked: [],
    cta: 'Subscribe with PayPal', featured: true,
  },
  {
    name: 'Pro yearly', price: '$79', period: '/ year USD · 34% off',
    features: ['Everything in Pro', 'Early access', 'Full bibliography PDF', 'Priority support'],
    locked: [],
    cta: 'Subscribe yearly', featured: false,
  },
]

export default function PricingSection() {
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS')
  const plans = currency === 'ARS' ? plansARS : plansUSD

  return (
    <section id="precios" className="max-w-5xl mx-auto px-12 py-24 text-center">
      <p className="text-xs tracking-widest uppercase text-accent mb-4">Planes</p>
      <h2 className="font-serif text-5xl leading-tight tracking-tight mb-4">
        Simple y <em className="text-accent">transparente</em>
      </h2>
      <p className="text-muted mb-8">Sin trucos. Sin publicidad. Solo ciencia del sonido.</p>

      {/* Currency toggle */}
    <div className="inline-flex flex-wrap gap-1 bg-surface border border-white/[0.07] rounded-full p-1 mb-8 md:mb-12">
        {(['ARS', 'USD'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              currency === c
                ? 'bg-accent text-bg'
                : 'text-muted hover:text-white'
            }`}
          >
            {c === 'ARS' ? '🇦🇷 ARS — MercadoPago' : '🌐 USD — PayPal'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl p-8 text-left border transition-colors ${
              plan.featured
                ? 'bg-surface2 border-accent/25 scale-105'
                : 'bg-surface border-white/[0.07] hover:border-white/15'
            }`}
          >
            {plan.featured && (
              <span className="inline-block bg-accent/10 text-accent border border-accent/20 text-xs rounded-full px-3 py-1 mb-4">
                Más popular
              </span>
            )}

            <p className="text-xs tracking-widest uppercase text-muted mb-3">{plan.name}</p>
            <p className="font-serif text-5xl mb-1">{plan.price}</p>
            <p className="text-xs text-muted mb-6">{plan.period}</p>

            <hr className="border-white/[0.07] mb-6" />

            <ul className="flex flex-col gap-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <span className="w-4 h-4 rounded-full bg-accent/15 border border-accent/30 flex-shrink-0" />
                  {plan.featured ? <span>{f}</span> : <span className="text-muted">{f}</span>}
                </li>
              ))}
              {plan.locked?.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-muted/40 line-through">
                  <span className="w-4 h-4 rounded-full bg-white/5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-full text-sm font-medium transition-all ${
                plan.featured
                  ? 'bg-accent text-bg hover:opacity-90'
                  : 'border border-white/10 hover:border-white/25 text-white'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
