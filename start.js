export default class Start {
    preload() {
        this.load.spritesheet('start-button', './images/start-button.png', 80, 49)
        this.load.image('touchanleitung', './images/touch-anleitung.png');
        this.load.image('tastaturanleitung', './images/tastatur-anleitung.png');
        this.load.image('max', './images/max-auswahl.png');
        this.load.image('moritz', './images/moritz-auswahl.png');
        this.load.image('moritz-button-maske', './images/moritz-button-maske.png');
    }

    create() {
        this.stage.backgroundColor = '#f3e8d5';

        this.cursor = this.input.keyboard.createCursorKeys();

        this.spielTitelAnzeigen();
        this.add.text(75, 90, "Wähle einen Spieler", { font: "bold 16px Arial", fill: "#000" });
        this.add.button(40, 110, 'max', this.wennMaxGeklickt, this);
        this.add.sprite(this.game.width - 170, 120, 'moritz');
        this.add.button(this.game.width - 160, 120, 'moritz-button-maske', this.wennMoritzGeklickt, this);

        this.add.text(110, this.world.height - 220, 'Steuerung', { font: "bold 16px Arial" });
        this.game.add.sprite(0, this.world.height - 100, 'touchanleitung');
        this.game.add.sprite(60, this.world.height - 195, 'tastaturanleitung');
    }

    wennMaxGeklickt() {
        localStorage.setItem('spieler', 'max');
        this.state.start('spiel');  
    }

    wennMoritzGeklickt() {
        localStorage.setItem('spieler', 'moritz');
        this.state.start('spiel');
    }
  
    spielTitelAnzeigen() {
        var bar = this.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(0, 0, 300, 80);

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        var text = this.add.text(0, 0, "Max & Moritz", style);
        text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        text.setTextBounds(0, 0, 300, 60);

        var text2 = this.add.text(0, 0, "Sechster Streich", { ...style, font: "bold 20px Arial" });
        text2.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        text2.setTextBounds(0, 0, 300, 120);
    }
  }