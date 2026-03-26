// ==========================================
// NEUROWAVE — Tipos globales
// ==========================================

export type WaveType = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'

export interface Wave {
  id: WaveType
  name: string
  freqRange: string
  hz: [number, number]
  color: string
  description: string
  benefits: string[]
  useCase: string
}

export interface Track {
  id: string
  title: string
  wave: WaveType
  duration: number      // segundos
  audioUrl: string      // URL de Supabase Storage
  isPro: boolean
  playCount?: number
  createdAt: string
}

export interface Playlist {
  id: string
  title: string
  description: string
  wave: WaveType
  useCase: string       // 'sueño' | 'ansiedad' | 'foco' | etc.
  tracks: Track[]
  isPro: boolean
  coverEmoji: string
}

export type SubscriptionStatus = 'free' | 'pro' | 'cancelled' | 'expired'
export type PaymentProvider = 'mercadopago' | 'paypal'
export type Currency = 'ARS' | 'USD'

export interface Subscription {
  id: string
  userId: string
  status: SubscriptionStatus
  provider: PaymentProvider
  currency: Currency
  planId: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
}

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  subscription?: Subscription
  createdAt: string
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  currency: Currency
  interval: 'month' | 'year'
  features: string[]
  isFeatured?: boolean
  savings?: string
  mpPlanId?: string
  paypalPlanId?: string
}
