import * as Phaser from 'phaser';

import { debugMask } from '../utils/debug';
import { createGhostAnims } from '../anims/EnemyAnims';
import { createMummyAnims } from '../anims/MummyAnims';
import { sceneEvents } from "../events/EventCenter";

import Ghost from '../enemies/Ghost';
import Mummy from '../mummy/Mummy';
import '../mummy/Mummy';

export default class Game extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private mummy?: Mummy;

  private handleAttackByGhost(_: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
    const ghost = obj2 as Ghost;

    const dx = this.mummy.x - ghost.x;
    const dy = this.mummy.y - ghost.y;

    const newDirection = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.mummy.handleDamage(newDirection);
    sceneEvents.emit('health-damage', this.mummy.health)
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

    const map = this.make.tilemap({ key: 'pyramid' });
    const tileset = map.addTilesetImage('pyramid', 'tiles', 32, 32, 1, 2);

    map.createStaticLayer('Ground', tileset);
    const wallsLayer = map.createStaticLayer('Walls', tileset);

    wallsLayer.setCollisionByProperty({ collides: true });

    // debug mode to show colliding areas
    debugMask(wallsLayer, this);

    this.mummy = this.add.mummy(450, 600, 'mummy');

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
    this.physics.add.collider(ghosts, this.mummy, this.handleAttackByGhost, undefined, this);
  }

  update(t: number, dt: number) {
    if (this.mummy) {
      this.mummy.update(this.cursors);
    }
  }
}
