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
  private vision?: Phaser.GameObjects.Image;

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
    this.sound.play('backgroundSound', { loop: true, volume: 0.5 });

    // prepare map
    const map = this.make.tilemap({ key: 'pyramid' });
    const tileset = map.addTilesetImage('pyramid', 'tiles', 32, 32, 1, 2);

    map.createStaticLayer('Ground', tileset);

    // prepare player before wall so it walks through doors, not over them
    this.mummy = this.add.mummy(this.mummyStartingPosition.x, this.mummyStartingPosition.y, 'mummy');

    const wallsLayer = map.createStaticLayer('Walls', tileset);
    wallsLayer.setCollisionByProperty({ collides: true });
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
    ghosts.get(this.ghostStartingPosition.x, this.ghostStartingPosition.y, 'ghost');

    this.physics.add.collider(ghosts, this.mummy, this.handleAttackByGhost, undefined, this);
    this.physics.add.collider(ghosts, wallsLayer);

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