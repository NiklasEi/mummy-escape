import * as Phaser from 'phaser';

export const createTorchAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'torch-burning',
    frames: anims.generateFrameNames('torch-anim', { start: 0, end: 5, prefix: 'torch_anim_f', suffix: '.png' }),
    repeat: -1,
    frameRate: 10
  });
};
