import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminPanel from './AdminPanel'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'solangegf@gmail.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  // Usar admin client para saltear RLS
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Traer todos los usuarios con sus suscripciones usando admin client
  const { data: users } = await adminClient
    .from('profiles')
    .select(`
      id,
      full_name,
      created_at,
      subscriptions (
        status,
        provider,
        currency,
        current_period_end
      )
    `)
    .order('created_at', { ascending: false })

  // Traer emails de auth.users
  const { data: authUsers } = await adminClient.auth.admin.listUsers()

  // Combinar profiles con emails
  const usersWithEmail = (users || []).map((profile) => {
    const authUser = authUsers?.users?.find((u) => u.id === profile.id)
    return {
      ...profile,
      email: authUser?.email || 'Sin email',
      last_sign_in: authUser?.last_sign_in_at ?? null,
      provider: authUser?.app_metadata?.provider || 'email',
    }
  })

  // DEBUG — borrá esto después
  console.log('users count:', users?.length)
  console.log('authUsers count:', authUsers?.users?.length)
  console.log('service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)


  return <AdminPanel users={usersWithEmail} />
}