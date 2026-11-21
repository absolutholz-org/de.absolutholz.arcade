---
title: Règles du jeu Undead
description: Règles, réflexions des miroirs et visibilité des monstres dans Undead.
---

## Objectif

Remplissez chaque case vide de la grille de miroirs avec un **Fantôme**, un **Vampire** ou un **Zombie** de sorte que :

1. Le nombre total de chaque type de monstre corresponde exactement à l’inventaire affiché au-dessus de la grille.
2. Chaque chiffre en bordure indique le nombre exact de monstres visibles en regardant tout droit dans la grille depuis cette position.

## Visibilité des monstres

Les miroirs diagonaux (`/` et `\`) dévient votre ligne de vue à 90 degrés :

- **Vampire (`V`) :** Visible **uniquement en direct** (avant tout rebond sur un miroir). Les vampires n’ont pas de reflet !
- **Fantôme (`G`) :** Visible **uniquement après au moins un reflet**. Les fantômes sont invisibles en vision directe !
- **Zombie (`Z`) :** **Toujours visible**, aussi bien en direct qu’en reflet.

Si un rayon réfléchi traverse deux fois la même case, le monstre est compté à chaque passage où il est visible.

## Commandes et astuces

- **Aperçu des rayons :** Survolez ou sélectionnez un indice de bord pour visualiser son trajet direct (trait plein) et réfléchi (pointillés).
- **Cocher les indices :** Cliquez sur un indice de bord pour l’atténuer une fois vérifié.
- **Navigation au clavier :** Utilisez les **flèches directionnelles**, appuyez sur **`G`** (Fantôme), **`V`** (Vampire) ou **`Z`** (Zombie) pour placer un monstre, et **`Retour arrière` / `Suppr`** pour effacer.
- **Mode Notes :** Activez **Notes** (**`N`**), maintenez **`Maj + G / V / Z`** ou faites un **clic droit** sur une case pour noter vos candidats.
