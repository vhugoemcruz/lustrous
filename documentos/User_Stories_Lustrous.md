# User Stories — Lustrous

---

## Navegação Geral

### US-01 — Menu de Navegação
**Como** artista, **quero** acessar um menu simples para escolher a ferramenta que desejo usar, **para** navegar rapidamente entre elas.

**Critérios de Aceite:**
- [ ] Menu burger visível no header
- [ ] Menu expande ao clicar, mostrando lista de ferramentas
- [ ] Cada item do menu navega para a respectiva ferramenta
- [ ] Menu fecha automaticamente ao selecionar item
- [ ] Acessível via teclado (Enter/Escape)

---

## Perspective Grid Tool

### US-02 — Seleção de Pontos de Fuga
**Como** artista, **quero** escolher entre 1, 2 ou 3 pontos de fuga, **para** estudar diferentes tipos de perspectiva.

**Critérios de Aceite:**
- [ ] Toggle/botões para selecionar 1, 2 ou 3 pontos
- [ ] Ao selecionar 3 pontos, aparecer opção de orientação (acima/abaixo)
- [ ] Grid atualiza em tempo real ao mudar seleção
- [ ] Estado inicial: 2 pontos de fuga

---

### US-03 — Manipulação de Pontos e Eye-Level
**Como** artista, **quero** mover os pontos de fuga e o eye-level, **para** ajustar o grid à minha cena.

**Critérios de Aceite:**
- [ ] Pontos de fuga são arrastáveis (drag & drop)
- [ ] Eye-level ajustável via click + drag no canvas
- [ ] Feedback visual durante arraste
- [ ] Limites definidos para evitar posições inválidas

---

### US-04 — Rotação do Horizonte
**Como** artista, **quero** rotacionar o horizonte, **para** criar cenas inclinadas.

**Critérios de Aceite:**
- [ ] Slider horizontal visível na UI
- [ ] Range: -45° a +45°
- [ ] Valor exibido em graus
- [ ] Grid atualiza em tempo real

---

### US-05 — Densidade do Grid
**Como** artista, **quero** ajustar a densidade do grid (low, medium, high), **para** adequar o nível de detalhe.

**Critérios de Aceite:**
- [ ] Três opções: Low, Medium, High
- [ ] Seleção via toggle ou dropdown
- [ ] Densidade visualmente distinta entre opções
- [ ] Estado inicial: Medium

---

### US-06 — Exportar Grid
**Como** artista, **quero** exportar o grid em Full HD, **para** usá-lo no meu software de desenho.

**Critérios de Aceite:**
- [ ] Botão "Export" claramente visível
- [ ] Download automático de imagem PNG
- [ ] Resolução: 1920x1080 pixels
- [ ] Imagem inclui grid atual sem UI

---

### US-07 — Resetar Grid
**Como** artista, **quero** resetar o grid, **para** voltar à configuração inicial.

**Critérios de Aceite:**
- [ ] Botão "Reset" claramente visível
- [ ] Ao clicar, restaura: 2 pontos, densidade medium, horizonte 0°
- [ ] Confirmação visual de reset (breve feedback)

---

## Visualizador de Arquivos .obj

### US-08 — Importar Arquivo .obj
**Como** artista, **quero** importar arquivos `.obj`, **para** estudar tridimensionalidade.

**Critérios de Aceite:**
- [ ] Área de upload ou botão "Importar"
- [ ] Aceita apenas arquivos `.obj`
- [ ] Limite de tamanho: 10MB (configurável)
- [ ] Mensagem de erro para arquivos inválidos
- [ ] Opção de selecionar modelos padrão do site

---

### US-09 — Rotacionar Modelo (Trackball)
**Como** artista, **quero** rotacionar o modelo com trackball, **para** observar o objeto de todos os ângulos.

**Critérios de Aceite:**
- [ ] Click + drag rotaciona o modelo
- [ ] Rotação suave e responsiva
- [ ] Funciona em desktop e mobile (touch)

---

### US-10 — Zoom no Modelo
**Como** artista, **quero** aplicar zoom na cena, **para** analisar detalhes.

**Critérios de Aceite:**
- [ ] Scroll do mouse controla zoom
- [ ] Pinch-to-zoom em touch devices
- [ ] Limites de zoom definidos (min/max)

---

### US-11 — Resetar Posição do Modelo
**Como** artista, **quero** resetar a posição do objeto, **para** voltar ao estado original.

**Critérios de Aceite:**
- [ ] Botão "Reset" claramente visível
- [ ] Restaura rotação e zoom originais do arquivo
- [ ] Modelo retorna à orientação de importação

---

### US-12 — Exportar Imagem da Cena 3D
**Como** artista, **quero** exportar uma imagem da cena em Full HD, **para** referência visual.

**Critérios de Aceite:**
- [ ] Botão "Export" claramente visível
- [ ] Download automático de imagem PNG
- [ ] Resolução: 1920x1080 pixels
- [ ] Imagem captura cena atual sem UI

---

## Análise de Gama de Cores

### US-13 — Importar Imagem para Análise
**Como** artista, **quero** importar uma imagem, **para** analisar sua paleta de cores.

**Critérios de Aceite:**
- [ ] Área de upload ou botão "Importar"
- [ ] Aceita formatos: PNG, JPG, JPEG, WEBP
- [ ] Preview da imagem após upload
- [ ] Botão para iniciar análise

---

### US-14 — Visualizar Paleta de Cores
**Como** artista, **quero** visualizar os valores HEX e nomes das cores em cada parte da imagem, **para** estudar teoria das cores.

**Critérios de Aceite:**
- [ ] Paleta de cores dominantes exibida
- [ ] Cores organizadas por região da imagem
- [ ] Cada cor mostra: swatch, HEX, nome aproximado
- [ ] Click na cor copia HEX para clipboard

---

### US-15 — Interpretação Teórica das Cores
**Como** artista, **quero** receber uma interpretação teórica do uso das cores, **para** aprendizado.

**Critérios de Aceite:**
- [ ] Seção de análise teórica no relatório
- [ ] Identifica: temperatura (quente/fria), contraste, saturação
- [ ] Texto educacional explicando as escolhas de cor
- [ ] Linguagem acessível para iniciantes

---

### US-16 — Exportar Relatório em PDF
**Como** artista, **quero** exportar o relatório em PDF, **para** estudo posterior.

**Critérios de Aceite:**
- [ ] Botão "Exportar PDF" claramente visível
- [ ] PDF inclui: imagem, paletas, interpretação
- [ ] Layout formatado e legível
- [ ] Download automático

---

## Tratamento de Erros

### US-17 — Mensagens de Erro Claras
**Como** usuário, **quero** receber mensagens claras em caso de erro, **para** saber como proceder.

**Critérios de Aceite:**
- [ ] Mensagem de erro centralizada na tela
- [ ] Texto claro descrevendo o problema
- [ ] Instruções: "Reinicie a ferramenta" ou "Tente novamente mais tarde"
- [ ] Botão de ação para reiniciar ou voltar
- [ ] Contato do desenvolvedor para falhas recorrentes
