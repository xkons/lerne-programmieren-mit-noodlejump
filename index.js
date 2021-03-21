import Noodlejump from './spiel.js'
import GameOver from './game-over.js'
import Start from './start.js'

/**
 * Dieser Javascript-Code wird als letztes von der Webseite geladen und 
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

game.state.add('spiel', Noodlejump);
game.state.add('gameover', GameOver);
game.state.add('start', Start)
game.state.start('start'); 
