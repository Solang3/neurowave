import { Wave } from '@/types'

export const WAVES: Wave[] = [
  {
    id: 'delta',
    name: 'Delta',
    freqRange: '0.5 – 4 Hz',
    hz: [0.5, 4],
    color: '#c4a8f0',
    description:
      'Las ondas Delta son las más lentas del espectro. Predominan durante el sueño profundo sin sueños y están asociadas con la regeneración celular, la consolidación de la memoria implícita y la liberación de hormona de crecimiento.',
    benefits: [
      'Sueño profundo y reparador',
      'Reducción del cortisol',
      'Regeneración celular',
      'Apoyo en reducción de insomnio',
    ],
    useCase: 'Dormir',
  },
  {
    id: 'theta',
    name: 'Theta',
    freqRange: '4 – 8 Hz',
    hz: [4, 8],
    color: '#a8f0c8',
    description:
      'Las ondas Theta aparecen en estados de meditación profunda, creatividad intensa y en la transición entre la vigilia y el sueño. Están relacionadas con la reducción de la ansiedad y el acceso a estados de flujo.',
    benefits: [
      'Reducción de ansiedad',
      'Meditación profunda',
      'Creatividad aumentada',
      'Procesamiento emocional',
    ],
    useCase: 'Ansiedad y meditación',
  },
  {
    id: 'alpha',
    name: 'Alpha',
    freqRange: '8 – 13 Hz',
    hz: [8, 13],
    color: '#7eb8f7',
    description:
      'Las ondas Alpha caracterizan el estado de calma alerta: despierto pero relajado. Son el puente entre el pensamiento consciente y el subconsciente, y favorecen la absorción de información y la creatividad sin tensión.',
    benefits: [
      'Calma sin somnolencia',
      'Reducción del estrés',
      'Mejor absorción de información',
      'Estado de flujo suave',
    ],
    useCase: 'Relajación activa',
  },
  {
    id: 'beta',
    name: 'Beta',
    freqRange: '13 – 30 Hz',
    hz: [13, 30],
    color: '#f0e8a8',
    description:
      'Las ondas Beta dominan durante la vigilia activa, el pensamiento analítico y la resolución de problemas. Son las frecuencias del foco sostenido, la toma de decisiones y la alerta cognitiva.',
    benefits: [
      'Foco y concentración',
      'Pensamiento analítico',
      'Productividad sostenida',
      'Alerta cognitiva',
    ],
    useCase: 'Foco y trabajo',
  },
  {
    id: 'gamma',
    name: 'Gamma',
    freqRange: '30 – 100 Hz',
    hz: [30, 100],
    color: '#f0a8a8',
    description:
      'Las ondas Gamma son las más rápidas y están asociadas con el procesamiento cognitivo de alto nivel, la integración de información entre regiones cerebrales y los estados de conciencia expandida. Estudios recientes las vinculan con la memoria de trabajo y el aprendizaje acelerado.',
    benefits: [
      'Procesamiento cognitivo máximo',
      'Memoria de trabajo',
      'Aprendizaje acelerado',
      'Integración neuronal',
    ],
    useCase: 'Alto rendimiento',
  },
]

export const WAVE_MAP = Object.fromEntries(WAVES.map((w) => [w.id, w])) as Record<
  string,
  Wave
>
