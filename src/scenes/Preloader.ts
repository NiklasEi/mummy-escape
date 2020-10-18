import * as Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    // sound
    this.load.audio('backgroundSound', 'assets/sounds/background.ogg');

    // map
    this.load.image('tiles', 'assets/tiles-extruded.png');
    this.load.tilemapTiledJSON('pyramid', 'assets/pyramid.json');

    // traps
    this.load.atlas('spikes', 'assets/traps/spikes.png', 'assets/traps/spikes.json');

    // vision
    this.load.image('vision', 'assets/vision.png');
    this.load.image('mask', 'assets/mask.png');

    // entities
    this.load.atlas('mummy', 'assets/mummy.png', 'assets/mummy.json');
    this.load.atlas('ghost', 'assets/enemies/ghost1/ghost.png', 'assets/enemies/ghost1/ghost.json');
    this.load.atlas('bat', 'assets/enemies/bat/bat.png', 'assets/enemies/bat/bat.json');
    this.load.image('stone', 'assets/weapons/stone.png');

    // UI
    this.load.image('heart-empty', 'assets/health/heart_empty.png');
    this.load.image('heart-full', 'assets/health/heart_full.png');
    this.load.image('heart-half', 'assets/health/heart_half.png');
    this.load.image('button', 'assets/mainMenu/menu_button.png');
    this.load.image('button-press', 'assets/mainMenu/menu_button_press.png');
  }

  create() {
    this.scene.start('mainMenu');
  }
}
