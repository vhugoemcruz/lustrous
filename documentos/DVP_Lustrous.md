# Documento de Visão do Produto (DVP)
## Projeto: Lustrous

---

## 1. Visão e Contexto do Produto

**Nome:** Lustrous

**Descrição:**  
Lustrous é uma plataforma web de ferramentas utilitárias para artistas, projetada para facilitar o estudo de ilustração por meio de recursos visuais interativos. O foco do produto é oferecer ferramentas técnicas essenciais — como estudo de perspectiva, tridimensionalidade e teoria das cores — de forma gratuita, acessível e centralizada em um único ambiente.

**Problema que o produto resolve:**  
Muitos artistas, especialmente iniciantes e independentes, não possuem acesso fácil a ferramentas técnicas de estudo que normalmente estão fragmentadas em diferentes sites ou presas a softwares pagos. Isso dificulta o aprendizado e o desenvolvimento consistente de fundamentos visuais.

**Proposta de valor:**  
Unificação de múltiplas ferramentas utilitárias para artistas em uma única plataforma gratuita, acessível diretamente pelo navegador, sem barreiras financeiras ou técnicas.

**Tipo de produto:**  
Website responsivo.

**Estado atual:**  
Ideia / concepção.

---

## 2. Público-Alvo e Usuários

**Perfil dos usuários:**  
- Artistas ilustradores
- Estudantes de arte
- Pessoas em aprendizado de fundamentos de ilustração

**Nível técnico do usuário:**  
Leigo.

**Cenários de uso:**  
O usuário está estudando ou produzindo uma ilustração e necessita de material de apoio técnico. Ele acessa o Lustrous para:
- Construir grids de perspectiva
- Visualizar objetos 3D para compreender volume e forma
- Analisar paletas e uso de cores em imagens de referência

---

## 3. Escopo do Produto

### Funcionalidades Principais (MVP)

#### 3.1 Ferramenta de Perspective Grid
Ferramenta interativa para construção e estudo de perspectiva, inspirada em:
https://www.reubenlara.com/perspectivegrid/

**Características principais:**
- Suporte a **1, 2 ou 3 pontos de fuga**
- Até **2 pontos no horizonte**
- **Terceiro ponto opcional**, podendo ser posicionado acima ou abaixo do horizonte
- Pontos de fuga **manipuláveis**
- Controle de **densidade do grid**:
  - Low
  - Medium
  - High
- Manipulação do **eye-level** através de movimento de câmera
- **Rotação da linha do horizonte** via slider horizontal
- Botão de **reset** para restaurar a configuração inicial
- Opção de **exportar a cena** (resolução Full HD)
- Visualização ocupa **100% da página**

---

#### 3.2 Visualizador de Arquivos `.obj`
Ferramenta para visualização de modelos 3D com foco em estudo de tridimensionalidade.

**Características principais:**
- Upload de arquivos `.obj` com limite de tamanho
- Biblioteca de modelos padrão fornecidos pelo site
- Visualização 3D em tempo real
- Controle por **trackball** (click + arrastar)
- Zoom in / zoom out
- Botão de **reset** para posição original do modelo
- Opção de **exportar print** da cena (Full HD)
- Renderização client-side

**Funcionalidades futuras desejáveis:**
- Múltiplos objetos na mesma cena
- Integração de perspective grid na visualização 3D

---

#### 3.3 Ferramenta de Análise de Gama de Cores
Ferramenta para estudo de teoria das cores a partir de imagens.

**Características principais:**
- Upload de imagem
- Algoritmo client-side para análise de cores
- Geração de relatório contendo:
  - Paleta de cores por regiões da imagem
  - Valores HEX
  - Nome das cores
  - Interpretação teórica do uso das cores
- Exportação do relatório em **PDF**

---

### 3.4 Processamento
- Todas as ferramentas devem priorizar **processamento no lado do cliente**
- Objetivo: reduzir carga no servidor e custos operacionais

---

### Funcionalidades Desejáveis
- Sistema de doações via PayPal e Google Pay

---

### Fases Futuras
- Ferramenta de estudo de gesture com imagens aleatórias e timer
- Plataforma de commissions integrada (similar ao VGEN)
- Aplicativo mobile

---

## 4. Plataforma

- Website responsivo
- Compatível com desktop e mobile
- Aplicativo mobile considerado para versões futuras

---

## 5. Métricas de Sucesso

- Ferramentas principais funcionando corretamente
- Uso prático por artistas
- Estabilidade e confiabilidade das ferramentas
- Feedback qualitativo da comunidade artística

---

## 6. Aspectos Legais e Compliance

> **Pendente — será definido em fase posterior**
