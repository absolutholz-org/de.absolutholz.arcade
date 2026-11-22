---
title: Règles du jeu Cascade
description: Règles, calcul des points, gravité et astuces pour Cascade.
---

## Objectif

Éliminez des groupes connectés de tuiles de même couleur sur le plateau **15×10** pour obtenir le meilleur score possible. Videz entièrement le plateau pour décrocher le bonus **+1 000 Plateau parfait** !

## Règles et commandes

1. **Sélectionner un groupe (1er clic/tap) :** Touchez une tuile reliée orthogonalement (haut, bas, gauche, droite) à au moins une autre tuile identique. Le groupe entier s'illumine et affiche ses points potentiels.
2. **Éliminer le groupe (2e clic/tap) :** Touchez une seconde fois le groupe sélectionné pour le faire disparaître. Toucher un autre groupe valide change la sélection ; les tuiles isolées ne peuvent pas être sélectionnées.
3. **Gravité et décalage de colonnes :** Les tuiles situées au-dessus des espaces vides tombent verticalement. Dès qu'une colonne entière est vide, toutes les colonnes à sa droite se décalent vers la gauche.
4. **Fin de partie :** Lorsqu'il ne reste aucun groupe de 2 tuiles ou plus, la partie s'achève et les tuiles isolées restantes sont mises en évidence.

## Calcul des points

- **Points par groupe :** `(tuiles - 2)²`
  - 2 tuiles = `0 pt`
  - 3 tuiles = `1 pt`
  - 5 tuiles = `9 pts`
  - 10 tuiles = `64 pts` (Méga chaîne !)
- **Bonus Plateau parfait :** `+1 000 pts` s'il reste 0 tuile.

## Niveaux de difficulté

- **Débutant :** Grille 5×5, 3 couleurs (échauffement rapide)
- **Facile :** Grille 10×5, 3 couleurs (chaînes détendues)
- **Normal :** Grille 15×10, 3 couleurs (classique à 3 couleurs)
- **Difficile :** Grille 15×10, 4 couleurs (équilibre stratégique)
- **Expert :** Grille 20×15, 4 couleurs (grand plateau marathon)

## Raccourcis clavier

- **Flèches :** Déplacer le focus sur la grille
- **Entrée / Espace :** Sélectionner puis éliminer un groupe
- **Échap :** Annuler la sélection
- **Ctrl/Cmd + Z :** Annuler le coup
- **Ctrl/Cmd + Maj + Z :** Rétablir le coup
- **P :** Pause / Reprendre
