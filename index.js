import NoodlejumpAdvanced from './index-advanced.js'

/**
 * NOODLEJUMP
 * ==========
 *                                                                        
 * Die Klasse Noodlejump und die Basisklasse NoodlejumpAdvanced sind
 * verantwortlich für die Spiellogik und all das, was man auf dem Bildschirm
 * sieht. Sie nutzen eine Programmbibliothek names "Phaser". Phaser ist eine
 * Spiele-Engine, wie auch Unreal oder Unity. Nur eben für den Browser.
 * 
 * Die Klasse Noodlejump enthält die Logik für die ersten Programmieraufgaben
 * wie Punktzahlen einblenden, Spiel schwerer machen, etc.
 * 
 * Die Klasse NoodlejumpAdvanced richtet sich an fortgeschrittene Programmierer
 * und erlaub größere Eingriffe, z.B. die Veränderung der Plattformen etc.
 * 
 * Zur Vereinfachung kann man sich merken, dass englische Variablen und
 * Funktionen (z.B. world, stage, cameraYMin, preload() usw.) von der
 * Phaser-Engine vorgegeben sind und wir sie nur "ansteuern", 
 * hingegen deutsche Variablen und Funktionen (held, punktzahl, anzahlSpruenge,
 * weltAnlegen() usw.) von uns selbst angelegt werden, um die Spiellogik zu
 * steuern.
 * 
 * Die Variable 'this' bezieht sich immer auf das aktuelle Spiel. Also kann
 * man sich merken: 'this' ist 'Das Spiel'.
 * 
 * Die Funktionen preload(), create(), update() und shutdown() 
 * (findet sich in NoodlejumpAdvanced) steuern den State (Zustand) von Phaser 
 * direkt an. 
 * https://photonstorm.github.io/phaser-ce/Phaser.State.html
 * 
 */
class Noodlejump extends NoodlejumpAdvanced {

  /**
   * Diese Funktion wird ausgeführt, bevor das Spiel geladen wird, um 
   * Bilder zwischenzuspeichern, die das Spiel verwendet.
   * https://photonstorm.github.io/phaser-ce/Phaser.State.html#preload
   * https://photonstorm.github.io/phaser-ce/Phaser.Game.html#load
   */
  preload() {
    // Bild des Helden laden
    this.load.image('held', 'https://raw.githubusercontent.com/BastiTee/noodlejump-stackblitz/master/images/nudeln.png');
    this.mehrBilderLaden();
  }

  /**
   * Diese Funktion wird beim Anlegen des Spiels als erstes ausgeführt.
   * https://photonstorm.github.io/phaser-ce/Phaser.State.html#create
   */
  create() {
    // Ruft eine Funktion aus NoodlejumpAdvanced auf, die einige spezielle
    // Engine-Einstellungen vornimmt und die Welt erzeugt.
    this.weltAnlegen();

    // Hintergrundfarbe 
    // https://photonstorm.github.io/phaser-ce/Phaser.Stage.html#backgroundColor
    this.stage.backgroundColor = '#66BBFF';

    // Eingene Zählvariablen
    this.anzahlSpruenge = 0;
    this.punktzahl = 0;

    // Erstelle Text in linker oberer Ecke um Punkteanzahl anzuzeigen
    this.punkteAnzeige = this.add.text(0, 0, `0 Punkte`);
    // Sorge dafür, dass die Punkteanzeige an die Kamerafahrt gekoppelt ist.
    // Dokumentation: https://photonstorm.github.io/phaser-ce/Phaser.Component.FixedToCamera.html#fixedToCamera
    this.punkteAnzeige.fixedToCamera = true;
  }

  /**
   * Hauptfunktion des Spiels, dass automatisch von der Phaser-Engine
   * in einer Endlosschleife immer wieder aufgerufen wird.
   * https://photonstorm.github.io/phaser-ce/Phaser.State.html#update
   * 
   */
  update() {
    // Programmierung der Kamerafahrt
    this.kameraYMinimum = Math.min(this.kameraYMinimum, this.held.y - this.game.height + 130);
    this.camera.y = this.kameraYMinimum;

    // Spielstandtext aktualisieren	
    this.punkteAnzeige.text = `${this.punktzahl} Punkte`;

    this.weltBewegen();
    this.heldBewegen();
  }

  /**
   * Diese Funktion programmiert die Bewegung des Helden in Abhängigkeit davon,
   * welche Tasten man drückt.
   */
  heldBewegen() {
    let touchEingabeAktiv = this.spielerEingabenAuswerten()

    // Das Spiel hat begonnen wenn..
    // - Touch-Eingabe verwendet
    // - Pfeil-oben gedrückt wurde
    // - bereits einmal gesprungen wurde
    var spielBegonnen = touchEingabeAktiv || this.cursor.up.isDown || this.anzahlSpruenge > 0;

    // Sprung des Helden programmieren
    if (spielBegonnen && this.held.body.touching.down) {
      // Beim ersten Sprung wird die Punktzahl auf 0 gesetzt
      if (this.anzahlSpruenge === 0) {
        this.punktzahl = 0;
        // Danach um 1 erhöht
      } else {
        this.punktzahl += 1;
      }

      // Nach jedem 10-ten Sprung..
      if (this.anzahlSpruenge !== 0 && this.anzahlSpruenge % 10 === 0) {
        // .. mache etwas – zum Beispiel das Spiel schwerer ;)
      }

      // Der eigentliche Sprung bzw. die Bewegung des Helden wird ausgeführt
      this.held.body.velocity.y = -this.velocity;

      // Anzahl der Sprünge mitzählen
      this.anzahlSpruenge = this.anzahlSpruenge + 1;
    }

    this.berechneSonderfaelle();
  }
}

/**
 * Dieser Javascript-Code wird als letztes von der Webseite geladen und 
 * startet das Spiel, dass wir in der Klasse "Noodlejump" erstellt haben.
 */
const game = new Phaser.Game({
  height: 500,
  width: 300,
  renderer: Phaser.CANVAS,
  scaleMode: Phaser.ScaleManager.SHOW_ALL, // Fenstergröße (https://photonstorm.github.io/phaser-ce/Phaser.ScaleManager.html)
  parent: 'container',
  alignH: true,
  alignV: true
});

game.state.add('Noodlejump', Noodlejump);
game.state.start('Noodlejump');
