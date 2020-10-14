import * as Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles', 'assets/tileset.png');
    this.load.tilemapTiledJSON('pyramid', 'assets/pyramid.json');
    this.load.atlas('mummy', 'assets/mummy.png', 'assets/mummy.json');
    this.load.audio('background', 'assets/sounds/background.ogg');
    this.load.atlas('ghost', 'assets/ghost.png', 'assets/ghost.json');
  }

  create() {
    this.scene.start('game');
  }
}
