---
title: Como Jogar Codebreaker
description: Aprenda as regras, pistas agrupadas, níveis de dificuldade e controles de teclado do Codebreaker.
---

## Objetivo

Decifre a sequência secreta de pinos coloridos antes que suas tentativas acabem. Após cada palpite enviado, pistas agrupadas mostram o quão perto você está do código secreto.

## Níveis de Dificuldade

- **Fácil:** 4 pinos, 6 cores, 10 tentativas
- **Médio:** 4 pinos, 8 cores, 10 tentativas
- **Difícil:** 5 pinos, 8 cores, 12 tentativas

Por padrão, códigos secretos podem conter cores repetidas. Você pode alterar **Permitir cores repetidas** nas Configurações antes de iniciar uma nova rodada.

## Pistas de Avaliação

Os pinos de pista são sempre exibidos **agrupados** (acertos exatos primeiro, depois acertos apenas de cor e então espaços vazios), para que a ordem nunca revele qual posição acertou:

- **Acerto exato (pino sólido):** Cor correta na posição exata.
- **Apenas cor (anel vazado):** Cor correta, mas na posição errada.
- **Sem acerto (espaço vazio):** Não corresponde a nenhum pino restante do código secreto.

Cada pino do código secreto é contado no máximo uma vez, evitando contagem dupla de cores repetidas.

## Dicas Lógicas

Pressione **Dica** (ou `H`) a qualquer momento:

- Se a sua linha atual contradizer o resultado de uma tentativa anterior, o Codebreaker aponta a tentativa conflitante.
- Caso contrário, o Codebreaker sugere uma cor logicamente consistente para o próximo espaço vazio (ou confirma que a linha completa é consistente com todas as pistas).

## Controles

- **Toque / Clique:** Toque em uma cor da paleta para colocá-la na posição ativa, toque em um pino colocado para selecionar ou limpar e pressione **Verificar** quando a linha estiver completa.
- **Teclado:**
  - `←` / `→` — Mover entre posições da linha ativa
  - `1`–`8` — Colocar a cor correspondente
  - `Backspace` / `Delete` — Limpar a posição ativa ou anterior
  - `Enter` — Verificar a linha completa
  - `H` — Solicitar dica lógica
  - `U` / `Z` — Desfazer; `R` / `Y` — Refazer (linha ativa)
  - `Esc` / `P` — Pausar ou retomar o jogo
