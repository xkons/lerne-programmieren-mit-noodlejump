class Noodlejump {

  /**
   * Diese Funktion wird ausgeführt, bevor das Spiel geladen wird, um 
   * Bilder zwischenzuspeichern, die das Spiel verwendet.
   * https://phaser.io/docs/2.6.2/Phaser.Game.html#load
   */
  preload() {
    // Bild des "Hero" laden
    this.load.image('hero', 'https://raw.githubusercontent.com/BastiTee/noodlejump/master/images/dog.png');
    // Pixelbild laden (wird für die Plattformen verwendet)
    this.load.image('pixel', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/836/pixel_1.png');
  }

  /**
   * Diese Funktion wird beim Anlegen des Spiels als erstes ausgeführt.
   * Vor allem wird hier das Spielfeld erzeugt.
   */
  create() {
    // Hintergrundfarbe (https://phaser.io/docs/2.6.2/Phaser.Stage.html#backgroundColor)
    this.stage.backgroundColor = '#66BBFF';

    // Fenstergröße (https://phaser.io/docs/2.6.2/Phaser.ScaleManager.html)
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.maxWidth = this.game.width;
    this.scale.maxHeight = this.game.height;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // Spielphysik (https://phaser.io/docs/2.6.2/Phaser.Physics.html)
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // Spielsteuerung (https://phaser.io/docs/2.6.2/Phaser.Input.html)
    this.cursor = this.input.keyboard.createCursorKeys();

    // Variablen, um Kamera und Plattformen zu verfolgen
    this.cameraYMin = 99999;
    this.platformYMin = 99999;

    // Plattformen anlegen
    this.platformsCreate();
    // Hero anlegen
    this.heroCreate();

    // Variablen um die Punktzahlen zu berechnen und anzuzeigen
    this.jumpCount = 0;
    this.score = 0;
    this.scoreText = this.add.text(0, 0, `0 Punkte`);
  }

  /**
   * Am Spielende löscht diese Funktion alle erzeugten Objekte.
   */
  shutdown() {
    // reset everything, or the world will be messed up
    this.world.setBounds(0, 0, this.game.width, this.game.height);
    this.cursor = null;
    this.hero.destroy();
    this.hero = null;
    this.platforms.destroy();
    this.platforms = null;
  }

  update() {
    // this is where the main magic happens
    // the y offset and the height of the world are adjusted
    // to match the highest point the hero has reached
    this.world.setBounds(0, -this.hero.yChange, this.world.width, this.game.height + this.hero.yChange);

    // the built in camera follow methods won't work for our needs
    // this is a custom follow style that will not ever move down, it only moves up
    this.cameraYMin = Math.min(this.cameraYMin, this.hero.y - this.game.height + 130);
    this.camera.y = this.cameraYMin;

    this.scoreText.y = Math.min(this.cameraYMin, 0);
    this.scoreText.text = `${this.score} Punkte`;

    // hero collisions and movement
    this.physics.arcade.collide(this.hero, this.platforms);
    this.heroMove();

    // for each plat form, find out which is the highest
    // if one goes below the camera view, then create a new one at a distance from the highest one
    // these are pooled so they are very performant
    this.platforms.forEachAlive(function (elem) {
      this.platformYMin = Math.min(this.platformYMin, elem.y);
      if (elem.y > this.camera.y + this.game.height) {
        elem.kill();
        this.platformsCreateOne(this.rnd.integerInRange(0, this.world.width - 50), this.platformYMin - 100, 50);
      }
    }, this);
  }

  /**
   * Legt die Plattformen für das Spiel an. Hier wird add()
   * verwendet, um neue Spielobjekte anzulegen.
   * https://phaser.io/docs/2.6.2/Phaser.Game.html#add
   */
  platformsCreate() {
    // Neue Gruppe für Plattformen anlegen (https://phaser.io/docs/2.6.2/Phaser.Group.html)
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
   * https://phaser.io/docs/2.6.2/Phaser.Game.html#add
   */
  heroCreate() {
    // Neuen "Sprite" anlegen (https://phaser.io/docs/2.6.2/Phaser.GameObjectFactory.html#sprite)
    this.hero = game.add.sprite(this.world.centerX, this.world.height - 36, 'hero');
    this.hero.anchor.set(0.5);
    // Sprungkraft des Helden
    this.velocity = 350;

    // Verfolge, wo der Held beginnt und wie weit er sich davon entfernt hat (vertikal = yChange)
    this.hero.yOrig = this.hero.y;
    this.hero.yChange = 0;

    // Kollisionen mit den Plattformen einstellen. Wir stellen es so ein, 
    // dass der Held nur mit den Füßen mit Plattformen kollidiert

    // Arcade-Physik (https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.html)
    this.physics.arcade.enable(this.hero);
    // Anziehungskraft des Helden
    this.hero.body.gravity.y = 500;
    // Kollisionen mit anderen Objekten, d.h. mit Plattformen
    this.hero.body.checkCollision.up = false;
    this.hero.body.checkCollision.left = false;
    this.hero.body.checkCollision.right = false;
  }

  /**
   * Diese Funktion programmiert die Bewegung des Helden in Abhängigkeit davon,
   * welche Tasten man drückt.
   */
  heroMove() {
    // Links-/Rechts-Bewegungen des Helden programmieren
    if (this.cursor.left.isDown) {
      this.hero.body.velocity.x = -200;
    } else if (this.cursor.right.isDown) {
      this.hero.body.velocity.x = 200;
    } else {
      this.hero.body.velocity.x = 0;
    }

    // Sprung des Helden programmieren
    if (
      (this.cursor.up.isDown || this.jumpCount > 0) &&
      this.hero.body.touching.down
    ) {
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
