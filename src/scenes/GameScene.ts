import * as Phaser from 'phaser';
import { createGhostAnims } from '../anims/EnemyAnims';
import { createMummyAnims } from '../anims/MummyAnims';
import { sceneEvents } from '../events/EventCenter';

import Ghost from '../enemies/Ghost';
import '../mummy/Mummy';

interface Position {
  x: number;
  y: number;
}

export default class GameScene extends Phaser.Scene {
  private readonly mapSize = 65;
  private readonly mummyStartingPosition: Position = {
    x: 1090,
    y: 1280
  };
  private readonly ghostStartingPosition: Position = {
    x: 1070,
    y: 1300
  };
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private mummy?: Phaser.Physics.Arcade.Sprite;
  private ghosts!: Phaser.Physics.Arcade.Group;
  private staffs!: Phaser.Physics.Arcade.Group;
  private vision?: Phaser.GameObjects.Image;
  private playerGhostCollider?: Phaser.Physics.Arcade.Collider;

  private handleAttackByGhost(_: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    if (!this.mummy) {
      return;
    }
    const ghost = obj2 as Ghost;

    const dx = this.mummy.x - ghost.x;
    const dy = this.mummy.y - ghost.y;

    const newDirection = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    // @ts-ignore-next-line
    this.mummy.handleDamage(newDirection);
    // @ts-ignore-next-line
    sceneEvents.emit('health-damage', this.mummy.health);

    // @ts-ignore-next-line
    if (this.mummy.health <= 0) {
      this.playerGhostCollider?.destroy();
    }
  }

  private handleAttackGhost(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    this.staffs.killAndHide(obj1);
    this.ghosts.killAndHide(obj2);
  }

  private handleStaffWallCollision(obj1: Phaser.GameObjects.GameObject, _: Phaser.GameObjects.GameObject) {
    this.staffs.killAndHide(obj1);
  }

  constructor() {
    super('game');
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run('gameUI');

    createMummyAnims(this.anims);
    createGhostAnims(this.anims);
    //     this.sound.play('backgroundSound', { loop: true, volume: 0.5 });

    // prepare map
    const map = this.make.tilemap({ key: 'pyramid' });
    const tileset = map.addTilesetImage('pyramid', 'tiles', 32, 32, 1, 2);

    map.createStaticLayer('Ground', tileset);
    const wallsLayer = map.createStaticLayer('Walls', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    // prepare player before wall so it walks through doors, not over them
    this.mummy = this.add.mummy(this.mummyStartingPosition.x, this.mummyStartingPosition.y, 'mummy');

    this.cameras.main.startFollow(this.mummy, true);

    this.staffs = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3
    });

    // @ts-ignore-next-line
    this.mummy.giveStaffs(this.staffs);

    // prepare other entities
    this.ghosts = this.physics.add.group({
      classType: Ghost,
      createCallback: (gameObj) => {
        const ghostObj = gameObj as Ghost;
        ghostObj.body.onCollide = true;
      }
    });

    this.ghosts.get(this.ghostStartingPosition.x, this.ghostStartingPosition.y, 'ghost');

    // add colliders
    this.physics.add.collider(this.mummy, wallsLayer);
    this.physics.add.collider(this.ghosts, wallsLayer);
    this.physics.add.collider(this.staffs, this.ghosts, this.handleAttackGhost, undefined, this);
    this.physics.add.collider(this.staffs, wallsLayer, this.handleStaffWallCollision, undefined, this);

    this.playerGhostCollider = this.physics.add.collider(
      this.ghosts,
      this.mummy,
      this.handleAttackByGhost,
      undefined,
      this
    );

    // debug mode to show colliding areas
    // debugMask(wallsLayer, this);

    this.renderVisibility();
  }

  update() {
    if (this.mummy && this.vision && this.cursors) {
      this.mummy.update(this.cursors, this.vision);
      this.vision.x = this.mummy.x;
      this.vision.y = this.mummy.y;
    }
  }

  private renderVisibility() {
    const rt = this.make.renderTexture({ height: 32 * this.mapSize, width: 32 * this.mapSize }, true);
    rt.fill(0x000000, 1);
    this.vision = this.make.image({
      key: 'vision',
      add: false
    });
    this.vision.scale = 3;
    rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision);
    sceneEvents.on('mummy-die-end', () => {
      this.tweens.add({ targets: this.vision, scaleX: 100, scaleY: 100, duration: 10000 });
    });
  }
}
