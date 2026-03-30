import Hero from '@/components/layout/Hero'
import WavesSection from '@/components/waves/WavesSection'
import DoctorSection from '@/components/layout/DoctorSection'
import PlaylistsSection from '@/components/layout/PlaylistsSection'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
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
