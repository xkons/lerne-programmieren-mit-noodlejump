/**
 * Die Klasse Noodlejump ist verantwortlich für die Spiellogik und all das,
 * was man auf dem Bildschirm sieht. Sie nutzt eine Programmbibliothek
 * names "Phaser". Phaser ist eine Spiele-Engine, wie auch Unreal oder Unity.
 * Nur eben für den Browser.
 * 
 * Die Funktionen preload(), create(), shutdown() und update() steuern
 * den State (Zustand) von Phaser direkt an. 
 * https://photonstorm.github.io/phaser-ce/Phaser.State.html
 * 
 * Alle anderen Funktionen sind spezifisch für dieses Spiel.
 * 
 */
class Noodlejump {

  /**
   * Diese Funktion wird ausgeführt, bevor das Spiel geladen wird, um 
   * Bilder zwischenzuspeichern, die das Spiel verwendet.
   * https://photonstorm.github.io/phaser-ce/Phaser.State.html#preload
   * https://photonstorm.github.io/phaser-ce/Phaser.Game.html#load
   */
  preload() {
    // Bild des Helden laden
    this.load.image('hero', 'https://raw.githubusercontent.com/BastiTee/noodlejump/master/images/dog.png');
    // Pixelbild laden (wird für die Plattformen verwendet)
    this.load.image('pixel', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/836/pixel_1.png');
  }

  /**
   * Diese Funktion wird beim Anlegen des Spiels als erstes ausgeführt.
   * Vor allem wird hier das Spielfeld erzeugt.
   * https://photonstorm.github.io/phaser-ce/Phaser.State.html#create
   */
  create() {
    // Hintergrundfarbe (https://photonstorm.github.io/phaser-ce/Phaser.Stage.html#backgroundColor)
    this.stage.backgroundColor = '#66BBFF';

    // Fenstergröße (https://photonstorm.github.io/phaser-ce/Phaser.ScaleManager.html)
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.maxWidth = this.game.width;
    this.scale.maxHeight = this.game.height;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // Spielphysik (https://photonstorm.github.io/phaser-ce/Phaser.Physics.html)
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // Spielsteuerung (https://photonstorm.github.io/phaser-ce/Phaser.Input.html)
    this.cursor = this.input.keyboard.createCursorKeys();

    // Variablen, um Kamera und Plattformen zu verfolgen
    this.cameraYMin = 99999;
    this.platformYMin = 99999;

    // Variable, um zu verfolgen, ob gerade eine Taste gedrückt wird
    this.buttonPressed = false;

    // Plattformen anlegen
    this.platformsCreate();
    // Held anlegen
    this.heroCreate();

    // Variablen um die Punktzahlen zu berechnen und anzuzeigen
    this.jumpCount = 0;
    this.score = 0;
    this.scoreText = this.add.text(0, 0, `0 Punkte`);
  }

  /**
   * Am Spielende löscht diese Funktion alle erzeugten Objekte.
   * https://photonstorm.github.io/phaser-ce/Phaser.State.html#shutdown
   */
  shutdown() {
    this.world.setBounds(0, 0, this.game.width, this.game.height);
    this.cursor = null;
    this.hero.destroy();
    this.hero = null;
    this.platforms.destroy();
    this.platforms = null;
  }

  /**
   * Hauptfunktion des Spiels, dass automatisch von der Phaser-Engine
   * aufgerufen wird.
   * https://photonstorm.github.io/phaser-ce/Phaser.State.html#update
   * 
   */
  update() {
    // Scrolling der Welt. Der Y-Offset (yChange) und die Höhe der Welt
    // wird angepasst an den höchsten Punkt, den der Held erreicht hat.
    // (https://photonstorm.github.io/phaser-ce/Phaser.World.html#setBounds)
    this.world.setBounds(0, -this.hero.yChange,
      this.world.width, this.game.height + this.hero.yChange);

    // Programmierung der Kamerafahrt
    this.cameraYMin = Math.min(
      this.cameraYMin,
      this.hero.y - this.game.height + 130);
    this.camera.y = this.cameraYMin;

    // Positionieren der Punktezahl innerhalb der Welt
    this.scoreText.y = Math.min(this.cameraYMin, 0);
    this.scoreText.text = `${this.score} Punkte`;

    // Kollisionen und Bewegung des Helden
    this.physics.arcade.collide(this.hero, this.platforms);
    this.heroMove();

    // Prüfe für jede Plattform..
    this.platforms.forEachAlive(function (elem) {
      // .. ob sie die höchste ist
      this.platformYMin = Math.min(this.platformYMin, elem.y);
      // .. ob sie aus der Kamerasicht verschwunden ist..
      if (elem.y > this.camera.y + this.game.height) {
        // .. wenn ja, lösche sie ..
        elem.kill();
        // .. und lege eine neue oberhalb der höchsten an
        this.platformsCreateOne(
          // X-Achse; Ausrichtung links/rechts
          this.rnd.integerInRange(0, this.world.width - 50),
          // Y-Achse; Ausrichtung oben/unten
          this.platformYMin - 100,
          // Breite der Plattform 
          50);
      }
    }, this);
  }

  /**
   * Legt die Plattformen für das Spiel an. Hier wird add()
   * verwendet, um neue Spielobjekte anzulegen.
   * https://photonstorm.github.io/phaser-ce/Phaser.Game.html#add
   */
  platformsCreate() {
    // Neue Gruppe für Plattformen anlegen (https://photonstorm.github.io/phaser-ce/Phaser.Group.html)
    this.platforms = this.add.group();
    this.platforms.enableBody = true;
    this.platforms.createMultiple(10, 'pixel');

    // Legen die "Boden"-Plattform an, die man am Anfang des Spiels sieht
    this.platformsCreateOne(-16, this.world.height - 16, this.world.width + 16);
    // Legt weitere Plattformen an, die zufällig angeordnet werden
    for (var i = 0; i < 9; i++) {
      this.platformsCreateOne(
        // X-Achse; Ausrichtung links/rechts
        this.rnd.integerInRange(0, this.world.width - 50),
        // Y-Achse; Ausrichtung oben/unten
        this.world.height - 100 - 100 * i,
        // Breite der Plattform 
        50);
    }
  }

  /**
   * Hilfsfunktion, um eine einzelne Plattform anzulegen.
   * 
   * @param x  X-Achse; Ausrichtung links/rechts
   * @param y  Y-Achse; Ausrichtung oben/unten
   * @param width  Breite der Plattform 
   */
  platformsCreateOne(x, y, width) {
    var platform = this.platforms.getFirstDead();
    platform.reset(x, y);
    platform.scale.x = width;
    platform.scale.y = 16;
    platform.body.immovable = true;
    return platform;
  }

  /**
   * Legt den Helden des Spiels an. Hier wird add()
   * verwendet, um neue Spielobjekte anzulegen.
   * https://photonstorm.github.io/phaser-ce/Phaser.Game.html#add
   */
  heroCreate() {
    // Neuen "Sprite" anlegen (https://photonstorm.github.io/phaser-ce/Phaser.GameObjectFactory.html#sprite)
    this.hero = game.add.sprite(this.world.centerX, this.world.height - 36, 'hero');
    this.hero.anchor.set(0.5);
    // Sprungkraft des Helden
    this.velocity = 350;

    // Verfolge, wo der Held beginnt und wie weit er sich davon entfernt hat (vertikal = yChange)
    this.hero.yOrig = this.hero.y;
    this.hero.yChange = 0;

    // Kollisionen mit den Plattformen einstellen. Wir stellen es so ein, 
    // dass der Held nur mit den Füßen mit Plattformen kollidiert

    // Arcade-Physik (https://photonstorm.github.io/phaser-ce/Phaser.Physics.Arcade.html)
    this.physics.arcade.enable(this.hero);
    // Anziehungskraft des Helden
    this.hero.body.gravity.y = 500;
    // Kollisionen mit anderen Objekten, d.h. mit Plattformen
    this.hero.body.checkCollision.up = false;
    this.hero.body.checkCollision.left = false;
    this.hero.body.checkCollision.right = false;
  }

  getActivePointer() {
    if (this.input.mousePointer.isDown) {
      return this.input.mousePointer;
    } else if (this.input.pointer1.isDown) {
      return this.input.pointer1;
    }
    return null;
  }

  /**
   * Diese Funktion programmiert die Bewegung des Helden in Abhängigkeit davon,
   * welche Tasten man drückt.
   */
  heroMove() {
    // Festlegen des Touch Pointer (mousePointer für Maus; pointer1 für Finger)
    const pointer = this.getActivePointer();

    // Links-/Rechts-Bewegungen des Helden programmieren
    if (pointer) {
      // Beim Touch-Input wird nur einmal die Sprungweite berechnet.
      // Danach muss erst wieder losgelassen werden.
      if (!this.buttonPressed) {
        var distanceFactor = pointer.x - this.hero.x;
        this.hero.body.velocity.x = distanceFactor <= 0 ? -200 : 200;
        this.buttonPressed = true;
      }
    } else if (this.cursor.left.isDown) {
      this.hero.body.velocity.x = -200;
    } else if (this.cursor.right.isDown) {
      this.hero.body.velocity.x = 200;
    } else {
      this.buttonPressed = false;
      this.hero.body.velocity.x = 0;
    }

    // Das Spiel hat begonnen wenn..
    // - Maus geklickt wurde (pointer via getActivePointer())
    // - ein Finger-Touch ausgeführt wurde (pointer via getActivePointer())
    // - Pfeil-oben gedrückt wurde
    // - bereits einmal gesprungen wurde
    var gameStarted = pointer || this.cursor.up.isDown || this.jumpCount > 0;

    // Sprung des Helden programmieren
    if (gameStarted && this.hero.body.touching.down) {
      // Beim ersten Sprung wird die Punktzahl auf 0 gesetzt
      if (this.jumpCount === 0) {
        this.score = 0;
        // Danach um 1 erhöht
      } else {
        this.score += 1;
      }

      // Spielstand aktualisieren
      this.scoreText.text = `${this.score} Punkte`;

      // Nach jedem 10-ten Sprung..
      if (this.jumpCount % 10 === 0) {
        // .. mache etwas – zum Beispiel das Spiel schwerer ;)
      }

      // Der eigentliche Sprung
      this.hero.body.velocity.y = -this.velocity;

      // Anzahl der Sprünge mitzählen
      this.jumpCount = this.jumpCount + 1;
    }

    // "Wrap" klappt die Ränder der Welt um, so dass man z.B. über den rechten
    // Spielfeldrand wieder zum linken Rand kommt.
    this.world.wrap(this.hero, this.hero.width / 2, false);

    // Verfolge den gesamten Weg, den der Held zurückgelegt hat
    this.hero.yChange = Math.max(this.hero.yChange, Math.abs(this.hero.y - this.hero.yOrig));

    // Wenn der Held aus der Sicht der Kamera fällt, ist das Spiel vorbei
    if (this.hero.y > this.cameraYMin + this.game.height && this.hero.alive) {
      this.state.start('Noodlejump');
    }
  }
}

/**
 * Dieser Javascript-Code wird als letztes von der Webseite geladen und 
 * startet das Spiel, dass wir in der Klasse "Noodlejump" erstellt haben.
 */
const game = new Phaser.Game(300, 500, Phaser.CANVAS, '');
game.state.add('Noodlejump', Noodlejump);
game.state.start('Noodlejump');
