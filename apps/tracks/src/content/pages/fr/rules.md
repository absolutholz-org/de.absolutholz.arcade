---
title: "Règles de Tracks"
description: "Apprenez à jouer à Tracks et construisez une voie ferrée continue du départ A à l'arrivée B grâce aux indices des lignes et colonnes."
---

# Règles de Tracks

Tracks (aussi appelé *Train Tracks*) est un puzzle logique de tracé de parcours joué sur une grille rectangulaire bordée d'indices numériques.

## Objectif

Construisez une **unique voie ferrée continue** reliant la **gare de départ (A)** à la **gare d'arrivée (B)** en respectant les règles suivantes :

1. **Parcours continu :** Les rails forment un seul chemin ininterrompu de **A** vers **B**, sans impasse, embranchement ni boucle isolée.
2. **Indices de lignes et colonnes :** Chaque nombre affiché en haut et à gauche indique le **nombre exact de cases** contenant un segment de voie dans cette colonne ou cette ligne.
3. **Aucun croisement :** La voie ne peut jamais se croiser ni se chevaucher ; chaque case contient au maximum un rail droit ou un virage.

## Indices de lignes et colonnes

- **Valeurs numériques :** Un indice `5` signifie qu'exactement 5 cases de cette ligne ou colonne doivent contenir un segment de rail.
- **Rails fixes :** Certaines cases comportent déjà des segments pré-placés (notamment le départ **A** et l'arrivée **B**). Votre tracé doit passer par tous ces segments fixes et respecter leurs ouvertures.
- **Indicateurs visuels :** Lorsque la mise en évidence des indices est activée, les lignes et colonnes complétées s'estompent automatiquement et les dépassements sont signalés.

## Comment jouer

- **Cliquer-glisser pour tracer :** Cliquez et faites glisser le curseur sur des cases adjacentes pour poser automatiquement des rails droits et des courbes raccordées.
- **Clic ou toucher :** Cliquez sur une case pour placer, orienter ou effacer un segment selon le mode sélectionné.
- **Clic droit / Croix (X) :** Faites un clic droit (ou activez le mode Croix) pour marquer d'un **X** les cases où aucun rail ne peut passer.
- **Croix automatique :** Activez l'option Croix automatique dans les paramètres pour remplir automatiquement de **X** les cases vides restantes dès qu'un indice de ligne ou de colonne est atteint.

## Commandes au clavier

Vous pouvez parcourir la grille et construire toute la voie ferrée au clavier :

| Touche | Action |
| --- | --- |
| **Flèches directionnelles** | Déplacer le focus d'une case à l'autre sur la grille |
| **Début / Fin** | Aller au début ou à la fin de la ligne actuelle |
| **Espace** / **Entrée** | Basculer l'état de la case selon le mode actif ou faire pivoter le rail |
| **Maj + Flèches** | Prolonger directement la voie ferrée vers la case adjacente |
| **R** / **T** | Faire défiler les orientations de rails droits et courbes |
| **X** / **M** | Placer ou retirer une croix (**X**) |
| **C** | Basculer un marqueur candidat / repère |
| **Retour arrière** / **Suppr** | Vider la case actuelle (si elle n'est pas fixe) |
| **Z** / **U** *(ou Ctrl/⌘+Z)* | Annuler le coup précédent |
| **Y** *(ou Ctrl/⌘+Maj+Z)* | Rétablir le coup annulé |
| **Échap** / **P** | Mettre en pause ou reprendre la partie |
