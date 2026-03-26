export default function Footer() {
  return (
    <>
      <footer className="border-t border-white/[0.07] px-12 py-8 flex items-center justify-between">
        <div className="font-serif text-xl">
          Neuro<span className="text-accent">Wave</span>
        </div>
        <p className="text-xs text-muted">
          © 2025 NeuroWave · Información científica y experiencia personal · No reemplaza la consulta médica
        </p>
      </footer>

      {/* Legal disclaimer */}
      <div className="bg-surface border-t border-white/[0.07] px-12 py-5">
        <p className="text-[11px] text-muted max-w-2xl mx-auto text-center leading-relaxed">
          <strong className="text-white/50 font-medium">Aviso legal:</strong> El
          contenido de este sitio tiene fines informativos y refleja la experiencia
          personal de su autor. No constituye consejo médico, diagnóstico ni
          prescripción. Las ondas binaurales son un complemento de bienestar, no
          un tratamiento médico. Si estás bajo tratamiento farmacológico, consultá
          a tu médico antes de realizar cualquier modificación. Los efectos pueden
          variar según cada persona.
        </p>
      </div>
    </>
  )
}
