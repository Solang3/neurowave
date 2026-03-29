const playlists = [
  { emoji: '🌙', need: 'Para dormir',    title: 'Sueño profundo',     wave: 'Delta', freq: '0.5–4 Hz',   tracks: 8,  duration: 60,  isPro: false },
  { emoji: '🧘', need: 'Para la ansiedad', title: 'Calma profunda',   wave: 'Theta', freq: '4–8 Hz',    tracks: 6,  duration: 45,  isPro: false },
  { emoji: '📚', need: 'Para estudiar',  title: 'Foco sin estrés',    wave: 'Alpha', freq: '8–13 Hz',   tracks: 10, duration: 90,  isPro: true  },
  { emoji: '⚡', need: 'Para trabajar',  title: 'Deep work',          wave: 'Beta',  freq: '13–30 Hz',  tracks: 8,  duration: 80,  isPro: true  },
  { emoji: '🌿', need: 'Para meditar',   title: 'Meditación guiada',  wave: 'Theta', freq: '4–8 Hz',    tracks: 5,  duration: 50,  isPro: true  },
  { emoji: '🧠', need: 'Para aprender',  title: 'Máximo rendimiento', wave: 'Gamma', freq: '30–100 Hz', tracks: 6,  duration: 55,  isPro: true  },
]

const waveColors: Record<string, string> = {
  Delta: '#c4a8f0',
  Theta: '#a8f0c8',
  Alpha: '#7eb8f7',
  Beta:  '#f0e8a8',
  Gamma: '#f0a8a8',
}

const waveIconBg: Record<string, string> = {
  Delta: 'rgba(196,168,240,0.1)',
  Theta: 'rgba(168,240,200,0.1)',
  Alpha: 'rgba(126,184,247,0.1)',
  Beta:  'rgba(240,232,168,0.1)',
  Gamma: 'rgba(240,168,168,0.1)',
}

export default function PlaylistsSection() {
  return (
    <section id="playlists" className="bg-surface border-t border-white/[0.07] py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-12">
        <p className="text-xs tracking-widest uppercase text-accent mb-4">
          Playlists curadas
        </p>
        <h2 className="font-serif text-5xl leading-tight tracking-tight mb-4">
          Una lista para<br />
          <em className="text-accent">cada necesidad</em>
        </h2>
        <p className="text-muted max-w-lg mb-12">
          Seleccionadas por el Dr. González a partir de la evidencia disponible
          y su experiencia personal. No algoritmos.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
          {playlists.map((p) => (
            <div
              key={p.title}
              className="bg-bg border border-white/[0.07] hover:border-white/[0.12] hover:-translate-y-0.5 transition-all rounded-2xl p-6 flex flex-col gap-3 cursor-pointer"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: waveIconBg[p.wave] }}
              >
                {p.emoji}
              </div>

              <div>
                <p className="text-xs text-muted">{p.need}</p>
                <p className="font-medium mt-0.5">{p.title} · {p.wave}</p>
                <p className="text-xs mt-1" style={{ color: waveColors[p.wave] }}>
                  {p.freq} · {p.tracks} tracks · {p.duration} min
                </p>
              </div>

              <div className="mt-auto">
                {p.isPro ? (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-white/4 border border-white/[0.07] rounded-full px-2.5 py-1 text-muted">
                    🔒 Pro
                  </span>
                ) : (
                  <span className="text-xs text-accent">Gratis · 2 tracks disponibles</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
