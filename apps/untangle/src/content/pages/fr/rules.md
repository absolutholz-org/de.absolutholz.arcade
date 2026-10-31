---
title: "Règles d'Untangle"
description: "Apprenez à jouer à Untangle et réorganisez les sommets du graphe planaire jusqu'à ce qu'aucune arête ne se croise."
---

# Règles d'Untangle

Untangle (également connu sous le nom de *Planarity*) est un casse-tête géométrique joué sur un graphe planaire emmêlé composé de sommets et d'arêtes. Chaque puzzle possède obligatoirement une disposition plane sans aucune intersection.

## Objectif

Réorganisez les sommets sur le canevas jusqu'à ce qu'**aucune arête ne se croise** :

1. **Éliminer toutes les intersections :** Déplacez les sommets vers de nouvelles positions pour qu'aucune paire de segments ne se coupe entre leurs extrémités.
2. **Garantie planaire :** Chaque graphe généré est mathématiquement planaire — il peut toujours être entièrement démêlé sans ajouter ni supprimer de connexions.
3. **Victoire immédiate :** Dès que le compteur d'intersections atteint **0**, le puzzle est résolu !

## Niveaux de difficulté

Trois niveaux de difficulté font varier le nombre de sommets et la densité des arêtes :

- **Débutant (Facile) :** **6 à 8 sommets** — Idéal pour découvrir les motifs planaires de base.
- **Intermédiaire (Moyen) :** **10 à 14 sommets** — Graphes de densité moyenne nécessitant de dégager progressivement les contours extérieurs.
- **Avancé (Difficile) :** **16 à 22 sommets** — Réseaux de triangulation complexes demandant une organisation méthodique.

## Repères visuels

- **Arêtes qui se croisent (Pointillées) :** Les arêtes qui coupent au moins une autre arête sont tracées en **traits pointillés** avec une couleur d'alerte, garantissant une distinction claire même sans se fier uniquement à la couleur.
- **Arêtes résolues (Pleines) :** Les arêtes qui ne croisent aucun autre segment sont affichées en **traits pleins**.
- **Mise en évidence du voisinage :** Sélectionner ou faire glisser un sommet met en valeur ses arêtes adjacentes et ses sommets voisins.

## Comment jouer

- **Glisser-déposer (Souris / Tactile) :** Cliquez ou touchez un sommet et faites-le glisser sur le canevas. Les croisements sont recalculés en temps réel.
- **Annuler / Rétablir / Réinitialiser :** Utilisez la barre d'outils pour revenir en arrière, rétablir un déplacement ou remettre le graphe dans sa disposition circulaire initiale.
- **Indice :** Demandez un indice pour déplacer un sommet emmêlé vers sa position planaire de référence.

## Commandes au clavier

Vous pouvez parcourir, sélectionner et déplacer chaque sommet entièrement au clavier :

| Touche | Action |
| --- | --- |
| **Tab** / **Maj + Tab** | Déplacer le focus entre les sommets du graphe et les commandes |
| **Entrée** / **Espace** | Sélectionner ou désélectionner le sommet ciblé |
| **Touches fléchées** | Déplacer le sommet sélectionné ou ciblé par petits pas (`10` unités) |
| **Maj + Touches fléchées** | Déplacer le sommet sélectionné ou ciblé par grands pas (`40` unités) |
| **Z** / **U** *(ou Ctrl/⌘+Z)* | Annuler le déplacement précédent |
| **Y** *(ou Ctrl/⌘+Maj+Z)* | Rétablir le déplacement annulé |
| **H** | Utiliser un indice |
| **Échap** / **P** | Désélectionner le sommet ou mettre le jeu en pause |
