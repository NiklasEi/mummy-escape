import * as Phaser from 'phaser';
import { debugMask } from '../utils/debug';

export default class Game extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private mummy?: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const map = this.make.tilemap({ key: 'pyramid' });
    const tileset = map.addTilesetImage('pyramid', 'tiles');

    map.createStaticLayer('Ground', tileset);
    const wallsLayer = map.createStaticLayer('Walls', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    // debug mode to show colliding areas
    debugMask(wallsLayer, this);

    this.mummy = this.physics.add.sprite(450, 600, 'mummy', 'idle-down.png');
    this.mummy.body.setSize(this.mummy.width * 0.6, this.mummy.height * 0.9);

    this.anims.create({
      key: 'mummy-idle-down',
      frames: [{ key: 'mummy', frame: 'run-down-1.png' }]
    });

    this.anims.create({
      key: 'mummy-run-down',
      frames: this.anims.generateFrameNames('mummy', { start: 1, end: 3, prefix: 'run-down-', suffix: '.png' }),
      repeat: -1,
      frameRate: 10
    });

    this.anims.create({
      key: 'mummy-run-up',
      frames: this.anims.generateFrameNames('mummy', { start: 1, end: 3, prefix: 'run-up-', suffix: '.png' }),
      repeat: -1,
      frameRate: 10
    });

    this.anims.create({
      key: 'mummy-run-left',
      frames: this.anims.generateFrameNames('mummy', { start: 1, end: 3, prefix: 'run-left-', suffix: '.png' }),
      repeat: -1,
      frameRate: 10
    });

    this.anims.create({
      key: 'mummy-run-right',
      frames: this.anims.generateFrameNames('mummy', { start: 1, end: 3, prefix: 'run-right-', suffix: '.png' }),
      repeat: -1,
      frameRate: 10
    });

    this.mummy.anims.play('mummy-idle-down');

    this.physics.add.collider(this.mummy, wallsLayer);

    this.cameras.main.startFollow(this.mummy, true);

    this.sound.play("background", {loop: true, volume: 0.5});
  }

  update() {
    if (!this.cursors || !this.mummy) return;

    const speed = 100;
    if (this.cursors.left?.isDown) {
      this.mummy.anims.play('mummy-run-left', true);
      this.mummy.setVelocity(-speed, 0);
    } else if (this.cursors.right?.isDown) {
      this.mummy.anims.play('mummy-run-right', true);
      this.mummy.setVelocity(speed, 0);
    } else if (this.cursors.up?.isDown) {
      this.mummy.anims.play('mummy-run-up', true);
      this.mummy.setVelocity(0, -speed);
    } else if (this.cursors.down?.isDown) {
      this.mummy.anims.play('mummy-run-down', true);
      this.mummy.setVelocity(0, speed);
    } else {
      const parts = this.mummy.anims.currentAnim.key.split('-');
      parts[1] = 'idle';
      this.mummy.anims.play(parts.join('-'));
      this.mummy.setVelocity(0, 0);
    }
  }
}
