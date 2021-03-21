export default class GameOver {
    preload() {
        this.load.spritesheet('button', './images/nochmal-button.png', 200, 59);
    }

    create() {
        this.stage.backgroundColor = '#66BBFF';
        this.cursor = this.input.keyboard.createCursorKeys();

        this.letztePunktzahl = localStorage.getItem('punktzahl');
        this.add.text(20, 130, `Erreichte Punktzahl:`);
        this.add.text(this.world.centerX - this.letztePunktzahl.toString().length * 6, 170, this.letztePunktzahl);

        this.gameOverAnzeigen();

        this.add.button(this.world.centerX - 100, 420, 'button', this.wennNochmalGeklickt, this, 2, 1, 0);

        this.highscoreListeAktualisieren(this.letztePunktzahl);
        this.highscoreListeAnzeigen();
    }

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
        this.state.start('spiel');
    }

    gameOverAnzeigen() {
        var bar = this.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(0, 0, 300, 100);

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        var text = this.add.text(0, 0, "Game Over", style);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        text.setTextBounds(0, 0, 300, 100);
      }
}
