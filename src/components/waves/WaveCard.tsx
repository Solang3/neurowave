import Link from 'next/link'
import { Wave } from '@/types'

interface Props {
  wave: Wave
}

function WaveViz({ wave }: { wave: Wave }) {
  const paths: Record<string, string> = {
    delta: 'M0,20 C20,4 40,36 60,20 C80,4 100,36 120,20',
    theta: 'M0,20 C15,5 25,35 40,20 C55,5 65,35 80,20 C95,5 105,35 120,20',
    alpha: 'M0,20 C10,8 20,32 30,20 C40,8 50,32 60,20 C70,8 80,32 90,20 C100,8 110,32 120,20',
    beta:  'M0,20 C7,10 12,30 18,20 C24,10 30,30 36,20 C42,10 48,30 54,20 C60,10 66,30 72,20 C78,10 84,30 90,20 C96,10 102,30 108,20 C114,10 120,30 120,20',
    gamma: 'M0,20 C4,12 7,28 10,20 C13,12 16,28 20,20 C23,12 26,28 30,20 C33,12 36,28 40,20 C43,12 46,28 50,20 C53,12 56,28 60,20 C63,12 66,28 70,20 C73,12 76,28 80,20 C83,12 86,28 90,20 C93,12 96,28 100,20 C103,12 106,28 110,20 C113,12 116,28 120,20',
  }

  return (
    <svg viewBox="0 0 120 40" preserveAspectRatio="none" className="h-10 w-full my-4">
      <path d={paths[wave.id]} fill="none" stroke={wave.color} strokeWidth="1.5" opacity="0.7" />
    </svg>
  )
}

export default function WaveCard({ wave }: Props) {
  return (
    <Link
      href={`/ondas/${wave.id}`}
      className="bg-surface hover:bg-surface2 transition-colors p-6 relative group block min-w-[200px] md:min-w-0"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: wave.color }} />

      <p className="text-[11px] tracking-widest uppercase mb-3 font-medium" style={{ color: wave.color }}>
        {wave.freqRange}
      </p>

      <h3 className="font-serif text-2xl mb-1">{wave.name}</h3>

      <WaveViz wave={wave} />

      <p className="text-[13px] text-muted leading-relaxed mb-4">
        {wave.benefits[0]}. {wave.benefits[1]}.
      </p>

      <span
        className="inline-block text-xs rounded-full px-3 py-1"
        style={{ background: `${wave.color}18`, color: wave.color }}
      >
        {wave.useCase}
      </span>
    </Link>
  )
}