import Hero from '@/components/layout/Hero'
import WavesSection from '@/components/waves/WavesSection'
import DoctorSection from '@/components/layout/DoctorSection'
import PlaylistsSection from '@/components/layout/PlaylistsSection'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <>
      <Navbar user={null} />
      <main>
        <Hero isLoggedIn={false} />
        <WavesSection />
        <DoctorSection />
        <PlaylistsSection />
      </main>
      <Footer />
    </>
  )
}