import Noodlejump from './game.js'
import Welcome from './welcome.js'
import GameOver from './game-over.js'

/**
 * Dieser Javascript-Code wird als Einstiegspunkt von der Webseite geladen und 
 * startet das Spiel, dass wir in der Klasse "Noodlejump" erstellt haben.
 */
const game = new Phaser.Game(300, 500, Phaser.CANVAS, 'noodlejump');
game.state.add('welcome', Welcome);
game.state.add('game', Noodlejump);
game.state.add('gameover', GameOver)
game.state.start('welcome');