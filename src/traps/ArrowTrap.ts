import { Scene } from 'phaser';
import { Position } from '../scenes/positions';
import Vector2 = Phaser.Math.Vector2;

export class ArrowTrap {
  public triggered = false;
  public trigger: Phaser.Physics.Arcade.Image;
  private triggerColliders: Phaser.Physics.Arcade.Collider[] = [];

  constructor(
    private readonly scene: Scene,
    private readonly triggerPosition: Position,
    private readonly arrowStartPosition: Position
  ) {
    this.trigger = this.scene.physics.add.image(this.triggerPosition.x, this.triggerPosition.y, 'trigger');
    this.trigger.scale = 0.3;
    this.trigger.body.onCollide = true;
  }

  shoot() {
    if (this.triggered) return;
    this.triggered = true;
    this.destroyTriggerColliders();

    const arrow = this.scene.physics.add.image(this.arrowStartPosition.x, this.arrowStartPosition.y, 'arrow');
    arrow.name = 'thrown stone';
    arrow.scale = 0.3;
    arrow.body.onCollide = true;
    const direction = new Vector2(
      this.triggerPosition.x - this.arrowStartPosition.x,
      this.triggerPosition.y - this.arrowStartPosition.y
    );
    arrow.setActive(true);
    arrow.setVisible(true);

    const speed = direction.normalize().scale(200);
    arrow.setVelocity(speed.x, speed.y);
  }

  addTriggerCollider(collider: Phaser.Physics.Arcade.Collider) {
    this.triggerColliders.push(collider);
  }

  destroyTriggerColliders() {
    this.triggerColliders.forEach((collider) => {
      if (collider.active) {
        collider.destroy();
      }
    });
    this.triggerColliders = [];
  }
}
