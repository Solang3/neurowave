import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminPanel from './AdminPanel'

const ADMIN_EMAIL = 'solangegf@gmail.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) redirect('/')

  // Traer todos los usuarios con sus suscripciones
  const { data: users } = await supabase
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

  // Traer emails de auth.users via admin
  const { data: authUsers } = await supabase.auth.admin.listUsers()

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

  return <AdminPanel users={usersWithEmail} />
}