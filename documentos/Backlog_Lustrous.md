# Backlog de Tarefas — Lustrous

> **Legenda:** P1 = Crítico | P2 = Importante | P3 = Desejável | S/M/L = Esforço

---

## Setup do Projeto

| Status | Prioridade | Esforço | Tarefa                                                | Ref   |
| ------ | ---------- | ------- | ----------------------------------------------------- | ----- |
| `[ ]`  | P1         | M       | Criar projeto Next.js 15+ (App Router)                | —     |
| `[ ]`  | P1         | S       | Configurar ESLint e Prettier                          | —     |
| `[ ]`  | P1         | M       | Configurar estrutura base de pastas                   | —     |
| `[ ]`  | P2         | M       | Configurar internacionalização (pt-BR, en, ja, zh-CN) | RF-05 |
| `[ ]`  | P2         | M       | Definir tema e tokens de design (paleta prismática)   | RF-08 |

---

## Navegação

| Status | Prioridade | Esforço | Tarefa                                   | Ref          |
| ------ | ---------- | ------- | ---------------------------------------- | ------------ |
| `[ ]`  | P1         | S       | Criar layout base com header             | US-01        |
| `[ ]`  | P1         | M       | Implementar burger menu                  | US-01, RF-01 |
| `[ ]`  | P1         | S       | Implementar roteamento entre ferramentas | US-01, RF-01 |

---

## Perspective Grid Tool

| Status | Prioridade | Esforço | Tarefa                                         | Ref          |
| ------ | ---------- | ------- | ---------------------------------------------- | ------------ |
| `[ ]`  | P1         | L       | Implementar Perspective Geometry Engine        | ALG-01       |
| `[ ]`  | P1         | M       | Implementar grid 1 ponto de fuga               | US-02, RF-02 |
| `[ ]`  | P1         | M       | Implementar grid 2 pontos de fuga              | US-02, RF-02 |
| `[ ]`  | P1         | L       | Implementar grid 3 pontos de fuga (top/bottom) | US-02, RF-02 |
| `[ ]`  | P2         | S       | Controle de densidade (low/medium/high)        | US-05, RF-02 |
| `[ ]`  | P2         | M       | Controle de eye-level (drag camera)            | US-03, RF-02 |
| `[ ]`  | P2         | M       | Rotação do horizonte (slider)                  | US-04, RF-02 |
| `[ ]`  | P1         | M       | Exportação Full HD (1920x1080)                 | US-06, RF-02 |
| `[ ]`  | P2         | S       | Reset da cena                                  | US-07, RF-02 |

---

## Visualizador .obj

| Status | Prioridade | Esforço | Tarefa                             | Ref          |
| ------ | ---------- | ------- | ---------------------------------- | ------------ |
| `[ ]`  | P1         | M       | Setup Three.js e cena base         | ALG-02       |
| `[ ]`  | P1         | M       | OBJ Loader & Validator             | US-08, RF-03 |
| `[ ]`  | P2         | S       | Modelos padrão fornecidos          | RF-03        |
| `[ ]`  | P1         | M       | Implementar trackball controls     | US-09, RF-03 |
| `[ ]`  | P2         | S       | Implementar zoom                   | US-10, RF-03 |
| `[ ]`  | P2         | S       | Reset de posição (matriz original) | US-11, RF-03 |
| `[ ]`  | P1         | M       | Exportação de imagem Full HD       | US-12, RF-03 |

---

## Análise de Gama de Cores

| Status | Prioridade | Esforço | Tarefa                                | Ref           |
| ------ | ---------- | ------- | ------------------------------------- | ------------- |
| `[ ]`  | P1         | S       | Upload de imagem                      | US-13, RF-04  |
| `[ ]`  | P1         | M       | Pixel Sampler (Canvas + downsampling) | ALG-03        |
| `[ ]`  | P1         | L       | Color Clustering Engine (K-Means)     | US-14, ALG-03 |
| `[ ]`  | P2         | M       | Segmentação por regiões               | US-14, RF-04  |
| `[ ]`  | P2         | M       | Color Interpretation Engine           | US-15, RF-04  |
| `[ ]`  | P1         | L       | Report Generator + PDF Export         | US-16, RF-04  |

---

## UX / UI

| Status | Prioridade | Esforço | Tarefa                                 | Ref          |
| ------ | ---------- | ------- | -------------------------------------- | ------------ |
| `[ ]`  | P1         | M       | Tema escuro base (Deep Obsidian)       | RF-08        |
| `[ ]`  | P2         | M       | Gradientes prismáticos nos componentes | RF-08        |
| `[ ]`  | P3         | M       | Animações e microinterações com glow   | RF-08        |
| `[ ]`  | P2         | S       | Loader animado (poliedro)              | RF-08        |
| `[ ]`  | P1         | S       | Mensagens de erro centralizadas        | US-17, RF-05 |

---

## Qualidade

| Status | Prioridade | Esforço | Tarefa                            | Ref |
| ------ | ---------- | ------- | --------------------------------- | --- |
| `[ ]`  | P2         | M       | Testes unitários (hooks, engines) | RNF |
| `[ ]`  | P2         | M       | Testes de componentes             | RNF |
| `[ ]`  | P3         | L       | Testes E2E básicos                | RNF |
| `[ ]`  | P2         | S       | Acessibilidade WCAG AA            | RNF |

---

## Referências

- **US-XX**: User Stories
- **RF-XX**: Requisitos Funcionais
- **RNF**: Requisitos Não Funcionais
- **ALG-XX**: Algoritmos
