import * as Phaser from 'phaser';

const createGhostAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'ghost-idle',
    frames: anims.generateFrameNames('ghost', { start: 1, end: 3, prefix: 'ghost-idle-', suffix: '.png' }),
    repeat: -1,
    frameRate: 10
  });

  anims.create({
    key: 'ghost-run',
    frames: anims.generateFrameNames('ghost', { start: 1, end: 3, prefix: 'run-left-', suffix: '.png' }),
    repeat: -1,
    frameRate: 10
  });
};

export { createGhostAnims };
