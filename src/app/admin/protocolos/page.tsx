import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import ProtocolosPanel from './ProtocolosPanel'

const ADMIN_EMAIL = 'solangegf@gmail.com'

export default async function ProtocolosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: playlists } = await adminClient
    .from('curated_playlists')
    .select('*')
    .order('created_at', { ascending: false })

  return <ProtocolosPanel playlists={playlists || []} />
}