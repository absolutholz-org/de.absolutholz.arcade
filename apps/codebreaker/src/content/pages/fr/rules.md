---
title: Règles de Codebreaker
description: Découvrez les règles, les indices groupés, les niveaux de difficulté et les commandes clavier de Codebreaker.
---

## Objectif

Déchiffrez la séquence secrète de pions colorés avant d'épuiser vos essais. Après chaque tentative validée, des pions d'indice groupés indiquent votre progression.

## Niveaux de difficulté

- **Facile :** 4 pions, 6 couleurs, 10 essais
- **Moyen :** 4 pions, 8 couleurs, 10 essais
- **Difficile :** 5 pions, 8 couleurs, 12 essais

Par défaut, les codes secrets peuvent contenir des doublons. Vous pouvez modifier **Autoriser les doublons** dans les paramètres avant une nouvelle partie.

## Indices de rétroaction

Les pions d'indice sont toujours affichés **groupés** (correspondances exactes d'abord, puis couleurs seules, puis emplacements vides) afin de ne jamais révéler quelle position correspond :

- **Correspondance exacte (pion plein) :** Bonne couleur au bon emplacement.
- **Couleur uniquement (anneau creux) :** Bonne couleur, mais au mauvais emplacement.
- **Aucune correspondance (emplacement vide) :** Aucune correspondance avec les pions restants du code secret.

Chaque pion du code secret n'est compté qu'une seule fois.

## Indices logiques

Appuyez sur **Indice** (ou `H`) à tout moment :

- Si votre ligne en cours contredit un essai précédent, Codebreaker signale la ligne en conflit.
- Sinon, Codebreaker propose une couleur cohérente pour la prochaine case vide (ou confirme que votre ligne complète est cohérente avec tous les indices précédents).

## Commandes

- **Tactile / Souris :** Touchez une couleur dans la palette pour la placer, touchez un pion placé pour le sélectionner ou l'effacer, puis validez avec **Vérifier**.
- **Clavier :**
  - `←` / `→` — Naviguer entre les cases de la ligne active
  - `1`–`8` — Placer la couleur correspondante
  - `Backspace` / `Delete` — Effacer la case active ou précédente
  - `Enter` — Valider la ligne complète
  - `H` — Demander un indice logique
  - `U` / `Z` — Annuler ; `R` / `Y` — Rétablir (ligne active)
  - `Esc` / `P` — Mettre en pause ou reprendre
