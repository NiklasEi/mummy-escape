import * as Phaser from 'phaser';
import { sceneEvents } from '../events/EventCenter';
import GameObject = Phaser.GameObjects.GameObject;
import { getViewDirection } from '../utils/getViewDirection';

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

export default class Mummy extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE;
  private damageTime = 0;
  private _health = 3;
  private _stones = 0;
  private dead = false;

  private shootStone() {
    if (this._stones < -1) return;
    const stone = this.scene.physics.add.image(this.x, this.y, 'stone');
    stone.scale = 0.3;
    stone.body.onCollide = true;
    const direction = getViewDirection(this.anims.currentAnim.key.split('-')[2]);
    stone.setActive(true);
    stone.setVisible(true);

    const speed = direction.scale(200);
    stone.setVelocity(speed.x, speed.y);
  }

  get health() {
    return this._health;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.anims.play('mummy-idle-down');
  }

  collectStone(_mummy: GameObject, stone: GameObject) {
    stone.destroy();
    this._stones++;
  }

  handleDamage(knockBack?: Phaser.Math.Vector2) {
    if (this.healthState === HealthState.DAMAGE) return;

    if (knockBack) {
      this.setVelocity(knockBack.x, knockBack.y);
    }

    this.setTint(0xff0000);

    this.healthState = HealthState.DAMAGE;
    this.damageTime = 0;
    this._health = this._health - 1;

    if (this.health <= 0) {
      this.healthState = HealthState.DEAD;
      sceneEvents.emit('mummy-die-start');
    }
  }

  preUpdate(t: number, dt: number) {
    if (this.dead) {
      return;
    }
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

    // @ts-ignore-next-line
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      this.shootStone();
      return;
    }

    const speed = 125;
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
