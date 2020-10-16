import * as Phaser from 'phaser';

import Preloader from './scenes/Preloader';
import GameScene from './scenes/GameScene';
import GameUI from './scenes/GameUI';

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
  scene: [Preloader, GameScene, GameUI],
  scale: {
    width: 800,
    height: 800
  },
  parent: 'content',
  backgroundColor: '#000050'
});
