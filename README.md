# noodlejump-stackblitz

Noodlejump ist ein einfaches, Javascript-basiertes Spiel für Programmierkurse basierend auf <https://github.com/WolfScholle/noodlejump>.

## Neuen Spielplatz anlegen

* Noodlejump-Vorlage auf [StackBlitz](https://stackblitz.com/edit/noodlejump) öffnen
* Neuen "Fork" erstellen
* Warten bis die Seite neu lädt
* Los geht's!

## Programmieraufgaben

* Bild des Helden austauschen
* Den Wert des Scores links oben im Spiel anzeigen und nach jedem Sprung aktualisieren
* Einen Punktemultiplikator nach jedem 10-ten Sprung vergeben
* Geschwindigkeit des Spiels nach jedem 10-ten Sprung erhöhen, um den multiplizierten Score zu rechtfertigen ;-)
* Extra-Features (nach Schwierigkeit)
  * (Hintergrund-) Farben ändern
  * Game Over Einblendung mit erzielter Punktzahl
  * Bonusplattformen mit extra Punkten
  * Helden mit allen Seiten mit den Plattformen zusammenstoßen lassen
  * Plattformen enger/weiter auseinander machen
  * Plattformen mit zufälliger Breite anlegen
  * Verbieten, dass man aus dem Bildrand springen kann
  * Helden kürzer oder weiter seitlich bewegen lassen
  * Plattformen sich hin und her bewegen lassen (schwer!)

## Nachlesen

* [Dokumentation der Phaser-Engine](https://photonstorm.github.io/phaser-ce/)
* [Phaser programmieren lernen](https://phaser.io/learn)

## Lokal entwickeln

* Abhängigkeiten installieren mit `npm install`
* Developmentserver starten mit `npm start`

## Auf deine eigene Website hochladen

Du willst Noodlejump nicht nur über den Stackblitz link mit deinen Freunden teilen, sondern auf deiner eigenen Website veröffentlichen? Das ist gar nicht schwer:

1. Die App für deine Website vorbereiten mit `npm run build`.
2. Die Dateien in dem `dist` Ordner auf den Server deiner Website kopieren (das funktioniert auch in Unterverzeichnissen auf deinem Server).

Nun ist das Spiel schon auf deiner Website verfügbar 🥳
