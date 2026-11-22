---
title: Como Jogar Cascata
description: Regras, fórmula de pontuação, gravidade e dicas para Cascata.
---

## Objetivo

Elimine grupos conectados de peças iguais no tabuleiro **15×10** para alcançar a maior pontuação possível. Limpe todas as peças para ganhar o bônus de **+1.000 pontos (Limpeza Perfeita)**!

## Regras e Controles

1. **Selecionar um grupo (1º toque/clique):** Clique ou toque em qualquer peça conectada ortogonalmente (cima, baixo, esquerda ou direita) a pelo menos outra peça da mesma cor. O grupo inteiro será destacado com a prévia de pontos.
2. **Remover o grupo (2º toque/clique):** Clique ou toque novamente no grupo destacado para remover todas as peças. Tocar em outro grupo válido muda a seleção; peças isoladas não podem ser selecionadas.
3. **Gravidade e deslocamento de colunas:** As peças acima dos espaços vazios caem verticalmente. Quando uma coluna inteira fica vazia, todas as colunas à direita se deslocam para a esquerda.
4. **Fim da rodada:** Quando não houver mais grupos de 2 ou mais peças iguais, a partida termina e as peças isoladas restantes são destacadas.

## Fórmula de Pontuação

- **Pontos por grupo:** `(peças - 2)²`
  - 2 peças = `0 pts`
  - 3 peças = `1 pt`
  - 5 peças = `9 pts`
  - 10 peças = `64 pts` (Mega jogada!)
- **Bônus de Limpeza Perfeita:** `+1.000 pts` ao deixar 0 peças no tabuleiro.

## Níveis de Dificuldade

- **Iniciante:** Grade 5×5, 3 cores (aquecimento rápido)
- **Fácil:** Grade 10×5, 3 cores (cadeias relaxantes)
- **Normal:** Grade 15×10, 3 cores (clássico de 3 cores)
- **Difícil:** Grade 15×10, 4 cores (equilíbrio estratégico)
- **Especialista:** Grade 20×15, 4 cores (tabuleiro maratona)

## Atalhos de Teclado

- **Setas:** Navegar pela grade 15×10
- **Enter / Espaço:** Selecionar e, ao pressionar novamente, remover o grupo
- **Esc:** Limpar seleção
- **Ctrl/Cmd + Z:** Desfazer jogada
- **Ctrl/Cmd + Shift + Z:** Refazer jogada
- **P:** Pausar / Continuar
