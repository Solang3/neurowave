import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PAYPAL_API = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com'

const PLANS = {
  monthly: { price: '9.00', cycles: 0, interval: 'MONTH', label: 'NeuroWave Pro Monthly' },
  yearly:  { price: '79.00', cycles: 0, interval: 'YEAR', label: 'NeuroWave Pro Yearly' },
}

async function getAccessToken() {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  return data.access_token as string
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { plan } = await req.json()
  const planData = PLANS[plan as keyof typeof PLANS]
  if (!planData) return NextResponse.json({ error: 'Plan inválido' }, { status: 400 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://neurowave-sooty.vercel.app'

  try {
    const token = await getAccessToken()

    // Crear plan de suscripción
    const planRes = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: 'NEUROWAVE_PRO',
        name: planData.label,
        billing_cycles: [{
          frequency: { interval_unit: planData.interval, interval_count: 1 },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: planData.cycles,
          pricing_scheme: { fixed_price: { value: planData.price, currency_code: 'USD' } },
        }],
        payment_preferences: { auto_bill_outstanding: true },
      }),
    })
    const paypalPlan = await planRes.json()

    // Crear suscripción
    const subRes = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        plan_id: paypalPlan.id,
        custom_id: user.id,
        application_context: {
          return_url: `${appUrl}/?payment=success`,
          cancel_url: `${appUrl}/checkout?plan=${plan}`,
        },
      }),
    })
    const subscription = await subRes.json()

    const approvalUrl = subscription.links?.find((l: { rel: string }) => l.rel === 'approve')?.href
    return NextResponse.json({ approvalUrl })
  } catch (err) {
    console.error('PayPal error:', err)
    return NextResponse.json({ error: 'Error al crear suscripción' }, { status: 500 })
  }
}