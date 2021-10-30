import Noodlejump from './game.js'
import Welcome from './welcome.js'
import GameOver from './game-over.js'

/**
 * Dieser Javascript-Code wird als Einstiegspunkt von der Webseite geladen und 
 * startet das Spiel, dass wir in der Klasse "Noodlejump" erstellt haben.
 */

const game = new Phaser.Game({
  height: 500,
  width: 300,
  renderer: Phaser.CANVAS,
  scaleMode: Phaser.ScaleManager.SHOW_ALL, // Fenstergröße (https://photonstorm.github.io/phaser-ce/Phaser.ScaleManager.html)
  parent: 'container',
  alignH: true,
  alignV: true
});
game.state.add('welcome', Welcome);
game.state.add('game', Noodlejump);
game.state.add('gameover', GameOver)
game.state.start('welcome');