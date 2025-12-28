# Arquitetura das Ferramentas — Lustrous

---

## Visão Geral

Cada ferramenta do Lustrous é projetada como um **módulo isolado**, totalmente independente, com:
- Renderização **client-side**
- Processamento local
- Estado próprio
- Exportação de resultados

Arquitetura base de cada ferramenta:

[ UI (Página Fullscreen) ]
        ↓
[ Tool Controller ]
        ↓
[ Domain / Algorithm Engine ]
        ↓
[ Renderer ]
        ↓
[ Export / Reset / Error Handling ]

---

## 1. Perspective Grid Tool

### Objetivo
Permitir a construção e exportação de grids de perspectiva altamente configuráveis para estudo de ilustração.

---

### Diagrama Lógico Detalhado

[ User Input ]
   │
   ▼
[ UI Controls ]
   │
   ▼
[ Perspective Tool Controller ]
   │
   ▼
[ Perspective Geometry Engine ]
   │
   ▼
[ Canvas 2D Renderer ]
   │
   ▼
[ Export / Reset / Error Handler ]

---

### UI Controls (Obrigatórios)

- Seleção de número de pontos de fuga:
  - 1 ponto
  - 2 pontos
  - 3 pontos
- Seleção de **orientação do terceiro ponto de fuga**:
  - Vindo de cima
  - Vindo de baixo
- Manipulação direta dos pontos de fuga (drag & drop)
- Controle de **eye-level** via movimento da câmera (click + drag)
- Slider horizontal centralizado para:
  - Rotação da linha do horizonte
- Seleção de densidade do grid:
  - Low
  - Medium
  - High
- Botão de **export**
- Botão de **reset da cena**

---

### Perspective Tool Controller

Responsável por:
- Gerenciar o estado completo da cena:
  - Pontos de fuga
  - Orientação do terceiro ponto
  - Eye-level
  - Rotação do horizonte
  - Densidade
- Coordenar inputs da UI
- Acionar re-renderização
- Validar combinações de estado (ex.: 3 pontos + orientação)

---

### Perspective Geometry Engine

Responsável por:
- Cálculo geométrico das linhas de perspectiva
- Geração de linhas convergentes:
  - Horizontais
  - Verticais
  - Profundidade
- Aplicação de:
  - Rotação da linha do horizonte
  - Offset do eye-level
- Ajuste do terceiro ponto conforme orientação:
  - Acima → projeções descendentes
  - Abaixo → projeções ascendentes

---

### Canvas 2D Renderer

- Renderização em tempo real
- Ocupa 100% da viewport
- Redesenho completo a cada mudança de estado
- Anti-aliasing e suavização visual

---

### Export / Reset / Error Handler

- Exportação da cena:
  - Resolução: **Full HD (1920x1080)**
- Reset completo:
  - Retorna para a configuração inicial padrão
- Tratamento de erro:
  - Mensagem centralizada
  - Instrução de reinício da ferramenta
  - Orientação para tentar novamente mais tarde

---

## 2. Visualizador de Arquivos `.obj`

### Objetivo
Permitir o estudo de tridimensionalidade através da visualização interativa de modelos 3D.

---

### Diagrama Lógico Detalhado

[ File Input / Preset Selector ]
           │
           ▼
[ OBJ Loader & Validator ]
           │
           ▼
[ Scene Setup ]
           │
           ▼
[ Camera & Trackball Controller ]
           │
           ▼
[ WebGL Renderer (Three.js) ]
           │
           ▼
[ Export / Reset / Error Handler ]

---

### OBJ Loader & Validator

- Importação de arquivos `.obj`
- Limite máximo de tamanho
- Validação de formato
- Opção de modelos padrão fornecidos pelo site

---

### Scene Setup

- Criação da cena 3D
- Inserção do modelo
- Centralização automática
- Iluminação básica neutra (estudo de forma)

---

### Camera & Trackball Controller

- Rotação via click + drag (trackball)
- Zoom in / zoom out
- Reset da posição:
  - Retorna o objeto à orientação original do arquivo
  - Ex.: cabeça retorna à posição ereta padrão

---

### WebGL Renderer

- Renderização contínua
- WebGL via Three.js
- Performance otimizada para client-side

---

### Export / Reset / Error Handler

- Exportação de imagem:
  - Resolução: **Full HD**
- Reset de transformações
- Mensagem de erro centralizada em falhas

---

## 3. Ferramenta de Análise de Gama de Cores

### Objetivo
Auxiliar no estudo de teoria das cores através da análise automatizada de imagens.

---

### Diagrama Lógico Detalhado

[ Image Upload ]
      │
      ▼
[ Image Decoder ]
      │
      ▼
[ Pixel Sampler ]
      │
      ▼
[ Color Clustering Engine ]
      │
      ▼
[ Color Interpretation Engine ]
      │
      ▼
[ Report Generator ]
      │
      ▼
[ PDF Export / Error Handler ]

---

### Pixel Sampler

- Leitura via Canvas
- Downsampling para performance
- Segmentação por regiões visuais

---

### Color Clustering Engine

- Agrupamento por similaridade cromática
- Identificação de cores dominantes
- Conversão:
  - RGB → HSV
  - RGB → HEX

---

### Color Interpretation Engine

- Análise de:
  - Temperatura (quente / fria)
  - Contraste
  - Saturação
- Geração de **interpretação teórica** (educacional)

---

### Report Generator

- Organização visual do relatório
- Exibição de:
  - Paletas por região
  - Valores HEX
  - Nome aproximado das cores

---

### Export / Error Handler

- Exportação em **PDF**
- Mensagens de erro claras
