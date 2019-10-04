export default class GameOver {
    /**
     * Diese Funktion wird ausgeführt, bevor das Spiel geladen wird, um 
     * Bilder zwischenzuspeichern, die das Spiel verwendet.
     * https://photonstorm.github.io/phaser-ce/Phaser.State.html#preload
     * https://photonstorm.github.io/phaser-ce/Phaser.Game.html#load
     */
    preload() {
        this.load.spritesheet('button', './images/nochmal-button.png', 200, 59);
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

        this.letztePunktzahl = localStorage.getItem('punktzahl');
        this.add.text(20, 130, `Erreichte Punktzahl:`);
        this.add.text(this.world.centerX - this.letztePunktzahl.toString().length * 6, 170, this.letztePunktzahl);

        this.gameOverAnzeigen();

        this.add.button(this.world.centerX - 100, 420, 'button', this.wennNochmalGeklickt, this, 2, 1, 0);

        this.highscoreListeAktualisieren(this.letztePunktzahl);
        this.highscoreListeAnzeigen();
    }

    /**
     * Hauptfunktion des Spiels, dass automatisch von der Phaser-Engine
     * in einer Endlosschleife immer wieder aufgerufen wird.
     * https://photonstorm.github.io/phaser-ce/Phaser.State.html#update
     * 
     */
    update() { }

    highscoreListeAktualisieren(letztePunktzahl) {
        var highscore = JSON.parse(localStorage.getItem('highscore'));
        if (!highscore) {
            highscore = [];
        }
        if (highscore.indexOf(letztePunktzahl) === -1) {
            highscore.push(letztePunktzahl);
            highscore.sort((a, b) => b - a);
            localStorage.setItem('highscore', JSON.stringify(highscore));
        }
    }

    highscoreListeAnzeigen() {
        this.add.text(100, 210, `Highscore:`, { font: "bold 20px Arial" });
        var highscore = JSON.parse(localStorage.getItem('highscore'));
        var yoffset = 235;
        highscore.forEach((score, index) => {
            if (index < 8) {
                this.add.text(this.world.centerX - score.toString().length * 5, yoffset, score, { font: "bold 20px Arial" });
                yoffset += 20;
            }
        });
    }

    wennNochmalGeklickt() {
        this.state.start('game');
    }

    gameOverAnzeigen() {
        var bar = this.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(0, 0, 300, 100);
    
        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    
        //  The Text is positioned at 0, 100
        var text = this.add.text(0, 0, "Game Over", style);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    
        //  We'll set the bounds to be from x0, y100 and be 500px wide by 100px high
        text.setTextBounds(0, 0, 300, 100);
      }
}
  