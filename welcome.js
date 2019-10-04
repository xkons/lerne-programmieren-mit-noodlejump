export default class Welcome {

  /**
   * Diese Funktion wird ausgeführt, bevor das Spiel geladen wird, um 
   * Bilder zwischenzuspeichern, die das Spiel verwendet.
   * https://photonstorm.github.io/phaser-ce/Phaser.State.html#preload
   * https://photonstorm.github.io/phaser-ce/Phaser.Game.html#load
   */
  preload() {
    this.load.spritesheet('button', './images/start-button.png', 200, 73);
    this.load.image('touchanleitung', './images/touch-anleitung.png');
    this.load.image('tastaturanleitung', './images/tastatur-anleitung.png');
  }

  /**
   * Diese Funktion wird beim Anlegen des Spiels als erstes ausgeführt.
   * https://photonstorm.github.io/phaser-ce/Phaser.State.html#create
   */
  create() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.maxWidth = this.game.width;
    this.scale.maxHeight = this.game.height;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    // Hintergrundfarbe 
    // https://photonstorm.github.io/phaser-ce/Phaser.Stage.html#backgroundColor
    this.stage.backgroundColor = '#66BBFF';

    // Spielsteuerung (https://photonstorm.github.io/phaser-ce/Phaser.Input.html)
    this.cursor = this.input.keyboard.createCursorKeys();

    this.spielTitelAnzeigen();

    this.add.button(this.world.centerX - 100, 180, 'button', this.wennStartGeklickt, this, 2, 1, 0);
    this.add.text(100, this.world.height - 230, 'Steuerung', { font: "bold 20px Arial" });
    this.game.add.sprite(0, this.world.height - 100, 'touchanleitung');
    this.game.add.sprite(60, this.world.height - 195, 'tastaturanleitung');

  }

  /**
   * Hauptfunktion des Spiels, dass automatisch von der Phaser-Engine
   * in einer Endlosschleife immer wieder aufgerufen wird.
   * https://photonstorm.github.io/phaser-ce/Phaser.State.html#update
   * 
   */
  update() {}

  wennStartGeklickt() {
    this.state.start('game');
  }

  spielTitelAnzeigen() {
    var bar = this.add.graphics();
    bar.beginFill(0x000000, 0.2);
    bar.drawRect(0, 0, 300, 100);

    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    //  The Text is positioned at 0, 100
    var text = this.add.text(0, 0, "Noodlejump", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

    //  We'll set the bounds to be from x0, y100 and be 500px wide by 100px high
    text.setTextBounds(0, 0, 300, 100);
  }
}
