import * as Phaser from 'phaser';

import { sceneEvents } from '../events/EventCenter';
import { Organs } from '../mummy/Organs';

export default class GameUI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group;
  private text!: any;
  private readonly organs: string[];

  constructor() {
    super({ key: 'gameUI' });
    this.organs = [Organs.BRAIN, Organs.HEART, Organs.LUNGS, Organs.STOMACH];
  }

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
    const stone = this.physics.add.image(50, 85, 'stone');
    stone.scale = 0.9;

    if (restStones === 0) {
      stone.setTint(0x808080);
    } else {
      stone.clearTint();
      this.text.clearTint();
    }

    this.text.setText(restStones);
  }

  private handleOrgans(organs: string[]) {
    this.organs.forEach((organ, index) => {
      const newOrgan = this.physics.add.image(20 + index * 30, 55, organ);
      if (!organs.includes(organ)) {
        newOrgan.setTint(0x808080);
      }
    });
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

    const lamp = this.physics.add.image(20, 115, 'lamp');
    lamp.setTint(0x808080);

    const slingshot = this.physics.add.image(20, 85, 'slingshot');
    slingshot.setTint(0x808080);

    this.text = this.add.text(65, 78, '0');
    this.text.setTint(0x808080);

    this.handleOrgans([]);
    this.handleStone(0);

    sceneEvents.on('health-damage', this.handleHealthDamage, this);
    sceneEvents.on('collect-stone', this.handleStone, this);
    sceneEvents.on('collect-organs', this.handleOrgans, this);
    sceneEvents.on('better-light', () => {
      lamp.clearTint();
    });
    sceneEvents.on('collect-slingshot', () => {
      slingshot.clearTint();
    });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off('health-damage', this.handleHealthDamage, this);
      sceneEvents.off('collect-stone', this.handleStone, this);
      sceneEvents.off('collect-organs', this.handleOrgans, this);
    });
  }
}
