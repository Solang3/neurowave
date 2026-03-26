import { PricingPlan } from '@/types'

// Precios en ARS (MercadoPago)
export const PLANS_ARS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    currency: 'ARS',
    interval: 'month',
    features: [
      '3 playlists de muestra',
      'Explicación de las 5 ondas',
      'Artículos del blog',
    ],
  },
  {
    id: 'pro-monthly-ars',
    name: 'Pro mensual',
    price: 4999,   // ARS — actualizá según inflación
    currency: 'ARS',
    interval: 'month',
    isFeatured: true,
    features: [
      'Todo lo gratuito',
      'Biblioteca completa de playlists',
      'Protocolos del Dr. González',
      'Bibliografía científica completa',
      'Novedades y nuevas ondas',
    ],
    mpPlanId: process.env.MP_PLAN_ID_MENSUAL,
  },
  {
    id: 'pro-yearly-ars',
    name: 'Pro anual',
    price: 41990,  // ARS — equivale a ~34% de descuento
    currency: 'ARS',
    interval: 'year',
    savings: '34% off',
    features: [
      'Todo lo de Pro mensual',
      'Acceso anticipado a contenido',
      'PDF de bibliografía completa',
      'Soporte prioritario',
    ],
    mpPlanId: process.env.MP_PLAN_ID_ANUAL,
  },
]

// Precios en USD (PayPal)
export const PLANS_USD: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '3 sample playlists',
      'All 5 waves explained',
      'Blog articles',
    ],
  },
  {
    id: 'pro-monthly-usd',
    name: 'Pro monthly',
    price: 9,
    currency: 'USD',
    interval: 'month',
    isFeatured: true,
    features: [
      'Everything in Free',
      'Full playlist library',
      'Dr. González protocols',
      'Full scientific bibliography',
      'New content first',
    ],
    paypalPlanId: process.env.PAYPAL_PLAN_ID_MENSUAL,
  },
  {
    id: 'pro-yearly-usd',
    name: 'Pro yearly',
    price: 79,
    currency: 'USD',
    interval: 'year',
    savings: '34% off',
    features: [
      'Everything in Pro monthly',
      'Early access to new content',
      'Full bibliography PDF',
      'Priority support',
    ],
    paypalPlanId: process.env.PAYPAL_PLAN_ID_ANUAL,
  },
]
