import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import MercadoPagoConfig, { PreApproval } from 'mercadopago'

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

const PLANS = {
  monthly: {
    reason: 'BinaWave Pro — Mensual',
    frequency: 1,
    frequency_type: 'months',
    transaction_amount: 4999,
  },
  yearly: {
    reason: 'BinaWave Pro — Anual',
    frequency: 12,
    frequency_type: 'months',
    transaction_amount: 41990,
  },
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
    const preapproval = new PreApproval(mp)
    const response = await preapproval.create({
      body: {
        reason: planData.reason,
        auto_recurring: {
          frequency: planData.frequency,
          frequency_type: planData.frequency_type as 'months',
          transaction_amount: planData.transaction_amount,
          currency_id: 'ARS',
        },
        payer_email: user.email!,
        back_url: `${appUrl}/?payment=success`,
        external_reference: user.id,
        status: 'pending',
      },
    })

    return NextResponse.json({ init_point: response.init_point })
  } catch (err) {
    console.error('MP error:', err)
    return NextResponse.json({ error: 'Error al crear suscripción' }, { status: 500 })
  }
}