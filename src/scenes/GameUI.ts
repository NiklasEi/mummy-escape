import * as Phaser from 'phaser';

import { sceneEvents } from "../events/EventCenter";

export default class GameUI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group;
  private handleHealthDamage(health: number) {
    this.hearts.children.each((childObj, index) => {
        const heart = childObj as Phaser.GameObjects.Image;

        if (index < health) {
				heart.setTexture('heart-full')
        } else {
            heart.setTexture('heart-empty');
        }
    })
  }

  constructor() {
    super({ key: 'gameUI' });
  }

  create() {
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image
    });

    this.hearts.createMultiple({
      key: 'heart-full',
      setXY: {
        x: 10,
        y: 10,
        stepX: 16
      },
      quantity: 3
    });

    sceneEvents.on('health-damage', this.handleHealthDamage, this);

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
        sceneEvents.off('health-damage', this.handleHealthDamage, this);
    })
  }

}
