import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'BinaWave — Ciencia del sonido para tu mente',
  description:
    'Ondas binaurales curadas por el Dr. Rogelio González, Médico Clínico Cirujano con más de 40 años de trayectoria. Respaldadas por bibliografía científica.',
  keywords: ['ondas binaurales', 'binaural beats', 'sueño', 'ansiedad', 'meditación', 'neurociencia'],
  openGraph: {
    title: 'BinaWave',
    description: 'Ciencia del sonido para tu mente',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body className="bg-bg text-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
