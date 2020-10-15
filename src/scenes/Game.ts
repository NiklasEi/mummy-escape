import * as Phaser from 'phaser';
import { createGhostAnims } from '../anims/EnemyAnims';
import { createMummyAnims } from '../anims/MummyAnims';
import Ghost from '../enemies/Ghost';

export default class Game extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private mummy?: Phaser.Physics.Arcade.Sprite;
  private vision?: Phaser.GameObjects.Image;

  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    createMummyAnims(this.anims);
    createGhostAnims(this.anims);
    this.sound.play('backgroundSound', { loop: true, volume: 0.5 });

    // prepare map
    const map = this.make.tilemap({ key: 'pyramid' });
    const tileset = map.addTilesetImage('pyramid', 'tiles', 32, 32, 1, 2);

    const groundLayer = map.createStaticLayer('Ground', tileset);
    const wallsLayer = map.createStaticLayer('Walls', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    // prepare player
    this.mummy = this.physics.add.sprite(430, 670, 'mummy', 'idle-down.png');
    this.mummy.body.setSize(this.mummy.width * 0.6, this.mummy.height * 0.8);
    this.mummy.anims.play('mummy-idle-down');
    this.physics.add.collider(this.mummy, wallsLayer);
    this.cameras.main.startFollow(this.mummy, true);

    // prepare other entities
    const ghosts = this.physics.add.group({
      classType: Ghost,
      createCallback: (gameObj) => {
        const ghostObj = gameObj as Ghost;
        ghostObj.body.onCollide = true;
      }
    });
    const ghost = ghosts.get(430, 700, 'ghost');
    this.physics.add.collider(ghosts, wallsLayer);

    // debug mode to show colliding areas
    // debugMask(wallsLayer, this);

    this.renderVisibility([wallsLayer, groundLayer, ghost]);
  }

  update() {
    if (!this.cursors || !this.mummy) return;

    const speed = 100;
    if (this.cursors.left?.isDown) {
      this.mummy.anims.play('mummy-run-left', true);
      this.mummy.setVelocity(-speed, 0);
      this.vision?.setAngle(180);
    } else if (this.cursors.right?.isDown) {
      this.mummy.anims.play('mummy-run-right', true);
      this.mummy.setVelocity(speed, 0);
      this.vision?.setAngle(0);
    } else if (this.cursors.up?.isDown) {
      this.mummy.anims.play('mummy-run-up', true);
      this.mummy.setVelocity(0, -speed);
      this.vision?.setAngle(-90);
    } else if (this.cursors.down?.isDown) {
      this.mummy.anims.play('mummy-run-down', true);
      this.mummy.setVelocity(0, speed);
      this.vision?.setAngle(90);
    } else {
      const parts = this.mummy.anims.currentAnim.key.split('-');
      parts[1] = 'idle';
      this.mummy.anims.play(parts.join('-'));
      this.mummy.setVelocity(0, 0);
    }

    if (this.vision) {
      this.vision.x = this.mummy.x;
      this.vision.y = this.mummy.y;
    }
  }

  private renderVisibility(entries: any[]) {
    const rt = this.make.renderTexture({ height: 800, width: 800 }, true);

    // fill it with black
    rt.fill(0x000000, 1);

    rt.draw(entries);

    rt.setTint(255);

    this.vision = this.make.image({
      key: 'vision',
      add: false
    });

    this.vision.scale = 3;

    rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision);
  }
}
