<div align="center">

# ✨ Lustrous

**Visual Tools Platform for Artists**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)

[Explore Tools](#-tools) • [Installation](#-installation) • [Documentation](#-documentation)

</div>

---

## 📋 About

**Lustrous** is a free web platform of utility tools for artists, designed to facilitate the study of illustration through interactive visual resources.

A common problem is addressed: artists, especially beginners, often find technical tools fragmented across different websites or locked behind paid software. These tools are centralized in a single environment accessible directly through the browser.

### ✨ Highlights

- 🎨 **Artist-focused** — Tools designed for the study of visual fundamentals
- ⚡ **Client-side processing** — Optimized performance with no server dependency
- 📱 **Responsive** — Compatible with desktop and mobile devices
- 🌍 **Free and accessible** — No financial or technical barriers

---

## 🛠 Tools

### Perspective Grid Tool

An interactive tool for building and studying perspective. The interface allows artists to construct customizable perspective grids to assist in illustration work.

| Feature                 | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| **Vanishing Points**    | Support for 1, 2, or 3 configurable vanishing points   |
| **Direct Manipulation** | Vanishing points can be dragged directly on the canvas |
| **Eye-level Control**   | The eye level is adjusted via camera movement          |
| **Horizon Rotation**    | The horizon line inclination can be customized         |
| **Grid Density**        | Options include Low, Medium, and High density          |
| **Export**              | Scenes are exported in Full HD (1920×1080)             |

---

### OBJ Viewer

A visualization tool for 3D models focused on the study of three-dimensionality. The viewer enables artists to examine objects from any angle to understand volume, form, and spatial relationships.

| Feature                 | Description                                                    |
| ----------------------- | -------------------------------------------------------------- |
| **File Upload**         | `.obj` files can be uploaded or default models can be selected |
| **Trackball Control**   | Models are rotated via click and drag interaction              |
| **Zoom**                | Zoom in and out functionality is provided                      |
| **Real-time Rendering** | WebGL rendering is performed client-side via Three.js          |
| **Reset Position**      | The model can be reset to its original orientation             |
| **Export**              | Scenes are exported in Full HD resolution                      |

---

### Color Analysis Tool

A tool for studying color theory through automated image analysis. The analyzer extracts color palettes and provides theoretical interpretations to aid in understanding color usage.

| Feature                        | Description                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------- |
| **Image Upload**               | Images can be uploaded for analysis                                           |
| **Region Sampling**            | Colors are extracted from different regions of the image                      |
| **Palette Generation**         | Dominant colors are identified with HEX values and names                      |
| **Theoretical Interpretation** | Educational insights about temperature, contrast, and saturation are provided |
| **PDF Export**                 | Analysis reports can be exported as PDF documents                             |

---

## 🚀 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 18.x or higher
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/lustrous.git

# Navigate to the directory
cd lustrous

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application can be accessed at [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Starts the development server |
| `npm run build` | Creates the production build  |
| `npm run start` | Starts the production server  |
| `npm run lint`  | Runs the linter               |

---

## 🏗 Architecture

```
lustrous/
├── src/
│   ├── app/                    # App Router (Next.js)
│   │   ├── perspective-grid/   # Perspective tool
│   │   ├── obj-viewer/         # 3D viewer
│   │   └── color-analysis/     # Color analysis
│   ├── components/             # Reusable components
│   │   ├── layout/             # Header, Footer, Navigation
│   │   ├── tools/              # Tool-specific components
│   │   └── ui/                 # Interface components
│   └── lib/                    # Utilities and engines
├── public/                     # Static files
└── documentos/                 # Technical documentation
```

### Technical Stack

| Layer            | Technology               |
| ---------------- | ------------------------ |
| **Framework**    | Next.js 16 (App Router)  |
| **UI**           | React 19 + TailwindCSS 4 |
| **Language**     | TypeScript 5             |
| **2D Rendering** | Canvas API               |
| **3D Rendering** | Three.js (WebGL)         |
| **Deploy**       | Vercel                   |

---

## 📚 Documentation

Complete technical documentation is available in the `/documentos` folder:

| Document                                                                                | Description                                |
| --------------------------------------------------------------------------------------- | ------------------------------------------ |
| [LUSTROUS_MASTER.md](./documentos/LUSTROUS_MASTER.md)                                   | Project quick reference                    |
| [DVP_Lustrous.md](./documentos/DVP_Lustrous.md)                                         | Product Vision Document                    |
| [Requisitos_Lustrous.md](./documentos/Requisitos_Lustrous.md)                           | Functional and non-functional requirements |
| [Arquitetura_Ferramentas_Lustrous.md](./documentos/Arquitetura_Ferramentas_Lustrous.md) | Detailed tool architecture                 |
| [User_Stories_Lustrous.md](./documentos/User_Stories_Lustrous.md)                       | User stories                               |

---

## 🤝 Contributing

Contributions are welcome. To contribute:

1. Fork the project
2. Create a branch for the feature (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'feat: add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License

This project is under the **GPL-3.0** license. See the [LICENSE](documentos/LICENSE) file for more details.

---

<div align="center">

**Made with ✨ for artists**

[⬆ Back to top](#-lustrous)

</div>
