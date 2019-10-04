/**
 * Diese Klasse enthält fortgeschrittene Funktionen des Noodlejumpspiels.
 * Zum Beispiel werden hier die Plattformen und der Held erzeugt und auch
 * einige Sonderfälle bei der Bewegung der Welt programmiert.
 */
export default class NoodlejumpAdvanced {

  /**
   * Lädt einige weitere Bilder, die für das Spiel nötig sind im Rahmen
   * der preload() Funktion von Phaser.
   */
  mehrBilderLaden() {
    // Pixelbild laden (wird für die Plattformen verwendet)
    this.load.image('pixel', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/836/pixel_1.png');
  }

  /**
   * Am Spielende löscht diese Funktion alle erzeugten Objekte.
   * https://photonstorm.github.io/phaser-ce/Phaser.State.html#shutdown
   */
  shutdown() {
    this.world.setBounds(0, 0, this.game.width, this.game.height);
    this.cursor = null;
    this.held.destroy();
    this.held = null;
    this.plattformen.destroy();
    this.plattformen = null;
  }

  /**
   * Konfiguriert die Spielwelt, indem einige Funktionen der Phaserengine
   * angesteuert werden und danach die Spielelemente (Held und Plattformen)
   * erzeugt werden.
   */
  weltAnlegen() {
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
    this.kameraYMinimum = 99999;
    this.plattformenYMinimum = 99999;

    // Variable, um zu verfolgen, ob gerade eine Taste gedrückt wird
    this.touchEingabeNochAktiv = false;

    // Plattformen anlegen
    this.plattformenAnlegen();
    // Held anlegen
    this.heldAnlegen();
  }

  /**
   * Legt die Plattformen für das Spiel an. Hier wird add()
   * verwendet, um neue Spielobjekte anzulegen.
   * https://photonstorm.github.io/phaser-ce/Phaser.Game.html#add
   */
  plattformenAnlegen() {
    // Neue Gruppe für Plattformen anlegen (https://photonstorm.github.io/phaser-ce/Phaser.Group.html)
    this.plattformen = this.add.group();
    this.plattformen.enableBody = true;
    this.plattformen.createMultiple(10, 'pixel');

    // Legen die "Boden"-Plattform an, die man am Anfang des Spiels sieht
    this.einePlattformAnlegen(-16, this.world.height - 16, this.world.width + 16);
    // Legt weitere Plattformen an, die zufällig angeordnet werden
    for (var i = 0; i < 9; i++) {
      this.einePlattformAnlegen(
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
  einePlattformAnlegen(x, y, width) {
    var plattform = this.plattformen.getFirstDead();
    plattform.reset(x, y);
    plattform.scale.x = width;
    plattform.scale.y = 16;
    plattform.body.immovable = true;
    return plattform;
  }

  /**
   * Legt den Helden des Spiels an. Hier wird add()
   * verwendet, um neue Spielobjekte anzulegen.
   * https://photonstorm.github.io/phaser-ce/Phaser.Game.html#add
   */
  heldAnlegen() {
    // Neuen "Sprite" anlegen (https://photonstorm.github.io/phaser-ce/Phaser.GameObjectFactory.html#sprite)
    this.held = this.game.add.sprite(this.world.centerX, this.world.height - 36, 'held');
    this.held.anchor.set(0.5);
    // Sprungkraft des Helden
    this.velocity = 350;

    // Verfolge, wo der Held beginnt und wie weit er sich davon entfernt hat (vertikal = yChange)
    this.held.yOrig = this.held.y;
    this.held.yChange = 0;

    // Kollisionen mit den Plattformen einstellen. Wir stellen es so ein, 
    // dass der Held nur mit den Füßen mit Plattformen kollidiert

    // Arcade-Physik (https://photonstorm.github.io/phaser-ce/Phaser.Physics.Arcade.html)
    this.physics.arcade.enable(this.held);
    // Anziehungskraft des Helden
    this.held.body.gravity.y = 500;
    // Kollisionen mit anderen Objekten, d.h. mit Plattformen
    this.held.body.checkCollision.up = false;
    this.held.body.checkCollision.left = false;
    this.held.body.checkCollision.right = false;
  }

  /**
   * Hilfsmethode, um herauszufinden ob mit der Maus (mousePointer) oder
   * dem Finger (pointer1) in der Spielwelt geklickt wurde.
   */
  pruefeAktiveTouchEingabe() {
    if (this.input.mousePointer.isDown) {
      return this.input.mousePointer;
    } else if (this.input.pointer1.isDown) {
      return this.input.pointer1;
    }
    return null; // Nichts von beidem
  }

  /**
 * Prüft, ob der Spieler eine der gültigen Eingabe (Pfeiltasten, Mausklick
 * oder Toucheingabe) verwendet hat und setzt die Weite und Richtung für
 * den nächsten Sprung.
 */
  spielerEingabenAuswerten() {
    // Touch Pointer (Maus oder Finger)
    let touchEingabeAktiv = this.pruefeAktiveTouchEingabe();
    if (touchEingabeAktiv) {
      // Bei Touch-Eingabe wird nur einmal die Sprungweite berechnet und
      // beibehalten. Danach muss erst wieder losgelassen werden.
      if (!this.touchEingabeNochAktiv) {
        var eingabeLinks = this.game.scale.width / 2 > touchEingabeAktiv.x;
        if (eingabeLinks) {
          this.held.body.velocity.x = -200;
        } else {
          // eingabe rechts
          this.held.body.velocity.x = 200;
        }
        this.touchEingabeNochAktiv = true;
      }
    } else if (this.cursor.left.isDown) {
      // Pfeil-Links Taste
      this.held.body.velocity.x = -200;
    } else if (this.cursor.right.isDown) {
      // Pfeil-Rechts Taste
      this.held.body.velocity.x = 200;
    } else {
      // Ansonsten..  
      this.touchEingabeNochAktiv = false;
      this.held.body.velocity.x = 0;
    }
    return touchEingabeAktiv;
  }

  /**
   * Enthält einige spezielle Funktionen, die bei der Bewegung des Helden
   * (in heldBewegen()) auftreten können.
   */
  berechneSonderfaelle() {
    // "Wrap" klappt die Ränder der Welt um, so dass man z.B. über den rechten
    // Weltrand wieder zum linken Rand kommt.
    this.world.wrap(this.held, this.held.width / 2, false);

    // Verfolge den gesamten Weg, den der Held zurückgelegt hat
    this.held.yChange = Math.max(this.held.yChange, Math.abs(this.held.y - this.held.yOrig));

    // Wenn der Held aus der Sicht der Kamera fällt, ist das Spiel vorbei
    if (this.held.y > this.kameraYMinimum + this.game.height && this.held.alive) {
      this.state.start('gameover');
    }
  }

  /**
   * Berechnet die Scrollbewegung der Spielwelt und die Kollisionen des
   * Helden mit den Plattformen. Außerdem werden hier neue Plattformen
   * berechnet, falls eine Plattform aus der Kamerasicht verschwindet.
   */
  weltBewegen() {
    // Scrolling der Welt. Der Y-Offset (yChange) und die Höhe der Welt
    // wird angepasst an den höchsten Punkt, den der Held erreicht hat.
    // (https://photonstorm.github.io/phaser-ce/Phaser.World.html#setBounds)
    this.world.setBounds(0, -this.held.yChange,
      this.world.width, this.game.height + this.held.yChange);

    // Kollisionen und Bewegung des Helden
    this.physics.arcade.collide(this.held, this.plattformen);

    // Prüfe für jede Plattform..
    this.plattformen.forEachAlive(function (elem) {
      // .. ob sie die höchste ist
      this.plattformenYMinimum = Math.min(this.plattformenYMinimum, elem.y);
      // .. ob sie aus der Kamerasicht verschwunden ist..
      if (elem.y > this.camera.y + this.game.height) {
        // .. wenn ja, lösche sie ..
        elem.kill();
        // .. und lege eine neue oberhalb der höchsten an
        this.einePlattformAnlegen(
          // X-Achse; Ausrichtung links/rechts
          this.rnd.integerInRange(0, this.world.width - 50),
          // Y-Achse; Ausrichtung oben/unten
          this.plattformenYMinimum - 100,
          // Breite der Plattform 
          50);
      }
    }, this);
  }
}
