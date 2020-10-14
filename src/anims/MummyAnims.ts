import * as Phaser from 'phaser';

const createMummyAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'mummy-idle-down',
    frames: [{ key: 'mummy', frame: 'run-down-1.png' }]
  });

  anims.create({
    key: 'mummy-idle-up',
    frames: [{ key: 'mummy', frame: 'run-up-1' }]
  });

  anims.create({
    key: 'mummy-idle-left',
    frames: [{ key: 'mummy', frame: 'run-left-1' }]
  });

  anims.create({
    key: 'mummy-idle-right',
    frames: [{ key: 'mummy', frame: 'run-right-1' }]
  });

  anims.create({
    key: 'mummy-run-down',
    frames: anims.generateFrameNames('mummy', { start: 1, end: 3, prefix: 'run-down-', suffix: '.png' }),
    repeat: -1,
    frameRate: 10
  });

  anims.create({
    key: 'mummy-run-up',
    frames: anims.generateFrameNames('mummy', { start: 1, end: 3, prefix: 'run-up-', suffix: '.png' }),
    repeat: -1,
    frameRate: 10
  });

  anims.create({
    key: 'mummy-run-left',
    frames: anims.generateFrameNames('mummy', { start: 1, end: 3, prefix: 'run-left-', suffix: '.png' }),
    repeat: -1,
    frameRate: 10
  });

  anims.create({
    key: 'mummy-run-right',
    frames: anims.generateFrameNames('mummy', { start: 1, end: 3, prefix: 'run-right-', suffix: '.png' }),
    repeat: -1,
    frameRate: 10
  });
};

export { createMummyAnims };
