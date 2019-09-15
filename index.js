/**
 * Diese Javascript Datei wird als letztes von der Webseite geladen und 
 * startet das Spiel.
 */
const game = new Phaser.Game(300, 500, Phaser.CANVAS, '');
game.state.add('Noodlejump', Noodlejump);
game.state.start('Noodlejump');
