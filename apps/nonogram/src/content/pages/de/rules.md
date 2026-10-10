---
title: "Nonogramm Spielregeln"
description: "Regeln, Strategien und Steuerung für das Lösen von Nonogramm-Logikrätseln."
---

# Nonogramm Spielregeln

Nonogramme (auch bekannt als Picross, Griddlers oder Malen nach Zahlen) sind Bildlogikrätsel, bei denen Zellen in einem Gitter anhand von Zahlenhinweisen gefüllt oder leer gelassen werden, um ein verborgenes Pixelbild zu enthüllen.

## Das Ziel

Finde durch logische Schlussfolgerungen heraus, welche Zellen gefüllt und welche leer bleiben sollen (mit einem `X` markiert). Jedes Rätsel in unserer Arcade hat eine eindeutige, deterministisch lösbare Lösung ohne Raten.

## Hinweise verstehen

- **Zeilenhinweise:** Zahlen links neben jeder Zeile beschreiben die Blöcke aufeinanderfolgender gefüllter Zellen von links nach rechts.
- **Spaltenhinweise:** Zahlen über jeder Spalte beschreiben die Blöcke aufeinanderfolgender gefüllter Zellen von oben nach unten.
- **Abstände:** Zwischen zwei aufeinanderfolgenden gefüllten Blöcken derselben Linie muss mindestens ein leeres Feld (`X`) liegen.
- **Einzelner Block:** Ein Hinweis von `5` auf einer 5er-Linie bedeutet, dass alle 5 Felder gefüllt sind.
- **Mehrere Blöcke:** Ein Hinweis von `2 1` auf einer 5er-Linie bedeutet ein Block aus 2 Feldern, mindestens ein freies Feld, und dann 1 gefülltes Feld.
- **Leere Linie:** Eine `0` zeigt an, dass in dieser Linie kein einziges Feld gefüllt ist.

## Steuerung

### Desktop-Steuerung

- **Linksklick:** Zelle füllen (oder ziehen zum Zeichnen einer Linie).
- **Rechtsklick oder Shift + Klick:** Zelle mit einem `X` markieren.
- **Klicken und Ziehen:** Entlang von Zeilen oder Spalten ziehen, um mehrere Zellen in einem Zug zu bearbeiten.
- **Rückgängig / Wiederholen:** Schaltflächen in der Symbolleiste oder Tastenkombinationen `Strg+Z` / `Strg+Y`.

### Mobil- & Touch-Steuerung

- **Modus-Umschalter:** Schalte in der unteren Leiste zwischen **Füllen** und **Kreuz (X)** um.
- **Tippen & Ziehen:** Tippe auf ein Feld oder ziehe entlang einer Linie. Ungewolltes Scrollen der Seite auf dem Spielfeld wird automatisch verhindert.

### Tastatursteuerung

- **Pfeiltasten:** Fokus über das Gitter bewegen.
- **Leertaste oder Enter:** Fokussierte Zelle füllen.
- **X:** Fokussierte Zelle ankreuzen oder Kreuz entfernen.
- **Rücktaste / Entf:** Zelle wieder leeren.
