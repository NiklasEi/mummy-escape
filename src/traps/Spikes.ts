import * as Phaser from 'phaser';
import GameObject = Phaser.GameObjects.GameObject;
import Mummy from '../mummy/Mummy';
import { sceneEvents } from '../events/EventCenter';

export class Spikes extends Phaser.Physics.Arcade.Sprite {
  private colliders: Phaser.Physics.Arcade.Collider[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.anims.play('spikes-idle');
  }

  trigger(entity: GameObject, _spike: GameObject): boolean {
    this.anims.play('spikes-trigger');
    this.setVelocity(0, 0);
    this.scene.sound.play('spikes-sound', { loop: false, volume: 1 });
    this.destroyColliders();
    if (entity.name === 'mummy') {
      const mummy = entity as Mummy;
      mummy.handleDamage(undefined);
      sceneEvents.emit('health-damage', mummy.health);
    }
    return false;
  }

  addCollider(collider: Phaser.Physics.Arcade.Collider) {
    this.colliders.push(collider);
  }

  destroyColliders() {
    this.colliders.forEach((collider) => {
      if (collider.active) {
        collider.destroy();
      }
    });
    this.colliders = [];
  }
}
