---
title: "Tracks-Regeln"
description: "Lerne die Regeln von Tracks und baue eine durchgehende Bahnstrecke von Start A bis Ziel B mithilfe der Zeilen- und Spaltenhinweise."
---

# Tracks-Regeln

Tracks (auch bekannt als *Schienenrätsel* oder *Train Tracks*) ist ein logisches Pfadrätsel auf einem rechteckigen Gitter mit Zahlenhinweisen am Rand.

## Spielziel

Baue eine **einzige durchgehende Eisenbahnstrecke** vom **Startbahnhof (A)** bis zum **Zielbahnhof (B)**, sodass folgende Regeln erfüllt sind:

1. **Durchgehende Strecke:** Die Schienen bilden einen ununterbrochenen Pfad von **A** nach **B** ohne Sackgassen, Verzweigungen oder isolierte Schleifen.
2. **Zeilen- und Spaltenhinweise:** Jede Zahl am oberen und linken Rand gibt **genau die Anzahl der Felder** an, die in dieser Spalte bzw. Zeile ein Schienensegment enthalten müssen.
3. **Keine Kreuzungen:** Die Bahnstrecke darf sich niemals selbst kreuzen oder überlappen. Jedes Feld enthält höchstens ein gerades oder gebogenes Schienenstück.

## Zeilen- und Spaltenhinweise

- **Hinweiswerte:** Eine `5` am Rand bedeutet, dass genau 5 Felder in dieser Zeile oder Spalte mit Schienen belegt sein müssen.
- **Vorgegebene Schienen:** Einige Felder enthalten bereits fest vorgegebene Schienenteile (darunter Start **A** und Ziel **B**). Deine Strecke muss alle vorgegebenen Schienen einbinden und deren offene Enden korrekt verbinden.
- **Visuelles Feedback:** Wenn die Hinweishervorhebung aktiviert ist, werden erfüllte Zeilen- und Spaltenhinweise automatisch abgeblendet, während Überschreitungen als Konflikt markiert werden.

## Spielsteuerung

- **Klicken & Ziehen (Pfadbau):** Klicke und ziehe über benachbarte Felder, um durchgehende gerade und gebogene Schienen flüssig zu verlegen – angrenzende Schienen passen ihre Kurvenrichtung automatisch an.
- **Klicken / Tippen:** Klicke auf ein Feld, um je nach aktivem Modus ein Schienenstück zu setzen, zu drehen oder zu entfernen.
- **Rechtsklick / Kreuz (X):** Nutze den Rechtsklick (oder den Kreuz-Modus), um Felder mit einem **X** auszuschließen, durch die garantiert keine Schiene führen kann.
- **Auto-Kreuz-Hilfe:** Aktiviere Auto-Kreuz in den Einstellungen, um verbleibende leere Felder einer Zeile oder Spalte automatisch mit **X** zu markieren, sobald der Zahlenhinweis erfüllt ist.

## Tastatursteuerung

Du kannst das gesamte Schienennetz vollständig per Tastatur bedienen:

| Taste | Aktion |
| --- | --- |
| **Pfeiltasten** | Fokus zwischen den Feldern des Gitters bewegen |
| **Pos1 / Ende** | Zum Anfang oder Ende der aktuellen Zeile springen |
| **Leertaste** / **Enter** | Feldstatus im aktiven Modus umschalten oder Schienenrichtung wechseln |
| **Umschalt + Pfeiltasten** | Schiene direkt in das Nachbarfeld der gewählten Richtung verlängern |
| **R** / **T** | Gerade und gebogene Schienenausrichtungen im fokussierten Feld durchschalten |
| **X** / **M** | Ausschlussmarkierung (**X**) setzen oder entfernen |
| **C** | Kandidaten- bzw. Hilfsmarkierung umschalten |
| **Rücktaste** / **Entf** | Aktuelles nicht-vorgegebenes Feld leeren |
| **Z** / **U** *(oder Strg/⌘+Z)* | Letzten Zug rückgängig machen |
| **Y** *(oder Strg/⌘+Umschalt+Z)* | Rückgängig gemachten Zug wiederherstellen |
| **Esc** / **P** | Spiel pausieren oder fortsetzen |
