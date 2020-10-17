import * as Phaser from 'phaser';
import { createGhostAnims, createBatAnims } from '../anims/EnemyAnims';
import { createMummyAnims } from '../anims/MummyAnims';
import { sceneEvents } from '../events/EventCenter';

import Ghost, { ghostPositions } from '../enemies/Ghost';
import Bat, { batPositions } from '../enemies/Bat';
import '../mummy/Mummy';
// eslint-disable-next-line no-duplicate-imports
import Mummy from '../mummy/Mummy';

export interface Position {
  x: number;
  y: number;
}

export default class GameScene extends Phaser.Scene {
  private readonly mapSize = 100;
  private readonly mummyStartingPosition: Position = {
    x: 50 * 32,
    y: 50 * 32
  };
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private mummy?: Mummy;
  private ghosts!: Phaser.Physics.Arcade.Group;
  private bats!: Phaser.Physics.Arcade.Group;
  private staffs!: Phaser.Physics.Arcade.Group;
  private vision?: Phaser.GameObjects.Image;
  private playerEnemyCollider?: Phaser.Physics.Arcade.Collider;

  private handleAttackByEnemy(_: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    if (!this.mummy) {
      return;
    }
    const enemy = obj2 as Ghost | Bat;

    const dx = this.mummy.x - enemy.x;
    const dy = this.mummy.y - enemy.y;

    const newDirection = new Phaser.Math.Vector2(dx, dy).normalize().scale(100);

    // @ts-ignore-next-line
    this.mummy.handleDamage(newDirection);
    // @ts-ignore-next-line
    sceneEvents.emit('health-damage', this.mummy.health);

    // @ts-ignore-next-line
    if (this.mummy.health <= 0) {
      this.playerEnemyCollider?.destroy();
    }
  }

  private handleAttackGhost(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    this.staffs.killAndHide(obj1);
    obj1.destroy(true);
    this.ghosts.killAndHide(obj2);
    obj2.destroy(true);
  }

  private handleStaffWallCollision(obj1: Phaser.GameObjects.GameObject, _: Phaser.GameObjects.GameObject) {
    this.staffs.killAndHide(obj1);
    obj1.destroy(true);
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
    createBatAnims(this.anims);

    this.sound.play('backgroundSound', { loop: true, volume: 0.5 });

    // prepare map
    const map = this.make.tilemap({ key: 'pyramid' });
    const tileset = map.addTilesetImage('pyramid', 'tiles', 32, 32, 1, 2);

    map.createStaticLayer('Ground', tileset);

    // prepare player before wall so it walks through doors, not over them
    this.mummy = this.add.mummy(this.mummyStartingPosition.x, this.mummyStartingPosition.y, 'mummy');
    this.cameras.main.startFollow(this.mummy, true);

    const wallsLayer = map.createStaticLayer('Walls', tileset);
    wallsLayer.setCollisionByProperty({ collides: true });

    this.staffs = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3
    });

    this.mummy.giveStaffs(this.staffs);

    // prepare other entities
    this.ghosts = this.physics.add.group({
      classType: Ghost,
      createCallback: (gameObj) => {
        const ghostObj = gameObj as Ghost;
        ghostObj.body.onCollide = true;
      }
    });
    ghostPositions.forEach((position) => this.ghosts.get(position.x * 32, position.y * 32, 'ghost'));

    this.bats = this.physics.add.group({
      classType: Bat,
      createCallback: (gameObj) => {
        const batObj = gameObj as Bat;
        batObj.body.onCollide = true;
        this.physics.world.enableBody(batObj, Phaser.Physics.Arcade.DYNAMIC_BODY);
        batObj.body.setSize(batObj.width * 0.7, batObj.height * 0.5);
      }
    });
    batPositions.forEach((position) => this.bats.get(position.x * 32, position.y * 32, 'bat'));

    // add colliders
    this.physics.add.collider(this.mummy, wallsLayer);
    this.physics.add.collider(this.ghosts, wallsLayer);
    this.physics.add.collider(this.bats, wallsLayer);
    this.physics.add.collider(this.staffs, this.ghosts, this.handleAttackGhost, undefined, this);
    this.physics.add.collider(this.staffs, wallsLayer, this.handleStaffWallCollision, undefined, this);

    // attack by enemies
    this.playerEnemyCollider = this.physics.add.collider(
      this.ghosts,
      this.mummy,
      this.handleAttackByEnemy,
      undefined,
      this
    );
    this.playerEnemyCollider = this.physics.add.collider(
      this.bats,
      this.mummy,
      this.handleAttackByEnemy,
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
    this.vision = this.make.image({
      key: 'vision',
      add: false
    });
    const mask = this.make.image({
      key: 'mask',
      add: false
    });
    rt.draw(mask, this.mapSize * 16, this.mapSize * 16);

    this.vision.scale = 9;
    rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision);
    rt.mask.invertAlpha = true;
    sceneEvents.on('mummy-die-end', () => {
      this.tweens.add({ targets: this.vision, scaleX: 100, scaleY: 100, duration: 10000 });
    });
  }
}
