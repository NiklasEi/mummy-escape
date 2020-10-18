import * as Phaser from 'phaser';
import { createBatAnims, createGhostAnims } from '../anims/enemyAnims';
import { createMummyAnims } from '../anims/mummyAnims';
import { sceneEvents } from '../events/EventCenter';

import Ghost from '../enemies/Ghost';
import Bat from '../enemies/Bat';
import '../mummy/Mummy';
// eslint-disable-next-line no-duplicate-imports
import Mummy from '../mummy/Mummy';
import { createSpikeAnimations } from '../anims/trapAnimations';
import { Spikes } from '../traps/Spikes';
import { slotToCenterInTile, slotToPixels } from '../utils/tilePositioning';
import { mapSize, tileSize } from '../utils/constants';
import { batPositions, ghostPositions, mummyStartingPosition, spikePositions, stonePositions } from './positions';

export default class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private mummy!: Mummy;
  private ghosts!: Phaser.Physics.Arcade.Group;
  private bats!: Phaser.Physics.Arcade.Group;
  private spikesGroup!: Phaser.Physics.Arcade.Group;
  private readonly spikes: Spikes[] = [];
  private staffs!: Phaser.Physics.Arcade.Group;
  private stones!: Phaser.Physics.Arcade.Group;
  private vision?: Phaser.GameObjects.Image;
  private playerGhostCollider?: Phaser.Physics.Arcade.Collider;
  private playerBatCollider?: Phaser.Physics.Arcade.Collider;

  private handleAttackByEnemy(_: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const enemy = obj2 as Ghost | Bat;

    const dx = this.mummy.x - enemy.x;
    const dy = this.mummy.y - enemy.y;

    const newDirection = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    // @ts-ignore-next-line
    this.mummy.handleDamage(newDirection);
    // @ts-ignore-next-line
    sceneEvents.emit('health-damage', this.mummy.health);
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

  private handleCollectStones(_: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    obj2.destroy(true);
    this.mummy.collectStones();
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
    createSpikeAnimations(this.anims);

    this.sound.play('backgroundSound', { loop: true, volume: 0.5 });

    // prepare map
    const map = this.make.tilemap({ key: 'pyramid' });
    const tileset = map.addTilesetImage('pyramid', 'tiles', tileSize, tileSize, 1, 2);
    const decoset = map.addTilesetImage('deco', 'decotiles', tileSize, tileSize, 1, 2);
    const decoset2 = map.addTilesetImage('items', 'decotiles2', tileSize, tileSize, 1, 2);


    map.createStaticLayer('Ground', tileset);

    this.spikesGroup = this.physics.add.group({
      classType: Spikes,
      createCallback: (gameObj) => {
        const spike = gameObj as Spikes;
        spike.body.onCollide = true;
      }
    });
    spikePositions
      .map(slotToCenterInTile)
      .forEach((position) => this.spikes.push(this.spikesGroup.get(position.x, position.y, 'spikes')));

    const wallsLayer = map.createStaticLayer('Walls', tileset);
    map.createStaticLayer('Deco', decoset);
    map.createStaticLayer('Deco2', decoset2);

    // prepare player before wall so it walks through doors, not over them
    this.mummy = this.add.mummy(mummyStartingPosition.x * tileSize, mummyStartingPosition.y * tileSize, 'mummy');

    this.cameras.main.startFollow(this.mummy, true);

    wallsLayer.setCollisionByProperty({ collides: true });
    const doorLayer = map.createStaticLayer('Doors', tileset);

    doorLayer.setCollisionByProperty({ collides: true });
    this.staffs = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 1
    });
    this.mummy.giveStaffs(this.staffs);
    this.stones = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image
    });

    stonePositions.map(slotToCenterInTile).forEach((position) => {
      const stone = this.stones.get(position.x, position.y, 'stone');
      stone.scale = 0.5;
    });

    // prepare other entities
    this.ghosts = this.physics.add.group({
      classType: Ghost,
      createCallback: (gameObj) => {
        const ghostObj = gameObj as Ghost;
        ghostObj.body.onCollide = true;
      }
    });
    ghostPositions.map(slotToPixels).forEach((position) => this.ghosts.get(position.x, position.y, 'ghost'));

    this.bats = this.physics.add.group({
      classType: Bat,
      createCallback: (gameObj) => {
        const batObj = gameObj as Bat;
        batObj.body.onCollide = true;
        this.physics.world.enableBody(batObj, Phaser.Physics.Arcade.DYNAMIC_BODY);
        batObj.body.setSize(batObj.width * 0.7, batObj.height * 0.5);
      }
    });

    batPositions.map(slotToPixels).forEach((position) => this.bats.get(position.x, position.y, 'bat'));

    // add colliders
    this.physics.add.collider(this.mummy, wallsLayer);
    this.physics.add.collider(this.ghosts, wallsLayer);
    this.physics.add.collider(this.ghosts, doorLayer);
    this.spikes.forEach((spike) =>
      spike.addCollider(this.physics.add.collider(this.mummy, spike, spike.trigger, undefined, spike))
    );
    this.physics.add.collider(this.bats, wallsLayer);
    this.physics.add.collider(this.bats, doorLayer);
    this.physics.add.collider(this.staffs, this.ghosts, this.handleAttackGhost, undefined, this);
    this.physics.add.collider(this.staffs, wallsLayer, this.handleStaffWallCollision, undefined, this);

    // attack by enemies
    this.playerGhostCollider = this.physics.add.collider(
      this.ghosts,
      this.mummy,
      this.handleAttackByEnemy,
      undefined,
      this
    );
    this.playerBatCollider = this.physics.add.collider(
      this.bats,
      this.mummy,
      this.handleAttackByEnemy,
      undefined,
      this
    );

    this.physics.add.collider(this.stones, this.mummy, this.handleCollectStones, undefined, this);

    sceneEvents.on('mummy-die-start', () => {
      if (this.playerGhostCollider?.active) {
        this.playerGhostCollider.destroy();
      }
      if (this.playerBatCollider?.active) {
        this.playerBatCollider.destroy();
      }
    });

    this.renderVisibility();
  }

  update() {
    if (this.vision && this.cursors) {
      this.mummy.update(this.cursors, this.vision);
      this.vision.x = this.mummy.x;
      this.vision.y = this.mummy.y;
    }
  }

  private renderVisibility() {
    const rt = this.make.renderTexture({ height: tileSize * mapSize, width: tileSize * mapSize }, true);
    this.vision = this.make.image({
      key: 'vision',
      add: false
    });
    const mask = this.make.image({
      key: 'mask',
      add: false
    });
    rt.draw(mask, (mapSize * tileSize) / 2, (mapSize * tileSize) / 2);

    this.vision.scale = 9;
    rt.mask = new Phaser.Display.Masks.BitmapMask(this, this.vision);
    rt.mask.invertAlpha = true;
    sceneEvents.on('mummy-die-end', () => {
      this.tweens.add({ targets: this.vision, scaleX: 100, scaleY: 100, duration: 10000 });
    });
  }
}
