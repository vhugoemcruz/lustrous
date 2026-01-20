<div align="center">

# LUSTROUS

**Web platform of utility tools for artists**, focused on illustration study through interactive visual resources — all processed locally in your browser, with no data sent to servers.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## Table of Contents

- [About](#about)
- [Available Tools](#available-tools)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [License](#license)

---

## About

**Lustrous** is a web platform of creative tools aimed at illustrators, art students, and beginners looking to improve their illustration fundamentals.

The project offers interactive tools that run **entirely in the browser**, ensuring privacy and offline functionality after initial load.

### Target Audience

- Illustrators
- Art students
- Beginners in illustration fundamentals

### Design Principles

- **Client-side first** — In-browser processing for maximum privacy
- **Fullscreen tools** — Tools occupy 100% of the viewport
- **Export ready** — Full HD export capability
- **Prismatic aesthetics** — Visual identity inspired by minerals and light refraction

---

## Available Tools

| Tool | Description | Technology |
|------|-------------|------------|
| **Perspective Grid** | Configurable perspective grids with 1, 2, or 3 vanishing points for illustration study | Canvas 2D |
| **3D Viewer** | Visualization and rotation of .obj models to study three-dimensionality and form | Three.js + WebGL |
| **Color Analysis** | Image upload and color palette analysis with theoretical interpretation | Canvas + K-Means |

---

## Technologies

### Frontend

| Technology | Version | Description |
|------------|---------|-------------|
| **Next.js** | 16.x | React framework with App Router |
| **React** | 19.x | UI library with Server Components |
| **TypeScript** | 5.x | Static typing |
| **TailwindCSS** | 4.x | Utility-first CSS framework |

### Rendering

| Technology | Usage |
|------------|-------|
| **Canvas 2D** | Perspective Grid, Color Analysis |
| **Three.js** | 3D Viewer |
| **WebGL** | High-performance 3D rendering |

---

## Project Structure

```
lustrous/
├── documentos/             # Project documentation
├── public/                 # Static assets
├── src/
│   ├── app/                # Routes and pages (App Router)
│   │   ├── perspective-grid/
│   │   ├── obj-viewer/
│   │   └── color-analysis/
│   ├── components/         # React components
│   │   ├── layout/         # Header, BurgerMenu
│   │   ├── tools/          # Tool components
│   │   └── ui/             # Reusable UI components
│   └── lib/                # Utilities and helpers
├── package.json
├── tsconfig.json
└── README.md
```

---

## Prerequisites

Before running the project, make sure you have the following tools installed:

- [Node.js 18.x or higher](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/lustrous.git
cd lustrous
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Start the development server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

The application will be available at: [http://localhost:3000](http://localhost:3000)

### 4. Build for production (optional)

```bash
npm run build
npm run start
```

---

## License

This project is licensed under the terms of the [MIT License](LICENSE).

---

<div align="center">

**Lustrous** — _The all-in-one creative assistant built for artists, just like you._

Made for the artistic community.

</div>
