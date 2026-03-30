import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'solangegf@gmail.com'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { userId, status } = await req.json()
  if (!userId || !status) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  // Usar admin client para saltear RLS
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await adminClient
    .from('subscriptions')
    .upsert({
      user_id: userId,
      status,
      provider: 'manual',
      currency: 'ARS',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, status })
}