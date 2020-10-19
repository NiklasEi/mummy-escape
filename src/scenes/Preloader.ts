import * as Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    // sound
    this.load.audio('backgroundSound', 'assets/sounds/background.ogg');

    // map
    this.load.image('tiles', 'assets/maps/tiles-extruded.png');
    this.load.image('decotiles', 'assets/maps/dungeon-tileset-extruded.png');
    this.load.image('decotiles2', 'assets/maps/decoration-tileset-extruded.png');
    this.load.tilemapTiledJSON('pyramid', 'assets/maps/pyramid.json');

    // traps
    this.load.atlas('spikes', 'assets/traps/spikes.png', 'assets/traps/spikes.json');

    // vision
    this.load.image('vision', 'assets/vision.png');
    this.load.image('mask', 'assets/mask.png');

    // entities
    this.load.atlas('mummy', 'assets/mummy.png', 'assets/mummy.json');
    this.load.atlas('ghost', 'assets/enemies/ghost1/ghost.png', 'assets/enemies/ghost1/ghost.json');
    this.load.atlas('bat', 'assets/enemies/bat/bat.png', 'assets/enemies/bat/bat.json');
    this.load.atlas('chest', 'assets/chest/chest-full.png', 'assets/chest/chest-full.json');
    this.load.image('torch', 'assets/weapons/torch.png');
    this.load.image('stone', 'assets/weapons/stone.png');
    this.load.image('stone1', 'assets/weapons/stone1.png');
    this.load.image('stone2', 'assets/weapons/stone2.png');

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
