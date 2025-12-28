# Documento de Requisitos
## Projeto: Lustrous

---

## 1. Visão Geral Técnica

Lustrous será uma aplicação web moderna, focada em renderização client-side, alta interatividade visual e usabilidade simples, utilizando tecnologias consolidadas do ecossistema JavaScript.

---

## 2. Stack Técnica

- **Frontend:** React + Next.js
- **Backend:** Node.js
- **Banco de Dados:** PostgreSQL
- **Deploy:** Vercel

---

## 3. Integrações Externas

- PayPal (doações)
- Google Pay (doações)

---

## 4. Infraestrutura

- Ferramentas de Perspective Grid e Visualizador 3D:
  - Renderização e processamento **client-side**
- Ferramenta de Análise de Gama de Cores:
  - Processamento prioritariamente client-side
- Infraestrutura serverless para suporte básico
- Sem dependência de serviços pagos no MVP

---

## 5. Requisitos Funcionais

### RF-01 — Navegação Geral
- O site deve possuir um **menu tipo burger**
- O menu deve listar todas as ferramentas disponíveis
- Cada ferramenta deve possuir sua **própria página**
- O usuário deve ser redirecionado ao selecionar uma ferramenta

---

### RF-02 — Perspective Grid Tool
- O usuário deve selecionar:
  - 1, 2 ou 3 pontos de fuga
  - Orientação do terceiro ponto (acima ou abaixo)
- O sistema deve renderizar o grid em tempo real
- O usuário pode:
  - Manipular pontos de fuga
  - Ajustar densidade do grid (low, medium, high)
  - Mover a câmera para alterar o eye-level
  - Rotacionar o horizonte via slider
- O usuário pode:
  - Exportar a cena em Full HD
  - Resetar a cena para o estado inicial
- A ferramenta deve ocupar 100% da tela, sobrando apenas o header

---

### RF-03 — Visualizador de Arquivos `.obj`
- O usuário pode importar arquivos `.obj`
- O sistema deve validar tamanho máximo do arquivo
- O usuário pode:
  - Rotacionar o modelo via trackball
  - Aplicar zoom
  - Resetar a posição do objeto
- O usuário pode exportar uma imagem Full HD da cena

---

### RF-04 — Análise de Gama de Cores
- O usuário pode importar uma imagem
- O sistema deve analisar as cores da imagem
- O sistema deve gerar um relatório contendo:
  - Paleta de cores
  - Valores HEX
  - Nome das cores
  - Interpretação teórica
- O usuário pode exportar o relatório em PDF

---

### RF-05 — Tratamento de Erros
- Em caso de erro:
  - Exibir mensagem centralizada
  - Solicitar reinício da ferramenta
  - Em falha recorrente, instruir o usuário a tentar mais tarde e contatar o desenvolvedor

---

## 6. Requisitos Não Funcionais

### Performance
- Resposta compatível com padrões médios de aplicações web modernas

### Escalabilidade e Disponibilidade
- Sem SLA garantido inicialmente
- Evolução conforme capacidade do desenvolvedor

### Segurança
- Conformidade básica com LGPD
- Não coleta de dados sensíveis no MVP
- Uploads tratados de forma segura
- Sem autenticação de usuários no MVP

### Usabilidade
- Interface simples, direta e eficiente
- Foco total nas ferramentas

### Acessibilidade
- Conformidade WCAG AA
- Navegação por teclado
- Contraste adequado de cores

### Compatibilidade
- Suporte aos navegadores mais utilizados

### Internacionalização
- Português (Brasil)
- Inglês
- Japonês
- Chinês (Mandarim Simplificado)

---

## 7. Requisitos Técnicos e Padrões

- Arquitetura limpa
- Princípios SOLID
- Clean Architecture
- DDD quando aplicável
- Testes automatizados
- Linting e padronização de código

---

## 8. UX / UI — Diretrizes de Design

### Conceito Visual
Identidade inspirada em minerais, prismas e refração da luz.

### Princípios
- Precisão geométrica
- Luminosidade espectral
- Textura sutil
- Fluxo contínuo

### Paleta de Cores
(Deep Obsidian, Slate Grey, Anthracite, Quartz, Diamond Dust, Amethyst Purple, Aqua Cyan, Magenta Fusion, Pyrite Gold)

### Tipografia
- Headline: Montserrat (Bold / SemiBold)
- Body: Inter (Regular / Medium)

### Componentes
- Botões com gradiente prismático
- Cards com profundidade sutil
- Inputs com foco luminoso
- Navbar com efeito glassmorphism

### Animações
- Fundo animado com partículas prismáticas
- Microinterações com glow
- Transições rápidas de página
- Loader baseado no logo (poliedro)

---

## 9. Aspectos Legais e Compliance

> **Pendente — será definido futuramente**
