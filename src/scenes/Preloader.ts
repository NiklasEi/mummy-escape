import * as Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.image('tiles', 'assets/tiles-extruded.png');
    this.load.tilemapTiledJSON('pyramid', 'assets/pyramid.json');
    this.load.atlas('mummy', 'assets/mummy.png', 'assets/mummy.json');
    this.load.audio('backgroundSound', 'assets/sounds/background.ogg');
    this.load.atlas('ghost', 'assets/ghost.png', 'assets/ghost.json');
    this.load.image('vision', 'assets/vision.png');
  }

  create() {
    this.scene.start('game');
  }
}
