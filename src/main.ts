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
    width: window.innerWidth,
    height: window.innerHeight
  },
  parent: 'game',
  backgroundColor: '#000000'
});