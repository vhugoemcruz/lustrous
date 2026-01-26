# Definição de Algoritmos — Lustrous

---

## 1. Algoritmo de Perspective Grid

### Objetivo

Gerar grids de perspectiva configuráveis com até **3 pontos de fuga**, incluindo controle explícito da **orientação do terceiro ponto**.

---

### Estruturas de Dados

- VanishingPoint { x, y }
- Horizon { angle, y }
- GridConfig {
  type: 1 | 2 | 3,
  thirdPointOrientation: 'top' | 'bottom' | null,
  density: 'low' | 'medium' | 'high'
  }
- CameraState { eyeLevelOffset }

---

### Algoritmo (Passo a Passo)

1. Definir número de pontos de fuga
2. Se `type === 3`:
   - Definir orientação do terceiro ponto:
     - `top` → projeções descendentes
     - `bottom` → projeções ascendentes
3. Calcular linha do horizonte
4. Aplicar rotação do horizonte
5. Aplicar offset do eye-level
6. Gerar linhas convergentes conforme densidade
7. Renderizar em Canvas 2D
8. Permitir export e reset

---

### Observações

- Todo cálculo ocorre antes do render
- Re-render completo a cada alteração de estado

---

## 2. Algoritmo de Visualização 3D (.obj)

### Objetivo

Renderizar modelos `.obj` com controle total de câmera e exportação.

---

### Pipeline

1. Importar arquivo `.obj`
2. Validar tamanho
3. Parsear vértices e faces
4. Criar geometria
5. Centralizar modelo
6. Inicializar câmera
7. Aplicar controles:
   - Trackball
   - Zoom
8. Renderizar loop
9. Permitir reset e export

---

### Reset

- Armazena matriz inicial do objeto
- Restaura transformações ao reset

---

## 3. Algoritmo de Análise de Gama de Cores

### Objetivo

Gerar relatório educacional de uso de cores em uma imagem.

---

### Pipeline Detalhado

1. Upload da imagem
2. Decodificação via Canvas
3. Downsampling
4. Segmentação por regiões
5. Conversão RGB → HSV
6. Clusterização (K-Means ou similar)
7. Identificação de cores dominantes
8. Nomeação aproximada das cores
9. Geração de interpretação teórica
10. Geração de PDF

---

### Saídas

- Paletas regionais
- Valores HEX
- Nome das cores
- Interpretação educacional
