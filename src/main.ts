import * as Phaser from 'phaser';

import Preloader from './scenes/Preloader';
import MainMenu from './scenes/MainMenu';
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
  scene: [Preloader, MainMenu, GameScene, GameUI],
  width: 800,
  height: 800,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  parent: 'content',
  backgroundColor: '#000050'
});
