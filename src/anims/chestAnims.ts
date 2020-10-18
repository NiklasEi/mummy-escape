import * as Phaser from 'phaser';

export const createChestAnimations = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'chest-open',
    frames: anims.generateFrameNames('chest', { start: 0, end: 2, prefix: 'chest_full_open_anim_f', suffix: '.png' }),
    frameRate: 10
  });

  anims.create({
    key: 'chest-close',
    frames: [{ key: 'chest', frame: 'chest_full_open_anim_f0.png' }]
  });
};
