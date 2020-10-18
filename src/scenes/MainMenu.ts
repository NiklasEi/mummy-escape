import * as Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
  private playButton!: Phaser.GameObjects.Image;

  constructor() {
    super('mainMenu');
  }

  create() {
    this.playButton = this.add.image(this.game.renderer.width / 2, (this.game.renderer.height * 2) / 3, 'button');
    this.playButton.scale = 2;
    this.playButton.setInteractive();
    const text = this.add.text(this.game.renderer.width / 2 - 55, (this.game.renderer.height * 2) / 3 - 25, 'START');
    text.scale = 2;

    this.playButton.on('pointerup', () => {
      this.playButton.setTexture('button-press');
      setTimeout(() => this.scene.start('game'), 500);
    });
  }
}
