import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'solangegf@gmail.com'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) return null
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const adminClient = await checkAdmin()
  if (!adminClient) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { data: playlist, error } = await adminClient
    .from('curated_playlists')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ playlist })
}

export async function PUT(req: NextRequest) {
  const adminClient = await checkAdmin()
  if (!adminClient) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id, ...body } = await req.json()
  const { data: playlist, error } = await adminClient
    .from('curated_playlists')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ playlist })
}

export async function PATCH(req: NextRequest) {
  const adminClient = await checkAdmin()
  if (!adminClient) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id, published } = await req.json()
  const { error } = await adminClient
    .from('curated_playlists')
    .update({ published })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const adminClient = await checkAdmin()
  if (!adminClient) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await req.json()
  const { error } = await adminClient
    .from('curated_playlists')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}