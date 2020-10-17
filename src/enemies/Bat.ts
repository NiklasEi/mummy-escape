import * as Phaser from 'phaser';
import { Position } from '../scenes/GameScene';
import {Direction, randomDirection} from "../utils/direction";

export const batPositions: Position[] = [
  { x: 49 * 32, y: 47 * 32 },
  { x: 52 * 32, y: 47 * 32 }
];

export default class Bat extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.RIGHT;
  private readonly moveEvent: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.anims.play('bat-fly');
    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);
    this.direction = randomDirection();
    //
    //   bat.body.setSize(bat.width * 0.6);
    //
    // bat.transform.scaleY = 0.5

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => (this.direction = randomDirection(this.direction)),
      loop: true
    });
  }

  destroy(fromScene?: boolean) {
    this.moveEvent.destroy();
    super.destroy(fromScene);
  }

  private handleTileCollision(object: Phaser.GameObjects.GameObject) {
    if (object !== this) return;

    this.direction = randomDirection(this.direction);
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);

    const speed = 50;

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -speed);
        break;
      case Direction.DOWN:
        this.setVelocity(0, speed);
        break;
      case Direction.LEFT:
        this.setVelocity(-speed, 0);
        break;
      case Direction.RIGHT:
        this.setVelocity(speed, 0);
        break;
    }
  }
}
