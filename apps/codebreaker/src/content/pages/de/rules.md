---
title: Codebreaker – Spielregeln
description: Lerne die Regeln, Treffer-Hinweise, Schwierigkeitsstufen und Tastatursteuerung für Codebreaker.
---

## Spielziel

Knacke die geheime Farbkombination, bevor deine Versuche aufgebraucht sind. Nach jedem abgegebenen Versuch erhältst du gruppierte Hinweisstifte, die zeigen, wie nah dein Tipp am Geheimcode liegt.

## Schwierigkeitsstufen

- **Leicht:** 4 Stifte, 6 Farben, 10 Versuche
- **Mittel:** 4 Stifte, 8 Farben, 10 Versuche
- **Schwer:** 5 Stifte, 8 Farben, 12 Versuche

Standardmäßig dürfen Farben im Geheimcode mehrfach vorkommen. Du kannst **Doppelte Farben erlauben** in den Einstellungen für neue Runden anpassen.

## Hinweisstifte

Die Hinweisstifte werden immer **gruppiert** angezeigt (zuerst exakte Treffer, dann Farbtreffer, dann leere Felder), sodass ihre Reihenfolge niemals verrät, welche Position getroffen wurde:

- **Exakter Treffer (ausgefüllter dunkler Stift):** Richtige Farbe an der genau richtigen Position.
- **Farbtreffer (offener Ring):** Richtige Farbe, aber an einer anderen Position.
- **Kein Treffer (leeres Feld):** Keine Übereinstimmung mit den übrigen Stiften des Geheimcodes.

Jeder Stift im Geheimcode wird höchstens einmal gezählt – doppelte Farben werden niemals doppelt gewertet.

## Logische Hinweise

Drücke jederzeit **Hinweis** (oder `H`):

- Widerspricht deine aktuelle Reihe einem früheren Versuch, markiert Codebreaker die betroffene Reihe.
- Andernfalls schlägt Codebreaker eine logisch konsistente Farbe für das nächste leere Feld vor (oder bestätigt, dass deine vollständige Reihe zu allen bisherigen Hinweisen passt).

## Steuerung

- **Tippen / Klicken:** Tippe eine Farbe in der Palette an, um sie im aktiven Feld zu setzen. Tippe auf einen gesetzten Stift zum Auswählen oder Löschen und drücke **Prüfen**, sobald die Reihe voll ist.
- **Tastatur:**
  - `←` / `→` — Zwischen Feldern der aktiven Reihe wechseln
  - `1`–`8` — Entsprechende Farbe setzen
  - `Backspace` / `Delete` — Aktives oder vorheriges Feld löschen
  - `Enter` — Vollständige Reihe prüfen
  - `H` — Logischen Hinweis anfordern
  - `U` / `Z` — Rückgängig; `R` / `Y` — Wiederholen (innerhalb der aktiven Reihe)
  - `Esc` / `P` — Spiel pausieren oder fortsetzen
