---
title: Como Jogar Futoshiki
description: Aprenda as regras, sinais de desigualdade e técnicas de dedução do Futoshiki.
---

## Objetivo

Preencha cada célula da grade **N × N** com dígitos de **1 a N** de modo que:

1. **Linhas e colunas únicas:** Cada dígito de `1` a `N` aparece **exatamente uma vez** em cada linha e em cada coluna (quadrado latino).
2. **Sinais de desigualdade:** Todos os símbolos (`<`, `>`, `∧`, `∨`) entre células adjacentes devem ser respeitados.
   - `A < B` significa que a célula à esquerda é **menor** que a da direita.
   - `A > B` significa que a célula à esquerda é **maior** que a da direita.
   - `∧` significa que a **célula superior é menor que a inferior**.
   - `∨` significa que a **célula superior é maior que a inferior**.

## Dicas de Dedução

- **Siga as cadeias:** Em uma grade 4×4, uma cadeia `A < B < C < D` fixa os valores `1, 2, 3, 4` em sequência.
- **Elimine extremos:** Uma célula maior que outra nunca pode ser `1`; uma célula menor que outra nunca pode ser `N`.
- **Use notas:** Ative **Notas** (`N`) para registrar os candidatos possíveis em células vazias.
- **Sem chutes:** Cada quebra-cabeça tem solução única dedutível puramente por lógica.

## Controles

- **Setas:** Mover pela grade.
- **1–N:** Inserir dígito (ou alternar nota no modo Notas).
- **Backspace / Delete:** Limpar a célula.
- **N:** Alternar modo Notas.
- **H:** Aplicar dica lógica.
- **U / Z:** Desfazer · **R / Y:** Refazer.
- **P / Esc:** Pausar jogo.
