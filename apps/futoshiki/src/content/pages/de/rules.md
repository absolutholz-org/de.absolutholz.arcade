---
title: Futoshiki Spielregeln
description: Lerne die Regeln, Ungleichheitszeichen und Logiktechniken für Futoshiki.
---

## Ziel des Spiels

Fülle jedes Feld des **N × N**-Gitters mit den Ziffern **1 bis N**, sodass:

1. **Eindeutige Zeilen & Spalten:** Jede Ziffer von `1` bis `N` kommt in jeder Zeile und jeder Spalte **genau einmal** vor (lateinisches Quadrat).
2. **Ungleichheitszeichen:** Jedes Symbol (`<`, `>`, `∧`, `∨`) zwischen zwei benachbarten Zellen muss erfüllt sein.
   - `A < B` bedeutet, die linke Zelle ist **kleiner als** die rechte.
   - `A > B` bedeutet, die linke Zelle ist **größer als** die rechte.
   - `∧` zwischen zwei vertikalen Zellen bedeutet, die **obere Zelle ist kleiner als die untere**.
   - `∨` zwischen zwei vertikalen Zellen bedeutet, die **obere Zelle ist größer als die untere**.

## Tipps zur Deduktion

- **Ketten verfolgen:** Eine Kette `A < B < C < D` in einem 4×4-Feld legt die Ziffern `1, 2, 3, 4` eindeutig fest.
- **Extreme ausschließen:** Eine Zelle, die größer als ein Nachbar ist, kann niemals `1` sein; eine Zelle, die kleiner ist, niemals `N`.
- **Notizen nutzen:** Schalte **Notizen** (`N`) ein, um mögliche Kandidaten festzuhalten.
- **Kein Raten nötig:** Jedes Rätsel hat eine eindeutige, rein logisch ableitbare Lösung.

## Steuerung

- **Pfeiltasten:** Im Gitter navigieren.
- **1–N:** Ziffer eingeben (oder im Notizmodus Kandidaten umschalten).
- **Rückschritt / Entf:** Feld leeren.
- **N:** Notizmodus umschalten.
- **H:** Logischen Hinweis anwenden.
- **U / Z:** Rückgängig · **R / Y:** Wiederholen.
- **P / Esc:** Spiel pausieren.
