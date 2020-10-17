import * as Phaser from 'phaser';
import { Position } from '../scenes/GameScene';

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

const randomDirection = (exclude: Direction) => {
  let newDirection = Phaser.Math.Between(0, 3);

  while (newDirection === exclude) {
    newDirection = Phaser.Math.Between(0, 3);
  }

  return newDirection;
};

export const batPositions: Position[] = [
  { x: 47, y: 47 },
  { x: 52, y: 47 }
];

export default class Bat extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.RIGHT;
  private readonly moveEvent: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.anims.play('bat-fly');
    scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);

    //
    //   bat.body.setSize(bat.width * 0.6);
    //
    // bat.transform.scaleY = 0.5

    this.moveEvent = scene.time.addEvent({
      delay: 1000,
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
