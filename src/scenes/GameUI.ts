import * as Phaser from 'phaser';

import { sceneEvents } from '../events/EventCenter';

export default class GameUI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group;
  private stones = 0;
  private text!: any;

  private handleHealthDamage(health: number) {
    this.hearts.children.each((childObj, index) => {
      const heart = childObj as Phaser.GameObjects.Image;

      if (index < health) {
        heart.setTexture('heart-full');
      } else {
        heart.setTexture('heart-empty');
      }
    });
  }

  private handleStone(restStones: number) {
    this.stones = restStones;
    this.text.setText(this.stones);
  }

  private handleOrgans(organs: string[]) {
    organs.forEach((organ, index) => {
      const newOrgan = this.physics.add.image(20 + index * 30, 85, organ);
      newOrgan.scale = 0.7;
    });
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
        x: 20,
        y: 20,
        stepX: 32
      },
      'setScale.x': 2,
      'setScale.y': 2,
      quantity: 3
    });

    const stone = this.physics.add.image(20, 55, 'stone');
    stone.scale = 0.7;
    this.stones = 0;
    this.text = this.add.text(35, 45, this.stones.toString());

    sceneEvents.on('health-damage', this.handleHealthDamage, this);
    sceneEvents.on('collect-stone', this.handleStone, this);
    sceneEvents.on('collect-organs', this.handleOrgans, this);

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off('health-damage', this.handleHealthDamage, this);
      sceneEvents.off('collect-stone', this.handleStone, this);
      sceneEvents.off('collect-organs', this.handleOrgans, this);
    });
  }
}
