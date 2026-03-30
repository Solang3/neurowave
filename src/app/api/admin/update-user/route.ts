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

  const { userId, status, role, deleted } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId requerido' }, { status: 400 })

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Borrar usuario
  if (deleted) {
    const { error } = await adminClient.auth.admin.deleteUser(userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Cambiar rol
  if (role) {
    const { error } = await adminClient
      .from('profiles')
      .update({ role })
      .eq('id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Cambiar plan Pro/Free
  if (status) {
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
  }

  return NextResponse.json({ ok: true })
}