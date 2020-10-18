import * as Phaser from 'phaser';
import GameObject = Phaser.GameObjects.GameObject;

export default class Chests extends Phaser.Physics.Arcade.Sprite {
  private colliders: Phaser.Physics.Arcade.Collider[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.anims.play('chest-close');
  }

  trigger(_entity: GameObject, _chest: GameObject) {
    this.anims.play('chest-open');
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
