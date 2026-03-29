import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // MP envía el tipo de notificación en body.type
    // Solo nos interesan los eventos de "payment" y "subscription"
    if (body.type === 'subscription_preapproval') {
      const subscriptionId = body.data?.id
      if (!subscriptionId) return NextResponse.json({ ok: true })

      // Consultá la API de MP para verificar el estado real
      const mpRes = await fetch(
        `https://api.mercadopago.com/preapproval/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      )
      const subscription = await mpRes.json()

      const supabase = await createClient()

      if (subscription.status === 'authorized') {
        // Activar suscripción en Supabase
        // El external_reference es el userId que mandamos al crear la suscripción
        const userId = subscription.external_reference

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          provider: 'mercadopago',
          provider_subscription_id: subscriptionId,
          status: 'pro',
          currency: 'ARS',
          current_period_end: subscription.next_payment_date,
          updated_at: new Date().toISOString(),
        })
      }

      if (subscription.status === 'cancelled' || subscription.status === 'paused') {
        const userId = subscription.external_reference
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('user_id', userId)
          .eq('provider', 'mercadopago')
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('MP webhook error:', err)
    return NextResponse.json({ error: 'webhook error' }, { status: 500 })
  }
}
