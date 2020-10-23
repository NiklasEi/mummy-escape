import { Position } from '../scenes/positions';
import GameScene from '../scenes/GameScene';
import { sceneEvents } from '../events/EventCenter';
import { HealthState } from '../mummy/Mummy';
import Vector2 = Phaser.Math.Vector2;

export class ArrowTrap {
  public triggered = false;
  public trigger: Phaser.Physics.Arcade.Image;
  private triggerColliders: Phaser.Physics.Arcade.Collider[] = [];

  constructor(
    private readonly scene: GameScene,
    private readonly triggerPosition: Position,
    private readonly arrowStartPosition: Position
  ) {
    this.trigger = this.scene.physics.add.image(this.triggerPosition.x, this.triggerPosition.y, 'trigger');
    this.trigger.scale = 0.3;
    this.trigger.body.onCollide = true;
  }

  shoot(): boolean {
    if (this.triggered) return false;
    this.triggered = true;
    this.destroyTriggerColliders();
    this.scene.sound.play('arrowtrigger', { loop: false, volume: 1.5 });

    const arrow = this.scene.physics.add.image(this.arrowStartPosition.x, this.arrowStartPosition.y, 'arrow');
    const direction = new Vector2(
      this.triggerPosition.x - this.arrowStartPosition.x,
      this.triggerPosition.y - this.arrowStartPosition.y
    );
    this.scene.physics.world.enableBody(arrow, Phaser.Physics.Arcade.DYNAMIC_BODY);
    arrow.body.setSize(arrow.width * 0.3, arrow.height * 0.3);
    arrow.setAngle(this.getOffsetAngle(direction));
    arrow.name = 'shot arrow';
    arrow.scale = 0.8;
    arrow.body.onCollide = true;
    arrow.setActive(true);
    arrow.setVisible(true);

    this.scene.physics.add.collider(this.scene.mummy, arrow, undefined, this.hitPlayer, this);
    this.scene.physics.add.collider(arrow, this.scene.wallsLayer, this.destroyArrow, undefined, this);
    this.scene.physics.add.collider(arrow, this.scene.doorsLayer, this.destroyArrow, undefined, this);
    const speed = direction.normalize().scale(300);
    arrow.setVelocity(speed.x, speed.y);
    return false;
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

  private getOffsetAngle(direction: Phaser.Math.Vector2): number {
    return 45 + 180 + (direction.angle() / (2 * Math.PI)) * 360;
  }

  private hitPlayer(_: Phaser.GameObjects.GameObject, arrow: Phaser.GameObjects.GameObject): boolean {
    if (this.scene.mummy.healthState !== HealthState.IDLE) return false;
    if (arrow.name === 'shot arrow') {
      const shotArrow = arrow as Phaser.Physics.Arcade.Image;
      const knockBack = new Phaser.Math.Vector2(this.scene.mummy.x - shotArrow.x, this.scene.mummy.y - shotArrow.y)
        .normalize()
        .scale(200);
      shotArrow.setVelocity(knockBack.x, knockBack.y);
      this.scene.mummy.handleDamage(knockBack);
      sceneEvents.emit('health-damage', this.scene.mummy.health);
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (this.scene.mummy.healthState !== HealthState.DEAD) {
        sceneEvents.once('mummy-state-idle', () => arrow.destroy());
      } else {
        sceneEvents.once('mummy-die-end', () => {
          if (shotArrow.active) {
            shotArrow.setVelocity(0, 0);
          }
        });
      }
    }
    return false;
  }

  private destroyArrow(arrow: Phaser.GameObjects.GameObject, _: Phaser.GameObjects.GameObject): boolean {
    if (arrow.name === 'shot arrow') {
      arrow.destroy();
    }
    return false;
  }
}
