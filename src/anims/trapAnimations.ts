import * as Phaser from "phaser";

export const createSpikeAnimations = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: 'spikes-trigger',
        frames: anims.generateFrameNames('spikes', { start: 1, end: 3, prefix: 'trigger-', suffix: '.png' }),
        frameRate: 10
    });

    anims.create({
        key: 'spikes-idle',
        frames: [{ key: 'spikes', frame: 'trigger-1.png' }]
    });
}
