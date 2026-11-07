---
title: "Pentaminos – Règles et Stratégie"
description: "Apprenez à tourner, retourner et assembler les 12 pentaminos canoniques dans des rectangles et silhouettes."
---

## Objectif

Dans **Pentaminos**, votre objectif est de paver intégralement la silhouette cible à l’aide des pièces polyominos fournies. Chaque case jouable du plateau doit être couverte par exactement un carré d’une pièce, **sans chevauchement** et **sans case vide**.

## Les 12 Pentaminos Canoniques

Un **pentamino** est formé de 5 carrés adjacents bord à bord. Il existe exactement **12 pentaminos libres**, désignés par les lettres **F, I, L, N, P, T, U, V, W, X, Y, Z**, couvrant un total de $12 \times 5 = 60$ cases.

## Modes de Jeu

1. **L’Échelle Penta ($5 \times N$) :** Progressez de 3 pièces ($5 \times 3$) jusqu’aux 12 pentaminos complets ($5 \times 12$ et $6 \times 10$).
2. **Silhouettes Maîtres :** Cour centrale $8 \times 8$, Bastion sans coins, Croix grecque, Pyramide à degrés et Arche romaine.
3. **Générateur Procédural :** Défis de pavage exact générés et vérifiés par l’algorithme X de Donald Knuth.

## Commandes et Accessibilité

- **Souris et Tactile :** Sélectionnez une pièce dans la réserve, tournez-la ou retournez-la, puis cliquez sur le plateau pour la poser.
- **Clavier :**
  - `Flèches` : Déplacer le curseur sur la grille.
  - `R` : Tourner la pièce active de $90^\circ$.
  - `F` : Retourner (miroir) la pièce active.
  - `Espace` / `Entrée` : Prendre ou poser une pièce.
  - `Échap` : Remettre la pièce dans la réserve.
