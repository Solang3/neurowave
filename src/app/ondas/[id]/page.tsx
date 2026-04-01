import { notFound } from 'next/navigation'
import Link from 'next/link'
import { WAVES_SCIENCE, GENERAL_MECHANISM } from '@/lib/waves-science'
import { WAVES } from '@/lib/waves'

// Genera las 5 páginas estáticas en build time
export async function generateStaticParams() {
  return WAVES_SCIENCE.map((w) => ({ id: w.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wave = WAVES_SCIENCE.find((w) => w.id === id)
  if (!wave) return {}
  return {
    title: `Ondas ${wave.name} (${wave.freqRange}) — NeuroWave`,
    description: wave.tagline,
  }
}

export default async function WavePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wave = WAVES_SCIENCE.find((w) => w.id === id)
  if (!wave) notFound()

  const waveIndex = WAVES_SCIENCE.findIndex((w) => w.id === id)
  const prev = WAVES_SCIENCE[waveIndex - 1]
  const next = WAVES_SCIENCE[waveIndex + 1]

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="border-b border-white/[0.07] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl">
          Neuro<span className="text-accent">Wave</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-muted hover:text-white transition-colors">
            ← Mi biblioteca
          </Link>
          <Link href="/#ondas" className="text-sm text-muted hover:text-white transition-colors">
            Todas las ondas
          </Link>
        </div>
      </nav>

      {/* Hero de la onda */}
      <div className="border-b border-white/[0.07]" style={{ borderTopColor: wave.color, borderTopWidth: 3 }}>
        <div className="max-w-4xl mx-auto px-8 py-16">
          <p className="text-xs tracking-widest uppercase mb-3 font-medium" style={{ color: wave.color }}>
            {wave.freqRange}
          </p>
          <h1 className="font-serif text-6xl tracking-tight mb-4" style={{ color: wave.color }}>
            {wave.name}
          </h1>
          <p className="text-xl text-muted max-w-2xl">{wave.tagline}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-16 space-y-16">

        {/* Mecanismo */}
        <section>
          <h2 className="font-serif text-3xl mb-6">¿Cómo funciona?</h2>
          <p className="text-muted leading-relaxed text-lg">{wave.mechanism}</p>
        </section>

        {/* Descripción */}
        <section className="bg-surface border border-white/[0.07] rounded-2xl p-8">
          <p className="text-muted leading-relaxed">{wave.description}</p>
        </section>

        {/* Efectos documentados */}
        <section>
          <h2 className="font-serif text-3xl mb-8">Efectos documentados</h2>
          <div className="grid grid-cols-1 gap-6">
            {wave.effects.map((effect, i) => (
              <div
                key={i}
                className="border border-white/[0.07] rounded-2xl p-6 hover:border-white/[0.12] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-medium mt-0.5"
                    style={{ background: `${wave.color}18`, color: wave.color }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">{effect.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{effect.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nivel de evidencia */}
        <section className="grid grid-cols-2 gap-6">
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-6">
            <p className="text-xs tracking-widest uppercase text-blue-400 mb-3 font-medium">
              Nivel de evidencia
            </p>
            <p className="text-sm text-muted leading-relaxed">{wave.evidence}</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-6">
            <p className="text-xs tracking-widest uppercase text-amber-400 mb-3 font-medium">
              Tener en cuenta
            </p>
            <p className="text-sm text-muted leading-relaxed">{wave.caution}</p>
          </div>
        </section>

        {/* Cómo funciona en general */}
        <section className="bg-surface border border-white/[0.07] rounded-2xl p-8">
          <h2 className="font-serif text-2xl mb-4">El mecanismo general</h2>
          <p className="text-muted text-sm leading-relaxed mb-4">{GENERAL_MECHANISM.explanation}</p>
          <div className="flex items-start gap-3 bg-white/[0.03] rounded-xl p-4 border border-white/[0.07]">
            <span className="text-base flex-shrink-0">🎧</span>
            <p className="text-xs text-muted leading-relaxed">{GENERAL_MECHANISM.requirement}</p>
          </div>
        </section>

        {/* Bibliografía */}
        <section>
          <h2 className="font-serif text-3xl mb-8">Bibliografía</h2>
          <div className="space-y-4">
            {wave.bibliography.map((ref, i) => (
              <div
                key={i}
                className="border border-white/[0.07] rounded-xl p-5 hover:border-white/[0.12] transition-colors"
              >
                <p className="text-sm font-medium mb-1">
                  {ref.authors} ({ref.year})
                </p>
                <p className="text-sm text-muted italic mb-2">{ref.title}</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <span
                    className="text-xs rounded-full px-3 py-1"
                    style={{ background: `${wave.color}12`, color: wave.color }}
                  >
                    {ref.journal}
                  </span>
                  <span className="text-xs text-muted">DOI: {ref.doi}</span>
                  {ref.pubmedUrl && (
                    <a
                      href={ref.pubmedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline"
                    >
                      Ver en PubMed →
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Referencia general siempre al final */}
            <div className="border border-white/[0.04] rounded-xl p-5 opacity-60">
              <p className="text-sm font-medium mb-1">
                {GENERAL_MECHANISM.generalRef.authors} ({GENERAL_MECHANISM.generalRef.year})
              </p>
              <p className="text-sm text-muted italic mb-2">
                {GENERAL_MECHANISM.generalRef.title}
              </p>
              <span className="text-xs text-muted">{GENERAL_MECHANISM.generalRef.journal}</span>
            </div>
          </div>
        </section>

        {/* Aviso legal */}
        <div className="border border-white/[0.07] rounded-xl p-5">
          <p className="text-xs text-muted leading-relaxed">
            <strong className="text-white/50 font-medium">Aviso:</strong> El contenido de esta
            página tiene fines informativos. No constituye consejo médico ni prescripción. Si
            tomás medicación, consultá a tu médico antes de realizar cualquier modificación en
            tu tratamiento.
          </p>
        </div>

        {/* Navegación entre ondas */}
        <div className="flex justify-between pt-8 border-t border-white/[0.07]">
          {prev ? (
            <Link
              href={`/ondas/${prev.id}`}
              className="flex items-center gap-3 group"
            >
              <span className="text-muted group-hover:text-white transition-colors">←</span>
              <div>
                <p className="text-xs text-muted">Anterior</p>
                <p className="font-serif text-lg" style={{ color: prev.color }}>
                  {prev.name}
                </p>
              </div>
            </Link>
          ) : <div />}

          {next ? (
            <Link
              href={`/ondas/${next.id}`}
              className="flex items-center gap-3 group text-right"
            >
              <div>
                <p className="text-xs text-muted">Siguiente</p>
                <p className="font-serif text-lg" style={{ color: next.color }}>
                  {next.name}
                </p>
              </div>
              <span className="text-muted group-hover:text-white transition-colors">→</span>
            </Link>
          ) : <div />}
        </div>

      </div>
    </div>
  )
}
