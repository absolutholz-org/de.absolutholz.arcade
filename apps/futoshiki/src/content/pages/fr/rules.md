---
title: Règles du Futoshiki
description: Découvrez les règles, les signes d'inégalité et les techniques de déduction du Futoshiki.
---

## Objectif

Remplissez chaque case de la grille **N × N** avec les chiffres de **1 à N** de sorte que :

1. **Lignes et colonnes uniques :** Chaque chiffre de `1` à `N` apparaît **exactement une fois** par ligne et par colonne (carré latin).
2. **Signes d'inégalité :** Chaque symbole (`<`, `>`, `∧`, `∨`) entre deux cases adjacentes doit être respecté.
   - `A < B` signifie que la case de gauche est **inférieure** à celle de droite.
   - `A > B` signifie que la case de gauche est **supérieure** à celle de droite.
   - `∧` signifie que la **case du haut est inférieure à celle du bas**.
   - `∨` signifie que la **case du haut est supérieure à celle du bas**.

## Conseils de déduction

- **Suivez les chaînes :** Sur une grille 4×4, une chaîne `A < B < C < D` impose directement `1, 2, 3, 4`.
- **Éliminez les extrêmes :** Une case supérieure à une voisine ne peut jamais valoir `1` ; une case inférieure ne peut jamais valoir `N`.
- **Utilisez les notes :** Activez **Notes** (`N`) pour inscrire vos candidats.
- **Sans deviner :** Chaque grille possède une solution unique entièrement déductible par la logique.

## Commandes

- **Flèches :** Se déplacer sur la grille.
- **1–N :** Saisir un chiffre (ou basculer une note).
- **Retour arrière / Suppr :** Effacer la case.
- **N :** Activer/désactiver les notes.
- **H :** Appliquer un indice logique.
- **U / Z :** Annuler · **R / Y :** Rétablir.
- **P / Échap :** Mettre en pause.
