import * as Phaser from 'phaser';
import { sceneEvents } from '../events/EventCenter';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      mummy(x: number, y: number, texture: string, frame?: string | number): Mummy;
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

export default class Mummy extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE;
  private damageTime = 0;
  private _health = 3;
  private dead = false;
  private staffs?: Phaser.Physics.Arcade.Group;

  private throwStaff() {
    if (!this.staffs) return;
    const direction = this.anims.currentAnim.key.split('-')[2];
    const vec = new Phaser.Math.Vector2(0, 0);

    switch (direction) {
      case 'up':
        vec.y = -1;
        break;
      case 'down':
        vec.y = 1;
        break;
      case 'left':
        vec.x = -1;
        break;
      case 'right':
        vec.x = 1;
        break;
    }

    const angle = vec.angle();
    const staff = this.staffs.get(this.x, this.y, 'staff') as Phaser.Physics.Arcade.Image;

    staff.setActive(true);
    staff.setVisible(true);
    staff.setRotation(angle);
    staff.setVelocity(vec.x * 300, vec.y * 300);
  }
  get health() {
    return this._health;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.anims.play('mummy-idle-down');
  }

  giveStaffs(staffs: Phaser.Physics.Arcade.Group) {
    this.staffs = staffs;
  }

  handleDamage(direction: Phaser.Math.Vector2) {
//     if (this._health <= 0) return;

    if (this.healthState === HealthState.DAMAGE) return;

    this.setVelocity(direction.x, direction.y);

    this.setTint(0xff0000);

    this.healthState = HealthState.DAMAGE;
    this.damageTime = 0;
    --this._health;

    if (this._health <= 0) {
      this.healthState = HealthState.DEAD;
      this.setTint(0xff0000);

      // TODO: set die animation
      this.anims.play('mummy-idle-down');
      this.setVelocity(0, 0);
      sceneEvents.emit('mummy-die-start');
    }
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);

    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += dt;

        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
      case HealthState.DEAD:
        if (this.dead) {
          return;
        }
        this.damageTime += dt;

        if (this.damageTime >= 250) {
          this.dead = true;
          this.anims.play('mummy-idle-down');
          sceneEvents.emit('mummy-die-end');
          this.setVelocity(0, 0);
          this.damageTime = 0;
        }
        break;
    }
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, vision: Phaser.GameObjects.Image) {
    if (this.healthState === HealthState.DAMAGE || this.healthState === HealthState.DEAD) return;
    if (!cursors) return;
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      this.throwStaff();
      return;
    }

    const speed = 100;
    if (cursors.left?.isDown) {
      this.anims.play('mummy-run-left', true);
      this.setVelocity(-speed, 0);
      vision.setAngle(180);
    } else if (cursors.right?.isDown) {
      this.anims.play('mummy-run-right', true);
      this.setVelocity(speed, 0);
      vision.setAngle(0);
    } else if (cursors.up?.isDown) {
      this.anims.play('mummy-run-up', true);
      this.setVelocity(0, -speed);
      vision.setAngle(-90);
    } else if (cursors.down?.isDown) {
      this.anims.play('mummy-run-down', true);
      this.setVelocity(0, speed);
      vision.setAngle(90);
    } else {
      const parts = this.anims.currentAnim.key.split('-');
      parts[1] = 'idle';
      this.anims.play(parts.join('-'));
      this.setVelocity(0, 0);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register('mummy', function (
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  texture: string,
  frame?: number | string
) {
  const sprite = new Mummy(this.scene, x, y, texture, frame);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

  sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8);
  sprite.body.setSize(sprite.width * 0.6, sprite.height * 0.8);

  return sprite;
});
