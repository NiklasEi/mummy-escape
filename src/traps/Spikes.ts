import * as Phaser from "phaser";
import {Position} from "../scenes/GameScene";

export const spikePositions: Position[] = [
    { x: 48, y: 47 },
    { x: 50, y: 48 }
];

export class Spikes extends Phaser.Physics.Arcade.Sprite {
    private colliders: Phaser.Physics.Arcade.Collider[] = []

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        this.anims.play('spikes-idle');
    }

    trigger() {
        this.anims.play('spikes-trigger')
        this.setVelocity(0, 0);
        this.destroyColliders();
    }

    addCollider(collider: Phaser.Physics.Arcade.Collider) {
        this.colliders.push(collider);
    }

    destroyColliders() {
        this.colliders.forEach(collider => {
            if (collider.active) {
                collider.destroy();
            }
        })
        this.colliders = [];
    }
}
