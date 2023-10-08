# NoodleJump

Noodlejump ist ein einfaches, Javascript-basiertes Spiel um spielerisch Programmieren zu lernen.

Bevor es mit dem Lernen losgeht, erstelle deinen eigenen Programmierspielplatz indem du die folgenden Schritte befolgst:

* Noodlejump-Vorlage auf [StackBlitz](https://stackblitz.com/github/xkons/lerne-programmieren-mit-noodlejump) öffnen
* Klicke auf den "Fork" Button in der linken oberen Ecke dieser Seite
* Warten bis die Seite neu lädt
* Los geht's!

Mit diesem Programmierspielplatz bekommst du auch einen eigenen Link, den du mit Freunden und Familie teilen kannst, damit diese deine Version des Spiels spielen können.

## Programmieraufgaben

Du findest Lösungen für manche der Aufgaben auf [dieser Seite](https://github.com/BastiTee/noodlejump-stackblitz/pulls).

* Bild des Helden austauschen
* Den Wert des Scores links oben im Spiel anzeigen und nach jedem Sprung aktualisieren
* Einen Punktemultiplikator nach jedem 10-ten Sprung vergeben
* Geschwindigkeit des Spiels nach jedem 10-ten Sprung erhöhen, um den multiplizierten Score zu rechtfertigen ;-)
* Ein Hintergrundbild einfügen
* Extra-Features (nach Schwierigkeit)
  * (Hintergrund-) Farben ändern
  * Game Over Einblendung mit erzielter Punktzahl
  * Bonusplattformen mit extra Punkten
  * Plattformen enger/weiter auseinander machen
  * Plattformen mit zufälliger Breite anlegen
  * Plattformen sich hin und her bewegen lassen (schwer!)
  

## Mehr über Phaser lernen

Phaser ist eine wiederverwendbare kostenfreie Software, um mit JavaScript 2D-Spiele zu bauen. Indem wir Phaser verwenden, müssen wir uns nicht selbst darum kümmern die Speile-Physik grundlegend zu bauen. Wir können zum Beispiel für jedes Object im Spiel ganz einfach herausfinden ob und wo es von irgendeinem anderen Objekt, wie z.B. dem Spieler, berührt wird.

* [Dokumentation der Phaser-Engine](https://photonstorm.github.io/phaser-ce/)
* [Phaser programmieren lernen](https://phaser.io/learn)

## Dein Spiel per Link teilen

StackBlitz stellt eine Kopie deines Spiels kostenfrei unter einer URL zur Verfügung.

In diesem Screenshot siehst du wo du den Link findest, um dein Spiel mit anderen zu teilen.

<img width="881" alt="Ein Screenshot von dem Noodlejump Spiel auf dem online Code-Editor Stackblitz. In der linken Hälfte des Bildes ist der Code zu sehen und auf der rechten Seite das Spiel. Direkt über dem Spiel zeigt Stackblitz den Link zum Teilen des Speils" src="https://user-images.githubusercontent.com/15232701/111906564-59e38880-8a51-11eb-8126-c026fffd4cf5.png">

## Auf deine eigene Website hochladen

Du willst Noodlejump nicht nur über den Stackblitz link mit deinen Freunden teilen, sondern auf deiner eigenen Website veröffentlichen? Das ist gar nicht schwer:

1. Die App für deine Website vorbereiten mit `npm run build`.
2. Die Dateien in dem `dist` Ordner auf den Server deiner Website kopieren (das funktioniert auch in Unterverzeichnissen auf deinem Server).

Nun ist das Spiel schon auf deiner Website verfügbar 🥳

## Lokal entwickeln (auf deinem Computer mit Texteditor, nicht im Browser)

Anforderungen: node muss auf deinem Computer installiert sein. Dieses Projekt verwendet Node in Version 16. [Link zur Downloadseite von Node](https://nodejs.org/en/download/).

* Lade dir den Quellcode von GitHub herunter
* Öffne die Kommandozeile (cmd.exe auf Windows, Terminal auf Mac OS)
* Wechsle zu dem Ordner mit dem Quellcode
* Abhängigkeiten installieren mit `npm install`
* Developmentserver starten mit `npm start`


