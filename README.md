# NeuroWave 🎵

Plataforma de ondas binaurales curadas por el Dr. Rogelio González — Médico Clínico Cirujano con +40 años de trayectoria en el Hospital Militar Central, Argentina.

## Stack

- **Next.js 14** — frontend + API routes
- **Supabase** — auth, base de datos, storage de audio
- **MercadoPago** — suscripciones en ARS para Argentina/Latam
- **PayPal** — suscripciones en USD para el resto del mundo
- **Vercel** — hosting y deploy automático
- **Tailwind CSS** — estilos

---

## Setup local

### 1. Cloná el repo

```bash
git clone https://github.com/TU_USUARIO/neurowave.git
cd neurowave
```

### 2. Instalá dependencias

```bash
npm install
```

### 3. Configurá las variables de entorno

```bash
cp .env.example .env.local
```

Completá `.env.local` con tus claves:

- **Supabase**: creá un proyecto en [supabase.com](https://supabase.com) y copiá la URL y las API keys
- **MercadoPago**: creá una app en [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers)
- **PayPal**: creá una app en [developer.paypal.com](https://developer.paypal.com)

### 4. Configurá la base de datos

En el SQL Editor de tu proyecto de Supabase, ejecutá el contenido de `supabase-schema.sql`.

### 5. Corré el servidor

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

---

## Deploy en Vercel

1. Pusheá el código a GitHub
2. Importá el repo en [vercel.com](https://vercel.com)
3. Agregá todas las variables de entorno de `.env.example` en el panel de Vercel
4. Deploy automático en cada push a `main`

---

## Estructura del proyecto

```
src/
├── app/
│   ├── (public)/          # Páginas públicas (landing)
│   ├── (private)/         # Zona privada (requiere login)
│   │   ├── dashboard/     # Panel del usuario
│   │   └── playlists/     # Reproductor
│   ├── api/
│   │   ├── webhooks/
│   │   │   ├── mercadopago/   # Recibe eventos de MP
│   │   │   └── paypal/        # Recibe eventos de PayPal
│   │   └── subscription/      # Crear/cancelar suscripción
│   ├── layout.tsx
│   └── page.tsx           # Landing page
├── components/
│   ├── layout/            # Navbar, Hero, Footer, secciones
│   ├── waves/             # Cards de ondas
│   ├── player/            # Reproductor de audio
│   └── ui/                # Botones, badges, etc.
├── lib/
│   ├── supabase/          # Clientes browser y server
│   ├── waves.ts           # Data de las 5 ondas
│   └── pricing.ts         # Planes ARS y USD
├── hooks/
│   └── useSubscription.ts # Estado del plan del usuario
└── types/
    └── index.ts           # Tipos TypeScript globales
```

---

## Aviso legal

Este sitio comparte información científica y la experiencia personal del Dr. González. No constituye consejo médico ni prescripción. Consultá a tu médico ante cualquier cambio en tu tratamiento.
