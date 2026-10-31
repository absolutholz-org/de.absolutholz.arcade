---
title: "Regras do Untangle"
description: "Aprenda a jogar Untangle e reorganize os vértices do grafo planar até que nenhuma aresta se cruze."
---

# Regras do Untangle

Untangle (também conhecido como *Planarity*) é um quebra-cabeça geométrico jogado em um grafo planar emaranhado de vértices e arestas conectadas. Todo desafio possui garantia matemática de uma solução plana sem cruzamentos.

## Objetivo

Reposicione os vértices na tela de modo que **nenhuma aresta cruze outra**:

1. **Elimine todos os cruzamentos:** Arraste ou mova os vértices para novas posições até que nenhum par de segmentos de reta se intercepte entre suas extremidades.
2. **Garantia planar:** Cada grafo gerado é matematicamente planar — sempre pode ser totalmente desembaraçado sem remover ou desconectar arestas.
3. **Vitória imediata:** Assim que o contador de interseções chegar a **0**, o quebra-cabeça estará resolvido!

## Níveis de dificuldade

Escolha entre três níveis de dificuldade que ajustam a quantidade de vértices e conexões:

- **Iniciante (Fácil):** **6 a 8 vértices** — Ideal para aprender os padrões planares básicos e partidas rápidas.
- **Intermediário (Médio):** **10 a 14 vértices** — Grafos de densidade moderada que exigem isolar primeiro os contornos externos.
- **Avançado (Difícil):** **16 a 22 vértices** — Redes complexas de triangulação planar que pedem organização estratégica.

## Indicadores visuais

- **Arestas cruzadas (Tracejadas):** As arestas que atualmente interceptam pelo menos uma outra aresta são desenhadas com **linha tracejada** e cor de destaque de alerta, facilitando a identificação mesmo sem depender apenas de cores.
- **Arestas resolvidas (Sólidas):** As arestas que não cruzam nenhum outro segmento aparecem como **linhas contínuas sólidas**.
- **Destaque de vizinhança:** Selecionar ou arrastar um vértice destaca suas arestas conectadas e os vértices vizinhos.

## Como jogar

- **Arrastar com Mouse ou Toque:** Clique ou toque em qualquer vértice e arraste-o pela área de jogo. Os cruzamentos são recalculados em tempo real.
- **Desfazer / Refazer / Reiniciar:** Use os controles da barra de ferramentas para voltar ou avançar movimentos, ou restaurar a disposição circular inicial.
- **Dica:** Solicite uma dica para mover automaticamente um vértice emaranhado em direção à sua posição planar correta.

## Controles do teclado

Você pode focar, selecionar e reposicionar qualquer vértice usando apenas o teclado:

| Tecla | Ação |
| --- | --- |
| **Tab** / **Shift + Tab** | Alternar o foco entre os vértices do grafo e os botões do jogo |
| **Enter** / **Espaço** | Selecionar ou desmarcar o vértice em foco para movimentação |
| **Setas direcionais** | Mover o vértice focado ou selecionado em passos curtos (`10` unidades) |
| **Shift + Setas direcionais** | Mover o vértice focado ou selecionado em passos largos (`40` unidades) |
| **Z** / **U** *(ou Ctrl/⌘+Z)* | Desfazer o movimento anterior |
| **Y** *(ou Ctrl/⌘+Shift+Z)* | Refazer o movimento desfeito |
| **H** | Acionar uma dica planar |
| **Esc** / **P** | Desmarcar vértice ou pausar/retomar a partida |
