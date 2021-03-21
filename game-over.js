export default class GameOver {
    preload() {
        this.load.spritesheet('button', './images/nochmal-button.png', 194, 49);
        this.load.image('game-over', './images/game-over.jpg', 500, 334);
    }

    create() {
        this.stage.backgroundColor = '#f3e8d5';
        this.cursor = this.input.keyboard.createCursorKeys();

        this.letztePunktzahl = localStorage.getItem('punktzahl') || 0;
        this.add.text(
            60,
            220,
            `Erreichte Punktzahl`,
            {
                fontSize: 20,
            });
        this.add.text(
            this.world.centerX - this.letztePunktzahl.toString().length * 6,
            250,
            this.letztePunktzahl,
            {
                fontSize: 20,
            }
        );

        this.gameOverAnzeigen();

        this.add.button(this.world.centerX - 97, 420, 'button', this.wennNochmalGeklickt, this, 2, 1, 0);

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
        this.add.text(100, 275, `Highscore`, { font: "bold 20px Arial" });
        var highscore = JSON.parse(localStorage.getItem('highscore'));
        var yoffset = 300;
        highscore.forEach((score, index) => {
            if (index < 5) {
                this.add.text(this.world.centerX - score.toString().length * 5, yoffset, score, { font: "bold 20px Arial" });
                yoffset += 20;
            }
        });
    }

    wennNochmalGeklickt() {
        this.state.start('spiel');
    }

    gameOverAnzeigen() {
        const baecker = this.add.sprite(0, 20, 'game-over');
        baecker.scale.setTo(0.6,0.6);

        var style = { font: "bold 20px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" };

        var text = this.add.text(0, 0, "Der Bäcker hat dich erwischt", style);
        text.setTextBounds(0, 0, 300, 40);
      }
}
