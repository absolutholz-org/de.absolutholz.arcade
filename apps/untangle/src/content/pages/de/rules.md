---
title: "Untangle Spielregeln"
description: "Erfahre, wie man Untangle spielt und Knoten eines planaren Graphen so anordnet, dass sich keine Kanten mehr kreuzen."
---

# Untangle Spielregeln

Untangle (auch bekannt als *Planarity*) ist ein geometrisches Logikrätsel rund um ein verknäueltes Netz aus Knoten und Verbindungskanten. Jedes Rätsel basiert auf einem planaren Graphen und besitzt garantiert eine kreuzungsfreie Lösung.

## Spielziel

Verschiebe die Knoten auf dem Spielfeld so, dass sich **keine einzigen Kanten mehr überschneiden**:

1. **Alle Kreuzungen auflösen:** Ziehe oder bewege die Knoten an neue Positionen, bis sich keine zwei Verbindungslinien mehr zwischen ihren Endpunkten schneiden.
2. **Planare Garantie:** Jeder erzeugte Graph ist mathematisch planar – er lässt sich immer vollständig entwirren, ohne Kanten zu löschen oder Verbindungen zu trennen.
3. **Sofortiger Sieg:** Sobald die Anzahl der Schnittpunkte auf **0** sinkt, ist das Rätsel gelöst!

## Schwierigkeitsgrade

Wähle zwischen drei Schwierigkeitsstufen mit steigender Knoten- und Kantenanzahl:

- **Anfänger (Leicht):** **6–8 Knoten** — Ideal zum Kennenlernen grundlegender planarer Strukturen.
- **Fortgeschritten (Mittel):** **10–14 Knoten** — Mitteldichte Netze, die ein schrittweises Freilegen der Außenkanten erfordern.
- **Experte (Schwer):** **16–22 Knoten** — Komplexe planare Dreiecksnetze für anspruchsvolles Entwirren.

## Visuelle Hinweise

- **Überkreuzte Kanten (Gestrichelt):** Kanten, die aktuell mindestens eine andere Kante schneiden, werden als **gestrichelte Linie** mit Warnakzent dargestellt, sodass Konflikte auch unabhängig von der Farbe sofort erkennbar sind.
- **Freie Kanten (Durchgezogen):** Kanten ohne Überschneidungen werden als **durchgezogene Linie** gezeichnet.
- **Nachbarschafts-Hervorhebung:** Beim Auswählen oder Ziehen eines Knotens werden seine direkten Verbindungskanten und Nachbarknoten hervorgehoben.

## Spielsteuerung

- **Ziehen per Maus oder Touch:** Klicke oder tippe auf einen beliebigen Knoten und ziehe ihn über das Spielfeld. Alle Schnittpunkte werden in Echtzeit neu berechnet.
- **Rückgängig / Wiederholen / Neustart:** Nutze die Aktionsleiste, um Züge schrittweise rückgängig zu machen, wiederherzustellen oder den Graphen auf den ursprünglichen Kreis zurückzusetzen.
- **Hinweis:** Fordere einen Hinweis an, um einen verknoteten Punkt automatisch näher an seine planare Zielposition zu rücken.

## Tastatursteuerung

Du kannst alle Knoten vollständig mit der Tastatur fokussieren, auswählen und verschieben:

| Taste | Aktion |
| --- | --- |
| **Tab** / **Umschalt + Tab** | Fokus zwischen den Knoten des Graphen und den Bedienelementen wechseln |
| **Eingabe** / **Leertaste** | Fokussierten Knoten zum Verschieben auswählen oder Auswahl aufheben |
| **Pfeiltasten** | Fokussierten oder ausgewählten Knoten in kleinen Schritten (`10` Einheiten) bewegen |
| **Umschalt + Pfeiltasten** | Fokussierten oder ausgewählten Knoten in großen Schritten (`40` Einheiten) bewegen |
| **Z** / **U** *(oder Strg/⌘+Z)* | Letzten Zug rückgängig machen |
| **Y** *(oder Strg/⌘+Umschalt+Z)* | Rückgängig gemachten Zug wiederholen |
| **H** | Hinweis anfordern |
| **Esc** / **P** | Knotenauswahl aufheben oder Spiel pausieren/fortsetzen |
