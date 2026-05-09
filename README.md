# 🚀 Filbert Matthew — 3D Portfolio Website

A **fullstack, immersive 3D portfolio** built with React, Three.js, Node.js, and PostgreSQL. Features a cinematic dark-themed UI with galaxy particle effects, interactive skill constellations, holographic project displays, and multi-language support.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-6366f1?style=for-the-badge&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r160-white?style=flat-square&logo=threedotjs)](https://threejs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌌 **3D Hero Scene** | Galaxy spiral particles + floating crystalline geometries with iridescent materials |
| 🔮 **Skills Constellation** | Interactive 3D node graph — hover to light up each skill |
| 🃏 **Holographic Projects** | Translucent holographic card display for project showcase |
| 📬 **Contact Scene** | Animated wave mesh + floating envelope 3D background |
| 🌐 **i18n** | Full English & Bahasa Indonesia support |
| 🗄️ **Database-Driven** | Projects, skills, experience pulled from PostgreSQL (Neon) |
| 🔐 **Admin Panel** | JWT-authenticated dashboard for content management |
| 📱 **Responsive** | Optimized for desktop, tablet, and mobile |
| ⚡ **Blazing Fast** | Vite + lazy-loaded Three.js scenes |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — UI framework
- **Vite 5** — Build tool
- **Three.js r160** — 3D engine
- **@react-three/fiber** — React renderer for Three.js
- **@react-three/drei** — Three.js helpers (Stars, Float, Html, MeshDistortMaterial…)
- **Framer Motion** — Page & element animations
- **Tailwind CSS** — Utility-first styling
- **i18next** — Internationalization
- **React Router v6** — Client-side routing

### Backend
- **Node.js + Express.js** — REST API
- **PostgreSQL (Neon)** — Serverless Postgres database
- **JWT + bcrypt** — Authentication

### Infrastructure
- **Vercel** — Frontend hosting + Serverless functions
- **Neon** — Serverless PostgreSQL

---

## 📦 Project Structure

```
filbert-matthew-portfolio/
├── client/                     # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Layout/         # Navbar, Footer
│       │   ├── UI/             # LoadingSpinner, etc.
│       │   └── three/          # All Three.js scenes
│       │       ├── HeroScene.jsx       # Galaxy hero background
│       │       ├── ParticleField.jsx   # Spiral particle system
│       │       ├── FloatingGeometry.jsx # Crystalline 3D shapes
│       │       ├── GridFloor.jsx       # Animated grid + rings
│       │       ├── SkillsScene.jsx     # Interactive constellation
│       │       ├── ProjectsScene.jsx   # Holographic cards scene
│       │       └── ContactScene.jsx    # Wave mesh + envelopes
│       ├── contexts/           # React contexts (Language, etc.)
│       ├── i18n/               # Translation files (en, id)
│       ├── pages/              # Page components
│       │   ├── Home.jsx
│       │   ├── About.jsx
│       │   ├── Projects.jsx
│       │   ├── ProjectDetail.jsx
│       │   ├── Contact.jsx
│       │   └── Login.jsx
│       └── services/           # Axios API services
├── server/                     # Express.js backend
│   └── src/
│       ├── db/                 # Database config & migrations
│       ├── middleware/         # Auth middleware
│       └── routes/             # API routes
├── api/                        # Vercel serverless entry
│   └── index.js
├── vercel.json                 # Vercel routing config
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A PostgreSQL database (or free [Neon](https://neon.tech) account)

### 1. Clone & Install

```bash
git clone https://github.com/HotIce3/Portofolio.git
cd Portofolio
npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Run Database Migrations

```bash
# From project root
npm run db:migrate
npm run db:seed
```

### 4. Start Development Servers

```bash
npm run dev
```

This starts:
- 🎨 Frontend: [http://localhost:5173](http://localhost:5173)
- 🔌 Backend: [http://localhost:5000](http://localhost:5000)

---

## 🌐 Deployment (Vercel + Neon)

### Step 1: Neon Database

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a project and copy the connection string

### Step 2: Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel dashboard
3. Set these environment variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon connection string |
| `JWT_SECRET` | Random secure string |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | Your Vercel domain |

4. Build command: `npm run vercel-build`  
   Output directory: `dist`

---

## 📡 API Reference

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/profile` | Get profile info |
| `GET` | `/api/projects` | List all projects |
| `GET` | `/api/projects/slug/:slug` | Get project by slug |
| `POST` | `/api/contact` | Submit contact form |

### Protected (Admin)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login |
| `GET` | `/api/auth/me` | Current user info |
| `GET` | `/api/admin/stats` | Dashboard statistics |
| `CRUD` | `/api/admin/skills` | Manage skills |
| `CRUD` | `/api/admin/experiences` | Manage experiences |
| `CRUD` | `/api/admin/education` | Manage education |

---

## 🎨 3D Scene Overview

### Hero Scene
Galaxy-inspired **spiral particle field** (2,000+ particles) with mouse parallax, animated crystalline icosahedra, wobble tori, energy orbs, radial grid rings, and deep-space stars via `@react-three/drei`.

### Skills Constellation
12 interactive **dodecahedron nodes** connected by distance-based line beams. Each node has iridescent material, orbit ring on hover, and glows with colored point lights. Central **nexus** orb with triple-orbit rings.

### Projects Scene
**Holographic UI cards** with edge light lines + translucent glass body. Central distortion orb with 3 orbiting energy rings and floating data particles.

### Contact Scene
Animated **wave-distortion plane** mesh + floating envelope objects with glass materials.

---

## 🌏 Localization

Edit `client/src/i18n/locales/`:
- `en.json` — English
- `id.json` — Bahasa Indonesia

---

## 👤 Author

**Filbert Matthew**

- 📧 [filbertmathew63@gmail.com](mailto:filbertmathew63@gmail.com)
- 🐙 [github.com/HotIce3](https://github.com/HotIce3/)
- 💼 [linkedin.com/in/fil-mat-b21958337](https://www.linkedin.com/in/fil-mat-b21958337/)

---

## 📄 License

MIT License — feel free to use as a template for your own portfolio!

---

<div align="center">Made with ❤️ + Three.js by Filbert Matthew</div>
