import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminPanel from './AdminPanel'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'solangegf@gmail.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Traer profiles
  const { data: users } = await adminClient
    .from('profiles')
    .select('id, full_name, username, created_at, role')
    .order('created_at', { ascending: false })

  // Traer suscripciones por separado
  const { data: subscriptions } = await adminClient
    .from('subscriptions')
    .select('user_id, status, provider, currency, current_period_end')

  // Traer emails de auth.users
  const { data: authUsers } = await adminClient.auth.admin.listUsers()

  // Combinar todo
  const usersWithEmail = (users || []).map((profile) => {
    const authUser = authUsers?.users?.find((u) => u.id === profile.id)
    const subscription = subscriptions?.find((s) => s.user_id === profile.id)
    return {
      ...profile,
      email: authUser?.email || 'Sin email',
      last_sign_in: authUser?.last_sign_in_at ?? null,
      provider: authUser?.app_metadata?.provider || 'email',
      subscriptions: subscription ? [subscription] : [],
      role: profile.role || 'user',
    }
  })

  return <AdminPanel users={usersWithEmail} />
}