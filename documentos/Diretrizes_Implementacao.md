# Diretrizes de Implementação — Lustrous

Padrões técnicos e estrutura recomendada para desenvolvimento do projeto.

---

## Stack Técnica

| Tecnologia       | Versão | Propósito                                       |
| ---------------- | ------ | ----------------------------------------------- |
| **Next.js**      | 15+    | Framework React (App Router, Server Components) |
| **React**        | 18+    | UI Components                                   |
| **Three.js**     | latest | Renderização 3D (.obj viewer)                   |
| **Canvas 2D**    | nativo | Perspective Grid / Color Analysis               |
| **TypeScript**   | 5+     | Type safety                                     |
| **Tailwind CSS** | 3+     | Estilização                                     |
| **next-intl**    | latest | Internacionalização                             |
| **jsPDF**        | latest | Geração de PDF                                  |
| **Zod**          | latest | Validação de schemas                            |

---

## Estrutura de Pastas

```
lustrous/
├── src/
│   ├── app/                      # App Router (pages)
│   │   ├── layout.tsx            # Layout raiz
│   │   ├── page.tsx              # Home
│   │   ├── perspective-grid/
│   │   │   └── page.tsx
│   │   ├── obj-viewer/
│   │   │   └── page.tsx
│   │   └── color-analysis/
│   │       └── page.tsx
│   │
│   ├── components/               # Componentes React
│   │   ├── ui/                   # Componentes base (Button, Input, etc)
│   │   ├── layout/               # Header, BurgerMenu, Footer
│   │   └── tools/                # Componentes específicos das ferramentas
│   │       ├── perspective/
│   │       ├── obj-viewer/
│   │       └── color-analysis/
│   │
│   ├── lib/                      # Lógica de negócio
│   │   ├── engines/              # Domain Engines
│   │   │   ├── perspective-engine.ts
│   │   │   ├── obj-loader.ts
│   │   │   └── color-clustering.ts
│   │   ├── utils/                # Utilitários
│   │   └── hooks/                # Custom hooks
│   │
│   ├── styles/                   # CSS global e tokens
│   │   ├── globals.css
│   │   └── tokens.css
│   │
│   └── i18n/                     # Arquivos de tradução
│       ├── pt-BR.json
│       ├── en.json
│       ├── ja.json
│       └── zh-CN.json
│
├── public/
│   ├── models/                   # Modelos .obj padrão
│   └── fonts/                    # Fontes (Montserrat, Inter)
│
├── documentos/                   # Documentação do projeto
└── tests/                        # Testes
    ├── unit/
    ├── integration/
    └── e2e/
```

---

## Convenções de Nomenclatura

| Contexto          | Padrão                 | Exemplo                  |
| ----------------- | ---------------------- | ------------------------ |
| **Componentes**   | PascalCase             | `PerspectiveGrid.tsx`    |
| **Hooks**         | camelCase + use prefix | `usePerspectiveState.ts` |
| **Engines/Utils** | kebab-case             | `perspective-engine.ts`  |
| **Constantes**    | SCREAMING_SNAKE_CASE   | `MAX_FILE_SIZE`          |
| **CSS Classes**   | kebab-case (Tailwind)  | `bg-deep-obsidian`       |
| **Rotas**         | kebab-case             | `/perspective-grid`      |

---

## Padrão de Componente

```tsx
// @ts-check
/**
 * @module PerspectiveGrid
 * @description Componente principal da ferramenta de grid de perspectiva
 */

"use client";

import { useState } from "react";
import type { FC } from "react";

interface PerspectiveGridProps {
  initialPoints?: number;
}

export const PerspectiveGrid: FC<PerspectiveGridProps> = ({
  initialPoints = 2,
}) => {
  const [points, setPoints] = useState(initialPoints);

  return <div className="perspective-grid">{/* ... */}</div>;
};
```

---

## Padrão de Engine

```typescript
// @ts-check
/**
 * @module perspective-engine
 * @description Motor de cálculo de geometria de perspectiva
 */

import type { VanishingPoint, GridConfig } from "@/types";

export function calculatePerspectiveLines(
  points: VanishingPoint[],
  config: GridConfig
): Line[] {
  // Implementação
}
```

---

## Design Tokens

```css
/* tokens.css */
:root {
  /* Cores principais */
  --deep-obsidian: #0a0a0f;
  --slate-grey: #2a2a3d;
  --anthracite: #1a1a2e;
  --quartz: #e8e8f0;
  --diamond-dust: #ffffff;

  /* Cores de destaque */
  --amethyst-purple: #9b59b6;
  --aqua-cyan: #00d9ff;
  --magenta-fusion: #ff006e;
  --pyrite-gold: #ffd700;

  /* Tipografia */
  --font-headline: "Montserrat", sans-serif;
  --font-body: "Inter", sans-serif;

  /* Gradientes */
  --gradient-prismatic: linear-gradient(
    135deg,
    var(--amethyst-purple),
    var(--aqua-cyan),
    var(--magenta-fusion)
  );
}
```

---

## Padrões de Erro

```typescript
// Mensagem de erro padrão
interface ToolError {
  code: string;
  message: string;
  action: "restart" | "retry" | "contact";
}

// Exemplo
const error: ToolError = {
  code: "OBJ_INVALID_FORMAT",
  message: "O arquivo não é um .obj válido",
  action: "retry",
};
```

---

## Diretrizes de Qualidade

- TypeScript strict mode
- ESLint + Prettier configurados
- Testes unitários para engines
- Acessibilidade WCAG AA
- i18n para todos os textos
- Export funcional em Full HD
- Tratamento de erros padronizado
