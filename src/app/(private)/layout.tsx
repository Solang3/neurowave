import { createClient } from '@/lib/supabase/server'
import { AudioProvider } from '@/context/AudioContext'
import MiniPlayer from '@/context/MiniPlayer'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <AudioProvider loggedIn={!!user}>
      {children}
      <MiniPlayer />
    </AudioProvider>
  )
}