import Hero from '@/components/layout/Hero'
import WavesSection from '@/components/waves/WavesSection'
import DoctorSection from '@/components/layout/DoctorSection'
import PlaylistsSection from '@/components/layout/PlaylistsSection'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user ? await supabase
    .from('profiles')
    .select('full_name, username, avatar_url, role')
    .eq('id', user.id)
    .maybeSingle() : { data: null }

  const navUser = user ? {
    email: user.email!,
    fullName: profile?.full_name,
    username: profile?.username,
    avatarUrl: profile?.avatar_url,
    role: profile?.role,
  } : null

  return (
    <>
      <Navbar user={navUser} />
      <main>
        <Hero />
        <WavesSection />
        <DoctorSection />
        <PlaylistsSection />
      </main>
      <Footer />
    </>
  )
}