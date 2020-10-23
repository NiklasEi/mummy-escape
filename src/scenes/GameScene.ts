import * as Phaser from 'phaser';
import { createBatAnims, createGhostAnims } from '../anims/enemyAnims';
import { createMummyAnims } from '../anims/mummyAnims';
import { createTorchAnims } from '../anims/torchAnims';
import { sceneEvents } from '../events/EventCenter';

import Ghost from '../enemies/Ghost';
import Bat from '../enemies/Bat';
import Mummy from '../mummy/Mummy';
import Torch from '../items/Torch';
import { Spikes } from '../traps/Spikes';
import { createSpikeAnimations } from '../anims/trapAnimations';
import { slotToCenterInTile, slotToPixels } from '../utils/tilePositioning';
import { mapSize, tileSize } from '../utils/constants';
import {
  batPositions,
  ghostPositions,
  mummyStartingPosition,
  spikePositions,
  stonePositions,
  itemPositions,
  organPositions,
  torchPositions,
  arrowTrapPositions
} from './positions';
import StaticTilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;
import { ArrowTrap } from '../traps/ArrowTrap';

export default class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  public mummy!: Mummy;
  public ghosts!: Phaser.Physics.Arcade.Group;
  public bats!: Phaser.Physics.Arcade.Group;
  private spikesGroup!: Phaser.Physics.Arcade.Group;
  private readonly spikes: Spikes[] = [];
  private arrowTraps: ArrowTrap[] = [];
  private stones!: Phaser.Physics.Arcade.Group;
  private torch!: Phaser.GameObjects.Image;
  private slingshot!: Phaser.GameObjects.Image;
  private burningTorch!: Phaser.GameObjects.Group;
  private vision?: Phaser.GameObjects.Image;
  private heart!: Phaser.GameObjects.Image;
  private brain!: Phaser.GameObjects.Image;
  private stomach!: Phaser.GameObjects.Image;
  private lungs!: Phaser.GameObjects.Image;
  private soundEvent?: Phaser.Time.TimerEvent;

  public wallsLayer!: StaticTilemapLayer;
  public doorsLayer!: StaticTilemapLayer;

  private playerGhostCollider?: Phaser.Physics.Arcade.Collider;
  private playerBatCollider?: Phaser.Physics.Arcade.Collider;

  private handleAttackByEnemy(_: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const enemy = obj2 as Ghost | Bat;

    const dx = this.mummy.x - enemy.x;
    const dy = this.mummy.y - enemy.y;

    const newDirection = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.mummy.handleDamage(newDirection);
    sceneEvents.emit('health-damage', this.mummy.health);
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
    createTorchAnims(this.anims);

    this.sound.play('backgroundSound', { loop: true, volume: 0.5 });

    if (this.soundEvent) {
      this.soundEvent.destroy();
    }
    this.soundEvent = this.time.addEvent({
      delay: 200,
      callback: () => {
        const index = Phaser.Math.Between(0, 500);
        if (index >= 3) return;
        this.sound.play(`creepy-${index + 1}`, { loop: false, volume: 1 });
      },
      loop: true
    });

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
        this.physics.world.enableBody(spike, Phaser.Physics.Arcade.DYNAMIC_BODY);
        spike.body.setSize(spike.width * 0.4, spike.height * 0.4);
      }
    });
    spikePositions
      .map(slotToCenterInTile)
      .forEach((position) => this.spikes.push(this.spikesGroup.get(position.x, position.y, 'spikes')));
    this.arrowTraps = arrowTrapPositions.map(
      (trap) => new ArrowTrap(this, slotToCenterInTile(trap.trigger), slotToCenterInTile(trap.arrowStart))
    );

    const mummyFactory = this.physics.add.group({
      classType: Mummy,
      createCallback: (gameObj) => {
        const mummy = gameObj as Mummy;
        mummy.name = 'mummy';
        mummy.body.onCollide = true;
        this.physics.world.enableBody(mummy, Phaser.Physics.Arcade.DYNAMIC_BODY);
        mummy.body.setSize(mummy.width * 0.6, mummy.height * 0.9);
      }
    });

    this.wallsLayer = map.createStaticLayer('Walls', tileset);
    this.wallsLayer.setCollisionByProperty({ collides: true });

    map.createStaticLayer('Deco', decoset);
    map.createStaticLayer('Deco2', decoset2);

    // prepare player before wall so it walks through doors, not over them
    this.mummy = mummyFactory.get(mummyStartingPosition.x * tileSize, mummyStartingPosition.y * tileSize, 'mummy');
    this.cameras.main.startFollow(this.mummy, true);
    this.cameras.main.zoom = 2;

    this.doorsLayer = map.createStaticLayer('Doors', tileset);
    this.doorsLayer.setCollisionByProperty({ collides: true });

    const escapeDoor = map.createStaticLayer('EscapeDoor', tileset);
    escapeDoor.setCollisionByProperty({ collides: true });

    this.stones = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image
    });

    const stones = stonePositions.map(slotToCenterInTile).map((position) => {
      const typeOfStone = Phaser.Math.Between(0, 2);
      const stoneImage = ['stone', 'stone1', 'stone2'][typeOfStone];

      const stone = this.stones.get(position.x, position.y, stoneImage);
      stone.scale = 0.4;
      return stone;
    });

    const torchPosition = slotToCenterInTile(itemPositions.torch);
    this.torch = this.physics.add.image(torchPosition.x, torchPosition.y, 'torch');
    this.torch.scale = 0.5;

    const slingshotPosition = slotToCenterInTile(itemPositions.slingshot);
    this.slingshot = this.physics.add.image(slingshotPosition.x, slingshotPosition.y, 'slingshot');
    this.slingshot.scale = 0.5;

    const heartPosition = slotToCenterInTile(organPositions.heart);
    this.heart = this.physics.add.image(heartPosition.x, heartPosition.y, 'heart');
    this.heart.scale = 0.5;

    const brainPosition = slotToCenterInTile(organPositions.brain);
    this.brain = this.physics.add.image(brainPosition.x, brainPosition.y, 'brain');
    this.brain.scale = 0.5;

    const lungsPosition = slotToCenterInTile(organPositions.lungs);
    this.lungs = this.physics.add.image(lungsPosition.x, lungsPosition.y, 'lungs');
    this.lungs.scale = 0.5;

    const stomachPosition = slotToCenterInTile(organPositions.stomach);
    this.stomach = this.physics.add.image(stomachPosition.x, stomachPosition.y, 'stomach');
    this.stomach.scale = 0.5;

    [...stones, this.torch, this.heart, this.brain, this.lungs, this.stomach].forEach(
      (obj: Phaser.GameObjects.Image) => {
        this.tweens.add({
          targets: obj,
          y: obj.y - 7,
          yoyo: true,
          duration: 1500,
          loop: -1
        });
      }
    );

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

    this.burningTorch = this.physics.add.group({
      classType: Torch
    });

    torchPositions
      .map(slotToCenterInTile)
      .forEach((position) => this.burningTorch.get(position.x, position.y, 'torch-anim'));

    // add colliders
    this.physics.add.collider(this.mummy, this.wallsLayer);
    this.physics.add.collider(this.ghosts, this.wallsLayer);
    this.physics.add.collider(this.ghosts, this.doorsLayer);
    this.spikes.forEach((spike) =>
      spike.addCollider(this.physics.add.collider(this.mummy, spike, undefined, spike.trigger, spike))
    );
    this.arrowTraps.forEach((arrowTrap) =>
      arrowTrap.addTriggerCollider(
        this.physics.add.collider(this.mummy, arrowTrap.trigger, undefined, arrowTrap.shoot, arrowTrap)
      )
    );

    this.physics.add.collider(this.bats, this.wallsLayer);
    this.physics.add.collider(this.bats, this.doorsLayer);

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

    this.physics.add.collider(this.stones, this.mummy, this.mummy.collectStone, undefined, this.mummy);
    this.physics.add.collider(this.slingshot, this.mummy, this.mummy.collectSlingshot, undefined, this.mummy);
    this.physics.add.collider(this.torch, this.mummy, this.mummy.collectTorch, undefined, this.mummy);
    this.physics.add.collider(this.brain, this.mummy, this.mummy.collectOrgans, undefined, this.mummy);
    this.physics.add.collider(this.heart, this.mummy, this.mummy.collectOrgans, undefined, this.mummy);
    this.physics.add.collider(this.lungs, this.mummy, this.mummy.collectOrgans, undefined, this.mummy);
    this.physics.add.collider(this.stomach, this.mummy, this.mummy.collectOrgans, undefined, this.mummy);
    this.physics.add.collider(escapeDoor, this.mummy, undefined, this.mummy.escape, this.mummy);

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

      if (this.mummy.torch) {
        this.vision.x = this.mummy.x;
        this.vision.y = this.mummy.y;
      }
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

    const initialVision = slotToCenterInTile(itemPositions.torch);
    this.vision.x = initialVision.x;
    this.vision.y = initialVision.y;

    sceneEvents.once('won', () => {
      const won = this.add.image(this.mummy.x, this.mummy.y, 'win');
      won.scale = 0.5;
      this.scene.pause();
    });

    sceneEvents.once('mummy-die-end', () => {
      if (this.vision) {
        this.vision.x = this.mummy.x;
        this.vision.y = this.mummy.y;
      }
      this.tweens.add({ targets: this.vision, scaleX: 100, scaleY: 100, duration: 10000 });
      setTimeout(() => {
        const restart = this.add.image(this.mummy.x, this.mummy.y + 50, 'restart-button');
        restart.scale = 0.5;
        restart.setInteractive();
        restart.on('pointerdown', () => {
          restart.setTint(0x808080);
        });
        restart.on('pointerup', () => {
          this.scene.restart();
        });
      }, 2000);
    });
  }
}
