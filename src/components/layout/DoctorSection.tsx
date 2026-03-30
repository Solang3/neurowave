export default function DoctorSection() {
  return (
    <section id="ciencia" className="bg-surface border-y border-white/[0.07] py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

        {/* Card */}
        <div className="relative">
          <div className="bg-surface2 border border-white/[0.07] rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-accent/5" />

            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a3a2a] to-[#2a4a3a] border-2 border-accent/30 flex items-center justify-center font-serif text-accent text-2xl mb-6">
              R
            </div>

            <blockquote className="font-serif text-lg leading-relaxed italic mb-6">
              "Usé benzodiazepinas durante años para poder descansar. Empecé a explorar las ondas binaurales, leí la evidencia disponible, y en pocas semanas pude dejarlas. Comparto esto como mi experiencia personal, no como indicación médica."
            </blockquote>

            <p className="font-medium text-sm">Dr. Rogelio González</p>
            <p className="text-xs text-muted mt-1">
              Médico Clínico Cirujano · +40 años de trayectoria
              <br />
              Hospital Militar Central · Argentina
            </p>
          </div>

          <div className="absolute -bottom-4 right-8 bg-accent text-bg text-xs font-medium rounded-full px-4 py-2">
            Médico verificado
          </div>
        </div>

        {/* Text */}
        <div>
          <p className="text-xs tracking-widest uppercase text-accent mb-4">
            Quién está detrás
          </p>
          <h2 className="font-serif text-5xl leading-tight tracking-tight mb-6">
            Una historia real.<br />
            Una <em className="text-accent">ciencia real.</em>
          </h2>

          {/* Role: usuario */}
          <div className="border-l-2 border-white/10 hover:border-accent pl-4 mb-5 transition-colors">
            <p className="text-[11px] tracking-widest uppercase text-accent font-medium mb-1">
              Como usuario
            </p>
            <p className="text-muted text-sm leading-relaxed">
              El Dr. González conoce de cerca el impacto de las benzodiazepinas y 
              ansiolíticos — no solo desde la consulta, sino en primera persona. 
              Investigó la evidencia científica disponible y encontró en las ondas 
              binaurales una alternativa natural que cambió su descanso.
            </p>
          </div>

          {/* Role: médico */}
          <div className="border-l-2 border-white/10 hover:border-accent pl-4 mb-6 transition-colors">
            <p className="text-[11px] tracking-widest uppercase text-accent font-medium mb-1">
              Como médico
            </p>
            <p className="text-muted text-sm leading-relaxed">
              Con más de 40 años de trayectoria como Médico Clínico Cirujano en
              el Hospital Militar Central, revisó la literatura científica
              publicada y organizó el contenido de este sitio. No hace
              indicaciones aquí — comparte lo que la evidencia dice.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="flex gap-3 bg-blue-500/5 border border-blue-500/15 rounded-xl p-4">
            <span className="text-base mt-0.5">⚕</span>
            <p className="text-xs text-muted leading-relaxed">
              Este sitio comparte información científica y una experiencia
              personal.{' '}
              <strong className="text-white font-medium">
                No reemplaza la consulta médica.
              </strong>{' '}
              Si tomás medicación, hablá con tu médico antes de hacer cualquier
              cambio en tu tratamiento.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-8 pt-8 border-t border-white/[0.07]">
            {[
              { num: '47+', label: 'Estudios citados' },
              { num: '5', label: 'Tipos de ondas' },
              { num: '40+', label: 'Años de trayectoria' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-3xl text-accent">{s.num}</div>
                <div className="text-xs text-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
