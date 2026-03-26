import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function getPayPalAccessToken() {
  const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
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
  try {
    const body = await req.json()
    const eventType = body.event_type

    // Eventos de suscripción que nos importan
    const relevantEvents = [
      'BILLING.SUBSCRIPTION.ACTIVATED',
      'BILLING.SUBSCRIPTION.CANCELLED',
      'BILLING.SUBSCRIPTION.EXPIRED',
    ]

    if (!relevantEvents.includes(eventType)) {
      return NextResponse.json({ ok: true })
    }

    const subscriptionId = body.resource?.id
    if (!subscriptionId) return NextResponse.json({ ok: true })

    // Verificar el estado real con la API de PayPal
    const token = await getPayPalAccessToken()
    const ppRes = await fetch(
      `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const subscription = await ppRes.json()

    // El userId lo guardamos en custom_id al crear la suscripción
    const userId = subscription.custom_id
    if (!userId) return NextResponse.json({ ok: true })

    const supabase = createClient()

    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        provider: 'paypal',
        provider_subscription_id: subscriptionId,
        status: 'pro',
        currency: 'USD',
        current_period_end: subscription.billing_info?.next_billing_time,
        updated_at: new Date().toISOString(),
      })
    }

    if (
      eventType === 'BILLING.SUBSCRIPTION.CANCELLED' ||
      eventType === 'BILLING.SUBSCRIPTION.EXPIRED'
    ) {
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('provider', 'paypal')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PayPal webhook error:', err)
    return NextResponse.json({ error: 'webhook error' }, { status: 500 })
  }
}
