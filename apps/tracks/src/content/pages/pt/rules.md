---
title: "Regras do Tracks"
description: "Aprenda a jogar Tracks e construa uma linha férrea contínua da partida A até a chegada B usando as dicas das linhas e colunas."
---

# Regras do Tracks

Tracks (também conhecido como *Train Tracks*) é um quebra-cabeça lógico de caminho jogado em uma grade retangular com dicas numéricas nas bordas.

## Objetivo

Construa uma **única linha férrea contínua** conectando a **estação de partida (A)** à **estação de chegada (B)** de modo que:

1. **Caminho contínuo:** Os trilhos formem um único percurso ininterrupto de **A** até **B**, sem becos sem saída, bifurcações ou laços isolados.
2. **Dicas de linhas e colunas:** Cada número no topo e na lateral esquerda indica a **quantidade exata de células** que contêm segmentos de trilho naquela coluna ou linha.
3. **Sem cruzamentos:** A linha férrea nunca pode cruzar ou sobrepor a si mesma; cada célula pode conter no máximo um segmento reto ou curvo.

## Dicas de linhas e colunas

- **Números nas bordas:** Uma dica `5` significa que exatamente 5 células daquela linha ou coluna devem conter trilhos.
- **Trilhos fixos:** Algumas células já possuem segmentos de trilho pré-posicionados (incluindo a partida **A** e a chegada **B**). Seu percurso deve incluir todas as peças fixas e conectar suas extremidades abertas.
- **Feedback visual:** Quando o destaque de dicas está ativado, dicas satisfeitas ficam esmaecidas automaticamente e excessos são destacados como conflitos.

## Como jogar

- **Clique e arraste para construir:** Clique e arraste sobre células ortogonalmente adjacentes para assentar trilhos retos e curvos conectados de forma fluida.
- **Clique ou toque:** Clique em uma célula para colocar, girar ou limpar um segmento conforme o modo de entrada ativo.
- **Clique direito / Marcar (X):** Clique com o botão direito (ou alterne para o modo X) para marcar com **X** as células por onde nenhum trilho pode passar.
- **Auto-X:** Ative o auxiliar Auto-X nas configurações para preencher automaticamente com **X** as células vazias restantes de uma linha ou coluna assim que sua dica for atingida.

## Controles do teclado

Você pode navegar pela grade e resolver todo o quebra-cabeça usando o teclado:

| Tecla | Ação |
| --- | --- |
| **Setas direcionais** | Mover o foco entre as células da grade |
| **Home / End** | Ir para o início ou o fim da linha atual |
| **Espaço** / **Enter** | Alternar o estado da célula no modo ativo ou girar o trilho |
| **Shift + Setas** | Estender o trilho diretamente para a célula vizinha na direção escolhida |
| **R** / **T** | Alternar entre as orientações de trilhos retos e curvos |
| **X** / **M** | Colocar ou remover uma marca **X** |
| **C** | Alternar marcador candidato / guia |
| **Backspace** / **Delete** | Limpar a célula atual (se não for fixa) |
| **Z** / **U** *(ou Ctrl/⌘+Z)* | Desfazer a jogada anterior |
| **Y** *(ou Ctrl/⌘+Shift+Z)* | Refazer a jogada desfeita |
| **Esc** / **P** | Pausar ou retomar a partida |
