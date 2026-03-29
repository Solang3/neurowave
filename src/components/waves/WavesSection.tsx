import { WAVES } from '@/lib/waves'
import WaveCard from './WaveCard'

export default function WavesSection() {
  return (
    <section id="ondas" className="max-w-6xl mx-auto px-4 md:px-12 py-16 md:py-24">
      <p className="text-xs tracking-widest uppercase text-accent mb-4">
        Las frecuencias
      </p>
      <h2 className="font-serif text-5xl leading-tight tracking-tight mb-4">
        Cinco ondas,<br />
        <em className="text-accent">cinco estados</em>
      </h2>
      <p className="text-muted max-w-lg mb-16">
        Cada frecuencia activa un estado cerebral distinto, documentado en la
        literatura científica internacional.
      </p>

    <div className="flex overflow-x-auto md:grid md:grid-cols-5 divide-x divide-white/[0.07] border border-white/[0.07] rounded-2xl">
        {WAVES.map((wave) => (
          <WaveCard key={wave.id} wave={wave} />
        ))}
      </div>
    </section>
  )
}
