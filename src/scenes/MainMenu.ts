import * as Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
  private playButton!: Phaser.GameObjects.Image;

  constructor() {
    super('mainMenu');
  }

  create() {
    this.playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'button').setDepth(1);
    this.playButton.setInteractive();

    this.playButton.on('pointerup', () => {
      this.playButton = this.add
        .image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'button-press')
        .setDepth(1);
      this.scene.start('game');
    });
  }
}
