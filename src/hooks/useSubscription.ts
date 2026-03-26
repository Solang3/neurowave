'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SubscriptionStatus } from '@/types'

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single()

      setStatus((data?.status as SubscriptionStatus) ?? 'free')
      setLoading(false)
    }

    load()
  }, [])

  return { status, loading, isPro: status === 'pro' }
}
