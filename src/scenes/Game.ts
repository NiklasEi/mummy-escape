import * as Phaser from 'phaser';
import { debugMask } from '../utils/debug';
import { createGhostAnims } from '../anims/EnemyAnims';
import { createMummyAnims } from '../anims/MummyAnims';
import Ghost from '../enemies/Ghost';

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
    createMummyAnims(this.anims);
    createGhostAnims(this.anims);

    const map = this.make.tilemap({ key: 'pyramid' });
    const tileset = map.addTilesetImage('pyramid', 'tiles', 32, 32, 1, 2);

    map.createStaticLayer('Ground', tileset);
    const wallsLayer = map.createStaticLayer('Walls', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    // debug mode to show colliding areas
    debugMask(wallsLayer, this);

    this.mummy = this.physics.add.sprite(450, 600, 'mummy', 'idle-down.png');
    this.mummy.body.setSize(this.mummy.width * 0.6, this.mummy.height * 0.8);

    this.mummy.anims.play('mummy-idle-down');

    this.cameras.main.startFollow(this.mummy, true);

    this.sound.play('background', { loop: true, volume: 0.5 });

    const ghosts = this.physics.add.group({
      classType: Ghost,
      createCallback: (gameObj) => {
        const ghostObj = gameObj as Ghost;
        ghostObj.body.onCollide = true;
      }
    });

    ghosts.get(430, 700, 'ghost');

    this.physics.add.collider(this.mummy, wallsLayer);
    this.physics.add.collider(ghosts, wallsLayer);

    this.lights.enable().setAmbientColor(0x000000);
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
