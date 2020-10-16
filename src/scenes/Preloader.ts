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
    this.load.image('heart-empty', 'assets/health/heart_empty.png');
    this.load.image('heart-full', 'assets/health/heart_full.png');
    this.load.image('heart-half', 'assets/health/heart_half.png');
    this.load.image('staff', 'assets/weapons/staff.png');
    this.load.image('button', 'assets/mainMenu/menu_button.png');
    this.load.image('button-press', 'assets/mainMenu/menu_button_press.png');
  }

  create() {
    this.scene.start('mainMenu');
  }
}
