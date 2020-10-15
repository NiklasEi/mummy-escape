import * as Phaser from 'phaser';

import Preloader from './scenes/Preloader';
import Game from './scenes/Game';

export default new Phaser.Game({
  title: 'Mummy escape',
  type: Phaser.WEBGL,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [Preloader, Game],
  scale: {
    width: 800,
    height: 800
  },
  parent: 'content',
  backgroundColor: '#000050'
});
